import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { applicationStatusNotifications, jobApplications } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { applicationStatusEmail } from "@/lib/email-templates";
import { isApplicationStatus, type ApplicationStatus } from "@/lib/job-applications";
import { sendResendEmail } from "@/lib/resend";
import { createHash } from "crypto";

type RouteContext = { params: Promise<{ id: string }> };

const emailStatuses = new Set<ApplicationStatus>([
  "shortlisted",
  "interview",
  "selected",
  "rejected",
]);

const subjectByStatus: Record<"shortlisted" | "interview" | "selected" | "rejected", string> = {
  shortlisted: "Your application has been shortlisted",
  interview: "Interview scheduled",
  selected: "Congratulations — application successful",
  rejected: "Application update",
};

function parseApplicationId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function formatInterviewDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = parseApplicationId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });

  try {
    const body = await request.json();
    const status = body.status;
    if (!isApplicationStatus(status)) {
      return NextResponse.json({ error: "Invalid application status" }, { status: 400 });
    }

    const [application] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, id))
      .limit(1);

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const note = cleanText(body.note, 3000);
    const interviewTimezone = cleanText(body.interviewTimezone, 100);
    const interviewLocation = cleanText(body.interviewLocation, 1000);
    const interviewNotes = cleanText(body.interviewNotes, 3000);
    let interviewAt: Date | null = null;
    let formattedInterviewDate: string | undefined;

    if (status === "interview") {
      interviewAt = new Date(body.interviewAt);
      if (Number.isNaN(interviewAt.getTime()) || !interviewTimezone || !interviewLocation) {
        return NextResponse.json(
          { error: "Interview date, timezone, and location or meeting link are required" },
          { status: 400 },
        );
      }

      try {
        formattedInterviewDate = formatInterviewDate(interviewAt, interviewTimezone);
      } catch {
        return NextResponse.json({ error: "Enter a valid interview timezone" }, { status: 400 });
      }
    }

    if (emailStatuses.has(status)) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        return NextResponse.json(
          { error: "Email service is not configured. Status was not changed." },
          { status: 503 },
        );
      }

      const emailStatus = status as "shortlisted" | "interview" | "selected" | "rejected";
      const fingerprint = createHash("sha256")
        .update(JSON.stringify({
          applicationId: id,
          status: emailStatus,
          note,
          interviewAt: interviewAt?.toISOString() || null,
          interviewTimezone,
          interviewLocation,
          interviewNotes,
        }))
        .digest("hex");

      let notificationReservation: { id: number };
      try {
        [notificationReservation] = await db
          .insert(applicationStatusNotifications)
          .values({ applicationId: id, fingerprint })
          .returning({ id: applicationStatusNotifications.id });
      } catch (error) {
        if (error instanceof Error && /unique|duplicate/i.test(error.message)) {
          return NextResponse.json(
            { error: "This exact status notification has already been sent." },
            { status: 409 },
          );
        }
        throw error;
      }

      const emailResult = await (async () => {
        try {
          const site = await getSiteSettings();
          const fromAddress = process.env.CONTACT_FROM_EMAIL || `${site.name} Careers <hello@voquarn.com>`;
          return await sendResendEmail(resendApiKey, {
            from: fromAddress,
            to: application.email,
            replyTo: site.email,
            subject: `${subjectByStatus[emailStatus]} — ${application.role}`,
            html: applicationStatusEmail(site, {
              name: application.name,
              role: application.role,
              status: emailStatus,
              note: note || interviewNotes || undefined,
              interviewDate: formattedInterviewDate,
              interviewTimezone: interviewTimezone || undefined,
              interviewLocation: interviewLocation || undefined,
            }),
          });
        } catch (error) {
          await db
            .delete(applicationStatusNotifications)
            .where(eq(applicationStatusNotifications.id, notificationReservation.id));
          throw error;
        }
      })();

      if (!emailResult.ok) {
        await db
          .delete(applicationStatusNotifications)
          .where(eq(applicationStatusNotifications.id, notificationReservation.id));
        console.error("Application status email error:", emailResult.status);
        return NextResponse.json(
          { error: "Email could not be sent. Status was not changed." },
          { status: 502 },
        );
      }
    }

    const now = new Date();
    const [updated] = await db
      .update(jobApplications)
      .set({
        status,
        statusNote: note || null,
        interviewAt: status === "interview" ? interviewAt : application.interviewAt,
        interviewTimezone: status === "interview" ? interviewTimezone : application.interviewTimezone,
        interviewLocation: status === "interview" ? interviewLocation : application.interviewLocation,
        interviewNotes: status === "interview" ? interviewNotes || null : application.interviewNotes,
        statusUpdatedAt: now,
        updatedAt: now,
      })
      .where(eq(jobApplications.id, id))
      .returning({
        id: jobApplications.id,
        status: jobApplications.status,
        statusNote: jobApplications.statusNote,
        interviewAt: jobApplications.interviewAt,
        interviewTimezone: jobApplications.interviewTimezone,
        interviewLocation: jobApplications.interviewLocation,
        interviewNotes: jobApplications.interviewNotes,
        statusUpdatedAt: jobApplications.statusUpdatedAt,
        updatedAt: jobApplications.updatedAt,
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/applications/[id] error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = parseApplicationId(rawId);
  if (!id) return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });

  try {
    const [deleted] = await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, id))
      .returning({ id: jobApplications.id });
    if (!deleted) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/applications/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
