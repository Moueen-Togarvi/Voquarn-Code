import { and, eq, gt, isNull, lt, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminLoginChallenges } from "@/db/schema";
import {
  ADMIN_OTP_MAX_ATTEMPTS,
  ADMIN_OTP_MAX_SENDS,
  ADMIN_OTP_RESEND_COOLDOWN_MS,
  ADMIN_OTP_TTL_MS,
  createAdminOtp,
  hashAdminOtp,
} from "@/lib/admin-otp";
import { getSiteSettings } from "@/lib/data";
import { adminLoginCodeEmail } from "@/lib/email-templates";
import { sendResendEmail } from "@/lib/resend";

export const runtime = "nodejs";

function noStoreJson(body: object, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { challengeId?: unknown };
    const challengeId =
      typeof body.challengeId === "string" ? body.challengeId.trim() : "";
    if (!challengeId) {
      return noStoreJson({ message: "Verification session is missing." }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!resendApiKey || !allowedEmail) {
      return noStoreJson(
        { message: "Email verification is not configured." },
        { status: 503 },
      );
    }

    const now = new Date();
    const code = createAdminOtp();
    const resendAvailableAt = new Date(now.getTime() + ADMIN_OTP_RESEND_COOLDOWN_MS);
    const expiresAt = new Date(now.getTime() + ADMIN_OTP_TTL_MS);

    const [reserved] = await db
      .update(adminLoginChallenges)
      .set({
        codeHash: hashAdminOtp(challengeId, code),
        attemptsRemaining: ADMIN_OTP_MAX_ATTEMPTS,
        sendCount: sql`${adminLoginChallenges.sendCount} + 1`,
        resendAvailableAt,
        expiresAt,
      })
      .where(
        and(
          eq(adminLoginChallenges.id, challengeId),
          eq(adminLoginChallenges.email, allowedEmail),
          isNull(adminLoginChallenges.verifiedAt),
          gt(adminLoginChallenges.expiresAt, now),
          lte(adminLoginChallenges.resendAvailableAt, now),
          lt(adminLoginChallenges.sendCount, ADMIN_OTP_MAX_SENDS),
        ),
      )
      .returning({ email: adminLoginChallenges.email });

    if (!reserved) {
      return noStoreJson(
        { message: "Please wait before resending, or start a new login attempt." },
        { status: 429 },
      );
    }

    const site = await getSiteSettings();
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || `${site.name} Security <hello@voquarn.com>`;
    const result = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: reserved.email,
      subject: `${code} is your ${site.name} admin verification code`,
      html: adminLoginCodeEmail(site, code),
    });

    if (!result.ok) {
      console.error("Admin OTP resend error:", result.status, result.raw);
      return noStoreJson(
        { message: "Unable to resend the verification code right now." },
        { status: 502 },
      );
    }

    return noStoreJson({
      message: "A new verification code was sent.",
      resendAfterSeconds: Math.floor(ADMIN_OTP_RESEND_COOLDOWN_MS / 1000),
    });
  } catch (error) {
    console.error("Admin OTP resend error:", error);
    return noStoreJson({ message: "Unable to resend the verification code." }, { status: 500 });
  }
}
