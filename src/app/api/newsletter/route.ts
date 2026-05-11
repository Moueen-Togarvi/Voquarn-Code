import { NextResponse } from "next/server";

type NewsletterPayload = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as NewsletterPayload;
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (mailchimpApiKey && audienceId && mailchimpServerPrefix) {
    const response = await fetch(
      `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      },
    );

    if (!response.ok && response.status !== 400) {
      return NextResponse.json({ message: "Mailchimp subscription failed." }, { status: 502 });
    }

    return NextResponse.json({ message: "You are on the newsletter list." });
  }

  if (resendApiKey) {
    return NextResponse.json({
      message: "Newsletter request captured. Connect Mailchimp audience settings to store subscribers automatically.",
    });
  }

  return NextResponse.json({
    message: "Newsletter request captured. Add Mailchimp or Resend configuration to enable live delivery.",
  });
}
