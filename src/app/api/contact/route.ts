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
  const site = await getSiteSettings();
  const contactEmail = process.env.CONTACT_TO_EMAIL || site.email;
  const fromAddress = process.env.CONTACT_FROM_EMAIL || `${site.name} <hello@voquarn.com>`;

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
    html: contactAdminEmail(site, { name, email, service, budget, message }),
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

  // Confirmation to the person who submitted the form. Must be awaited — on
  // serverless (Vercel), the function can freeze/tear down the instant the
  // response is sent, so a fire-and-forget call here risks never completing.
  try {
    const userResult = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: email,
      subject: `We've received your inquiry — ${site.name}`,
      html: contactUserEmail(site, { name }),
    });
    if (!userResult.ok) {
      console.error("Contact confirmation email error:", userResult.raw);
    }
  } catch (error) {
    console.error("Contact confirmation email error:", error);
  }

  return NextResponse.json({ message: "Inquiry sent successfully. We will get back to you shortly." });
}
