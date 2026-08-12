import bcrypt from "bcryptjs";
import { and, count, desc, eq, gte, isNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminLoginAttempts, adminLoginChallenges, users } from "@/db/schema";
import { adminLoginCodeEmail } from "@/lib/email-templates";
import { getSiteSettings } from "@/lib/data";
import { sendResendEmail } from "@/lib/resend";
import { sendAdminLoginSecurityAlert } from "@/lib/admin-login-notifications";
import { getLoginRequestInfo } from "@/lib/login-request-info";
import {
  ADMIN_OTP_MAX_ATTEMPTS,
  ADMIN_OTP_MAX_CHALLENGES,
  ADMIN_OTP_RESEND_COOLDOWN_MS,
  ADMIN_OTP_TTL_MS,
  ADMIN_PASSWORD_MAX_ATTEMPTS,
  ADMIN_PASSWORD_WINDOW_MS,
  createAdminOtp,
  getClientIp,
  hashAdminOtp,
  hashClientIp,
  maskEmail,
} from "@/lib/admin-otp";

export const runtime = "nodejs";

const DUMMY_PASSWORD_HASH =
  "$2b$12$tYQysyvddlerV0ZFuAKuo.ZnWGID3j5DDgfEWEyD.n0MWt8pLqGHW";

type RequestCodePayload = {
  email?: unknown;
  password?: unknown;
};

function noStoreJson(body: object, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestCodePayload;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password || email.length > 254 || password.length > 256) {
      return noStoreJson({ message: "Invalid email or password." }, { status: 401 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Admin OTP requires RESEND_API_KEY");
      return noStoreJson(
        { message: "Email verification is not configured." },
        { status: 503 },
      );
    }

    const now = new Date();
    const requestInfo = getLoginRequestInfo(request.headers, now);
    const ipHash = hashClientIp(getClientIp(request.headers));
    const passwordWindowStart = new Date(now.getTime() - ADMIN_PASSWORD_WINDOW_MS);

    const [failedAttemptCount] = await db
      .select({ value: count() })
      .from(adminLoginAttempts)
      .where(
        and(
          eq(adminLoginAttempts.ipHash, ipHash),
          gte(adminLoginAttempts.createdAt, passwordWindowStart),
        ),
      );

    if (Number(failedAttemptCount?.value ?? 0) >= ADMIN_PASSWORD_MAX_ATTEMPTS) {
      return noStoreJson(
        { message: "Too many login attempts. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    }

    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    const passwordMatches = await bcrypt.compare(
      password,
      adminUser?.password ?? DUMMY_PASSWORD_HASH,
    );
    const emailMatches = adminUser?.email.toLowerCase() === email;

    if (!adminUser || !emailMatches || !passwordMatches) {
      await db.insert(adminLoginAttempts).values({ ipHash });

      if (adminUser) {
        await sendAdminLoginSecurityAlert({
          to: adminUser.email,
          status: "failed",
          attemptedEmail: email,
          requestInfo,
        });
      }

      return noStoreJson({ message: "Invalid email or password." }, { status: 401 });
    }

    const [recentChallengeCount] = await db
      .select({ value: count() })
      .from(adminLoginChallenges)
      .where(
        and(
          eq(adminLoginChallenges.userId, adminUser.id),
          gte(adminLoginChallenges.createdAt, passwordWindowStart),
        ),
      );

    if (Number(recentChallengeCount?.value ?? 0) >= ADMIN_OTP_MAX_CHALLENGES) {
      return noStoreJson(
        { message: "Too many verification codes requested. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } },
      );
    }

    const [recentChallenge] = await db
      .select({ resendAvailableAt: adminLoginChallenges.resendAvailableAt })
      .from(adminLoginChallenges)
      .where(
        and(
          eq(adminLoginChallenges.userId, adminUser.id),
          isNull(adminLoginChallenges.verifiedAt),
          gte(adminLoginChallenges.expiresAt, now),
        ),
      )
      .orderBy(desc(adminLoginChallenges.createdAt))
      .limit(1);

    if (recentChallenge && recentChallenge.resendAvailableAt > now) {
      const retryAfter = Math.max(
        1,
        Math.ceil((recentChallenge.resendAvailableAt.getTime() - now.getTime()) / 1000),
      );
      return noStoreJson(
        { message: `Please wait ${retryAfter} seconds before requesting another code.` },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } },
      );
    }

    const challengeId = crypto.randomUUID();
    const code = createAdminOtp();
    const expiresAt = new Date(now.getTime() + ADMIN_OTP_TTL_MS);
    const resendAvailableAt = new Date(now.getTime() + ADMIN_OTP_RESEND_COOLDOWN_MS);

    await db.insert(adminLoginChallenges).values({
      id: challengeId,
      userId: adminUser.id,
      email: adminUser.email,
      codeHash: hashAdminOtp(challengeId, code),
      attemptsRemaining: ADMIN_OTP_MAX_ATTEMPTS,
      expiresAt,
      resendAvailableAt,
      ipHash,
    });

    const site = await getSiteSettings();
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || `${site.name} Security <hello@voquarn.com>`;
    const result = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: adminUser.email,
      subject: `${code} is your ${site.name} admin verification code`,
      html: adminLoginCodeEmail(site, code, requestInfo),
    });

    if (!result.ok) {
      await db.delete(adminLoginChallenges).where(eq(adminLoginChallenges.id, challengeId));
      console.error("Admin OTP email error:", result.status, result.raw);
      return noStoreJson(
        { message: "Unable to send the verification code right now." },
        { status: 502 },
      );
    }

    // Opportunistic cleanup keeps the small security tables bounded.
    const cleanupBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    await Promise.all([
      db.delete(adminLoginAttempts).where(lt(adminLoginAttempts.createdAt, cleanupBefore)),
      db.delete(adminLoginChallenges).where(lt(adminLoginChallenges.expiresAt, cleanupBefore)),
    ]);

    return noStoreJson({
      challengeId,
      maskedEmail: maskEmail(adminUser.email),
      expiresInSeconds: Math.floor(ADMIN_OTP_TTL_MS / 1000),
      resendAfterSeconds: Math.floor(ADMIN_OTP_RESEND_COOLDOWN_MS / 1000),
    });
  } catch (error) {
    console.error("Admin OTP request error:", error);
    return noStoreJson({ message: "Unable to start email verification." }, { status: 500 });
  }
}
