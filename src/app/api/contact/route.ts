import { NextResponse } from "next/server";
import { site } from "@/lib/site-data";

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
  const contactEmail = process.env.CONTACT_TO_EMAIL || site.email;

  if (!resendApiKey) {
    return NextResponse.json(
      {
        message: "Form received. Add RESEND_API_KEY to enable email delivery.",
      },
      { status: 200 },
    );
  }

  const html = `
    <h2>New project inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Budget:</strong> ${budget}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Voquarn Code <onboarding@resend.dev>",
      to: [contactEmail],
      reply_to: email,
      subject: `New inquiry from ${name}`,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Resend contact error:", errText);
    
    try {
      const errObj = JSON.parse(errText);
      if (errObj.statusCode === 403 || errObj.message?.includes("testing emails")) {
        return NextResponse.json({ 
          message: "Resend is in Sandbox mode. Please verify voquarn.com on Resend, or temporarily change CONTACT_TO_EMAIL in your .env file to your Resend account email (voquarn@gmail.com) to test submissions."
        }, { status: 403 });
      }
    } catch {}
    
    return NextResponse.json({ message: "Unable to send the inquiry email right now." }, { status: 502 });
  }

  return NextResponse.json({ message: "Inquiry sent successfully. We will get back to you shortly." });
}
