import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";
import { applyAdminEmail, applyUserEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";

type ApplyPayload = {
  name: string;
  email: string;
  phone: string;
  role: string;
  github?: string;
  website?: string;
  fileData?: string; // base64 representation of file
  fileName?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplyPayload;
    const { name, email, phone, role, github, website, fileData, fileName } = body;

    if (!name || !email || !role || !fileData) {
      return NextResponse.json({ message: "Name, email, role, and CV file are required." }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || (await getSiteSettings()).email;
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "Voquarn Code Careers <onboarding@resend.dev>";

    if (!resendApiKey) {
      return NextResponse.json(
        {
          message: "Application received locally. Add RESEND_API_KEY to send emails.",
        },
        { status: 200 },
      );
    }

    const attachments: { filename: string; content: string }[] = [];
    if (fileData && fileName) {
      const base64Content = fileData.split(";base64,").pop();
      if (base64Content) {
        attachments.push({ filename: fileName, content: base64Content });
      }
    }

    const adminResult = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: toEmail,
      replyTo: email,
      subject: `[Job Application] ${role} - ${name}`,
      html: applyAdminEmail({ name, email, phone, role, github, website, fileName }),
      attachments,
    });

    if (!adminResult.ok) {
      console.error("Resend send error:", adminResult.raw);
      if (adminResult.sandboxMode) {
        return NextResponse.json(
          {
            message:
              "Resend is in Sandbox mode. Please verify voquarn.com on Resend, or temporarily change CONTACT_TO_EMAIL in your .env file to your Resend account email (voquarn@gmail.com) to test submissions.",
          },
          { status: 403 },
        );
      }
      return NextResponse.json({ message: "Failed to send the application email." }, { status: 502 });
    }

    // Confirmation to the applicant — best-effort, doesn't block or fail the
    // request if it errors (the application itself already landed).
    sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: email,
      subject: `We've received your application — ${role}`,
      html: applyUserEmail({ name, role }),
    }).catch((error) => console.error("Application confirmation email error:", error));

    return NextResponse.json({
      message: "Your application and CV have been successfully submitted!",
    });
  } catch (error) {
    console.error("Application API error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
