import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";
import { contactAdminEmail, contactUserEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";

type ContactPayload = {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;
  const { name, email, service, budget, message } = body;

  if (!name || !email || !service || !budget || !message) {
    return NextResponse.json({ message: "Please fill in all required fields." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_TO_EMAIL || (await getSiteSettings()).email;
  const fromAddress = process.env.CONTACT_FROM_EMAIL || "Voquarn Code <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json(
      {
        message: "Form received. Add RESEND_API_KEY to enable email delivery.",
      },
      { status: 200 },
    );
  }

  const adminResult = await sendResendEmail(resendApiKey, {
    from: fromAddress,
    to: contactEmail,
    replyTo: email,
    subject: `New inquiry from ${name}`,
    html: contactAdminEmail({ name, email, service, budget, message }),
  });

  if (!adminResult.ok) {
    console.error("Resend contact error:", adminResult.raw);
    if (adminResult.sandboxMode) {
      return NextResponse.json(
        {
          message:
            "Resend is in Sandbox mode. Please verify voquarn.com on Resend, or temporarily change CONTACT_TO_EMAIL in your .env file to your Resend account email (voquarn@gmail.com) to test submissions.",
        },
        { status: 403 },
      );
    }
    return NextResponse.json({ message: "Unable to send the inquiry email right now." }, { status: 502 });
  }

  // Confirmation to the person who submitted the form — best-effort, doesn't
  // block or fail the request if it errors (the inquiry itself already landed).
  sendResendEmail(resendApiKey, {
    from: fromAddress,
    to: email,
    subject: "We've received your inquiry — Voquarn Code",
    html: contactUserEmail({ name }),
  }).catch((error) => console.error("Contact confirmation email error:", error));

  return NextResponse.json({ message: "Inquiry sent successfully. We will get back to you shortly." });
}
