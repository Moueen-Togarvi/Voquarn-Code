import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";
import { contactAdminEmail, contactUserEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";
import {
  checkRateLimit,
  cleanText,
  InvalidJsonError,
  isValidEmail,
  readJsonBody,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

type ContactPayload = {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
  companyWebsite?: string;
};

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(request, {
      namespace: "contact",
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many inquiries. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }

    const body = await readJsonBody<ContactPayload>(request, 32 * 1024);
    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const service = cleanText(body.service, 120);
    const message = cleanText(body.message, 5000);

    // Hidden honeypot field: normal users never fill it, basic form bots do.
    if (cleanText(body.companyWebsite, 500)) {
      return NextResponse.json({ message: "Inquiry sent successfully." });
    }

    if (!name || !email || !service || !message || !isValidEmail(email)) {
      return NextResponse.json({ message: "Please enter valid details in every field." }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const site = await getSiteSettings();
    const contactEmail = process.env.CONTACT_TO_EMAIL || site.email;
    const fromAddress = process.env.CONTACT_FROM_EMAIL || `${site.name} <hello@voquarn.com>`;

    if (!resendApiKey) {
      return NextResponse.json(
        { message: "Form received. Email delivery is temporarily unavailable." },
        { status: 200 },
      );
    }

    const adminResult = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: contactEmail,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: contactAdminEmail(site, { name, email, service, message }),
    });

    if (!adminResult.ok) {
      console.error("Resend contact error:", adminResult.status);
      return NextResponse.json(
        { message: "Unable to send the inquiry email right now." },
        { status: 502 },
      );
    }

    // Confirmation must be awaited because serverless functions can freeze
    // immediately after returning their response.
    try {
      const userResult = await sendResendEmail(resendApiKey, {
        from: fromAddress,
        to: email,
        subject: `We've received your inquiry — ${site.name}`,
        html: contactUserEmail(site, { name }),
      });
      if (!userResult.ok) console.error("Contact confirmation email error:", userResult.status);
    } catch (error) {
      console.error("Contact confirmation email error:", error);
    }

    return NextResponse.json({ message: "Inquiry sent successfully. We will get back to you shortly." });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ message: "Inquiry is too large." }, { status: 413 });
    }
    if (error instanceof InvalidJsonError) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }
    console.error("Contact API error:", error);
    return NextResponse.json({ message: "Unable to send the inquiry right now." }, { status: 500 });
  }
}
