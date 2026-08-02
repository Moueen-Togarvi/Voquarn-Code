import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

type NewsletterPayload = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as NewsletterPayload;
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  // Mailchimp is optional — stays available for anyone who later wants managed
  // campaigns, but subscribers are always saved to our own database below so
  // the newsletter works with zero third-party setup.
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
  }

  try {
    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
  } catch (error) {
    console.error("Newsletter DB insert error:", error);
    return NextResponse.json({ message: "Could not save your subscription. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ message: "You are on the newsletter list." });
}
