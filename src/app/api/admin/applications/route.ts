import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const applications = await db
      .select({
        id: jobApplications.id,
        name: jobApplications.name,
        email: jobApplications.email,
        phone: jobApplications.phone,
        role: jobApplications.role,
        githubUrl: jobApplications.githubUrl,
        websiteUrl: jobApplications.websiteUrl,
        message: jobApplications.message,
        cvFileName: jobApplications.cvFileName,
        status: jobApplications.status,
        statusNote: jobApplications.statusNote,
        interviewAt: jobApplications.interviewAt,
        interviewTimezone: jobApplications.interviewTimezone,
        interviewLocation: jobApplications.interviewLocation,
        interviewNotes: jobApplications.interviewNotes,
        statusUpdatedAt: jobApplications.statusUpdatedAt,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
      })
      .from(jobApplications)
      .orderBy(desc(jobApplications.createdAt));

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/admin/applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
