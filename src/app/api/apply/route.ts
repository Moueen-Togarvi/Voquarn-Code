import { NextResponse } from "next/server";
import { site } from "@/lib/site-data";

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
    const toEmail = process.env.CONTACT_TO_EMAIL || site.email;

    if (!resendApiKey) {
      return NextResponse.json(
        {
          message: "Application received locally. Add RESEND_API_KEY to send emails.",
        },
        { status: 200 }
      );
    }

    let html = `
      <h2>New Job Application - Voquarn Code</h2>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Applicant Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>WhatsApp / Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>GitHub Profile:</strong> ${github ? `<a href="${github}">${github}</a>` : "Not provided"}</p>
      <p><strong>Portfolio / Website:</strong> ${website ? `<a href="${website}">${website}</a>` : "Not provided"}</p>
      <p><strong>CV / Resume Attached:</strong> Yes (${fileName || "cv.pdf"})</p>
    `;

    const attachments: any[] = [];
    if (fileData && fileName) {
      const base64Content = fileData.split(";base64,").pop();
      if (base64Content) {
        attachments.push({
          filename: fileName,
          content: base64Content,
        });
      }
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Voquarn Code Careers <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `[Job Application] ${role} - ${name}`,
        html,
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend send error:", errText);
      
      try {
        const errObj = JSON.parse(errText);
        if (errObj.statusCode === 403 || errObj.message?.includes("testing emails")) {
          return NextResponse.json({ 
            message: "Resend is in Sandbox mode. Please verify voquarn.com on Resend, or temporarily change CONTACT_TO_EMAIL in your .env file to your Resend account email (voquarn@gmail.com) to test submissions."
          }, { status: 403 });
        }
      } catch {}
      
      return NextResponse.json({ message: "Failed to send the application email." }, { status: 502 });
    }

    return NextResponse.json({
      message: "Your application and CV have been successfully submitted!",
    });
  } catch (error: any) {
    console.error("Application API error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
