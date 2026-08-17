import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobApplications, jobOpenings } from "@/db/schema";
import { getSiteSettings } from "@/lib/data";
import { applyAdminEmail, applyUserEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  cleanText,
  InvalidJsonError,
  isSafeHttpUrl,
  isValidEmail,
  readJsonBody,
  RequestBodyTooLargeError,
} from "@/lib/request-security";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const allowedCvTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

type ApplyPayload = {
  name: string;
  email: string;
  phone: string;
  role: string;
  github: string;
  website?: string;
  message?: string;
  fileData?: string;
  fileName?: string;
  companyWebsite?: string;
};

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit(request, {
      namespace: "career-application",
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many applications. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
      );
    }

    const body = await readJsonBody<ApplyPayload>(request, 7 * 1024 * 1024);
    if (cleanText(body.companyWebsite, 500)) {
      return NextResponse.json({ message: "Your application has been submitted." });
    }
    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 50);
    const role = cleanText(body.role, 160);
    const github = cleanText(body.github, 500);
    const website = cleanText(body.website, 500);
    const message = cleanText(body.message, 3000);
    const fileName = cleanText(body.fileName, 255).split(/[\\/]/).pop() || "cv.pdf";
    const fileMatch = body.fileData?.match(/^data:([^;,]*);base64,([\s\S]+)$/);

    if (!name || !email || !phone || !role || !github || !fileMatch) {
      return NextResponse.json(
        { message: "Name, email, phone, role, GitHub URL, and CV file are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    if (!isSafeHttpUrl(github) || (website && !isSafeHttpUrl(website))) {
      return NextResponse.json({ message: "Enter valid GitHub and portfolio URLs." }, { status: 400 });
    }

    const [opening] = await db
      .select({ id: jobOpenings.id })
      .from(jobOpenings)
      .where(eq(jobOpenings.title, role))
      .limit(1);
    if (!opening) {
      return NextResponse.json({ message: "This role is no longer accepting applications." }, { status: 400 });
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    const inferredMimeType =
      extension === "pdf"
        ? "application/pdf"
        : extension === "doc"
          ? "application/msword"
          : extension === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "";
    const cvMimeType = inferredMimeType;
    const cvData = fileMatch[2].replace(/\s/g, "");
    if (!allowedCvTypes.has(cvMimeType) || !/^[A-Za-z0-9+/]+={0,2}$/.test(cvData)) {
      return NextResponse.json({ message: "Only PDF, DOC, and DOCX CV files are allowed." }, { status: 400 });
    }

    const cvFile = Buffer.from(cvData, "base64");
    if (cvFile.byteLength === 0 || cvFile.byteLength > MAX_CV_BYTES) {
      return NextResponse.json({ message: "CV file must be 5MB or smaller." }, { status: 400 });
    }

    const isPdf = cvFile.subarray(0, 5).toString("ascii") === "%PDF-";
    const isDoc = cvFile.subarray(0, 8).toString("hex") === "d0cf11e0a1b11ae1";
    const isDocx = cvFile.subarray(0, 4).toString("hex") === "504b0304";
    if ((extension === "pdf" && !isPdf) || (extension === "doc" && !isDoc) || (extension === "docx" && !isDocx)) {
      return NextResponse.json({ message: "The uploaded CV does not match its file type." }, { status: 400 });
    }

    const [application] = await db
      .insert(jobApplications)
      .values({
        name,
        email,
        phone,
        role,
        githubUrl: github,
        websiteUrl: website || null,
        message: message || null,
        cvFileName: fileName,
        cvMimeType,
        cvData,
      })
      .returning({ id: jobApplications.id });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({
        message: "Your application has been saved successfully. Email notifications are currently unavailable.",
        applicationId: application.id,
      });
    }

    try {
      const site = await getSiteSettings();
      const toEmail = process.env.CONTACT_TO_EMAIL || site.email;
      const fromAddress = process.env.CONTACT_FROM_EMAIL || `${site.name} Careers <hello@voquarn.com>`;

      const [adminResult, userResult] = await Promise.all([
        sendResendEmail(resendApiKey, {
          from: fromAddress,
          to: toEmail,
          replyTo: email,
          subject: `[Job Application #${application.id}] ${role} - ${name}`,
          html: applyAdminEmail(site, {
            applicationId: application.id,
            name,
            email,
            phone,
            role,
            github,
            website: website || undefined,
            message: message || undefined,
            fileName,
          }),
          attachments: [{ filename: fileName, content: cvData }],
        }),
        sendResendEmail(resendApiKey, {
          from: fromAddress,
          to: email,
          subject: `We've received your application — ${role}`,
          html: applyUserEmail(site, { name, role }),
        }),
      ]);

      if (!adminResult.ok) console.error("Application admin email error:", adminResult.status);
      if (!userResult.ok) console.error("Application confirmation email error:", userResult.status);

      return NextResponse.json({
        message: "Your application and CV have been successfully submitted!",
        applicationId: application.id,
        emailSent: adminResult.ok && userResult.ok,
      });
    } catch (emailError) {
      console.error("Application saved, but email notification failed:", emailError);
      return NextResponse.json({
        message: "Your application and CV have been successfully submitted!",
        applicationId: application.id,
        emailSent: false,
      });
    }
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ message: "Application payload is too large." }, { status: 413 });
    }
    if (error instanceof InvalidJsonError) {
      return NextResponse.json({ message: "Invalid application request." }, { status: 400 });
    }
    console.error("Application API error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
