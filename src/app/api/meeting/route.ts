import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";
import { meetingAdminEmail, meetingUserEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";
import {
  checkRateLimit,
  cleanText,
  InvalidJsonError,
  isValidEmail,
  readJsonBody,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

type MeetingPayload = {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  date?: string;
  time?: string;
  timezone?: string;
  duration?: string;
  meetingType?: string;
  agenda?: string;
  companyWebsite?: string;
};

const topics = new Set([
  "Project consultation",
  "Website or SEO audit",
  "AI and automation",
  "Partnership",
  "Other",
]);
const durations = new Set(["30 minutes", "45 minutes", "60 minutes"]);
const meetingTypes = new Set([
  "Google Meet",
  "Phone call",
  "WhatsApp call",
  "In-person at Bahawalnagar",
]);

function isValidTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return date;
}

function dateOnlyInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(request, {
      namespace: "meeting",
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many meeting requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }

    const body = await readJsonBody<MeetingPayload>(request, 32 * 1024);
    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 40);
    const topic = cleanText(body.topic, 80);
    const date = cleanText(body.date, 10);
    const time = cleanText(body.time, 5);
    const timezone = cleanText(body.timezone, 100);
    const duration = cleanText(body.duration, 30);
    const meetingType = cleanText(body.meetingType, 80);
    const agenda = cleanText(body.agenda, 3000);

    // Hidden honeypot field: normal users never fill it, basic form bots do.
    if (cleanText(body.companyWebsite, 500)) {
      return NextResponse.json({ message: "Meeting request sent successfully." });
    }

    const requestedDate = parseDateOnly(date);
    const validTimezone = isValidTimezone(timezone);
    const todayInRequestedTimezone = validTimezone ? dateOnlyInTimezone(new Date(), timezone) : null;
    const latestAllowedDate = todayInRequestedTimezone
      ? new Date(todayInRequestedTimezone.getTime() + 180 * 24 * 60 * 60 * 1000)
      : null;
    const validDate =
      requestedDate &&
      todayInRequestedTimezone &&
      latestAllowedDate &&
      requestedDate >= todayInRequestedTimezone &&
      requestedDate <= latestAllowedDate;
    const phoneRequired = meetingType === "Phone call" || meetingType === "WhatsApp call";

    if (
      !name ||
      !isValidEmail(email) ||
      !topics.has(topic) ||
      !validDate ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
      !validTimezone ||
      !durations.has(duration) ||
      !meetingTypes.has(meetingType) ||
      (phoneRequired && !phone) ||
      !agenda
    ) {
      return NextResponse.json({ message: "Please enter valid details in every required field." }, { status: 400 });
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(requestedDate);
    const resendApiKey = process.env.RESEND_API_KEY;
    const site = await getSiteSettings();
    const contactEmail = process.env.CONTACT_TO_EMAIL || site.email;
    const fromAddress = process.env.CONTACT_FROM_EMAIL || `${site.name} <hello@voquarn.com>`;
    const emailInput = {
      name,
      email,
      phone,
      topic,
      date: formattedDate,
      time,
      timezone,
      duration,
      meetingType,
      agenda,
    };

    if (!resendApiKey) {
      return NextResponse.json({
        message: "Request received. Email delivery is temporarily unavailable.",
      });
    }

    const adminResult = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: contactEmail,
      replyTo: email,
      subject: `Meeting request from ${name} — ${formattedDate}`,
      html: meetingAdminEmail(site, emailInput),
    });

    if (!adminResult.ok) {
      console.error("Resend meeting request error:", adminResult.status);
      return NextResponse.json({ message: "Unable to send the meeting request right now." }, { status: 502 });
    }

    try {
      const userResult = await sendResendEmail(resendApiKey, {
        from: fromAddress,
        to: email,
        subject: `Meeting request received — ${site.name}`,
        html: meetingUserEmail(site, emailInput),
      });
      if (!userResult.ok) console.error("Meeting confirmation email error:", userResult.status);
    } catch (error) {
      console.error("Meeting confirmation email error:", error);
    }

    return NextResponse.json({
      message: "We received your preferred slot and will confirm it by email shortly.",
    });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ message: "Meeting request is too large." }, { status: 413 });
    }
    if (error instanceof InvalidJsonError) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }
    console.error("Meeting API error:", error);
    return NextResponse.json({ message: "Unable to send the meeting request right now." }, { status: 500 });
  }
}
