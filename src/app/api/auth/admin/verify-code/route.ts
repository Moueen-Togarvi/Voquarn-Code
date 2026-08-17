import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminLoginChallenges } from "@/db/schema";
import {
  createAdminLoginToken,
  hashAdminLoginToken,
  hashAdminOtp,
  hashClientIp,
  getClientIp,
  secureHashEqual,
} from "@/lib/admin-otp";
import { readJsonBody } from "@/lib/request-security";

export const runtime = "nodejs";

type VerifyCodePayload = {
  challengeId?: unknown;
  code?: unknown;
};

function noStoreJson(body: object, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<VerifyCodePayload>(request, 4 * 1024);
    const challengeId =
      typeof body.challengeId === "string" ? body.challengeId.trim() : "";
    const code = typeof body.code === "string" ? body.code.replace(/\D/g, "") : "";

    if (!challengeId || !/^\d{6}$/.test(code)) {
      return noStoreJson({ message: "Enter the valid 6-digit code." }, { status: 400 });
    }

    const now = new Date();
    const [challenge] = await db
      .select()
      .from(adminLoginChallenges)
      .where(eq(adminLoginChallenges.id, challengeId))
      .limit(1);

    if (
      !challenge ||
      challenge.verifiedAt ||
      challenge.usedAt ||
      challenge.expiresAt <= now
    ) {
      return noStoreJson(
        { message: "This code has expired. Request a new code." },
        { status: 410 },
      );
    }

    const currentIpHash = hashClientIp(getClientIp(request.headers));
    if (!secureHashEqual(currentIpHash, challenge.ipHash)) {
      return noStoreJson({ message: "Verification session does not match this connection." }, { status: 403 });
    }

    if (challenge.attemptsRemaining <= 0) {
      return noStoreJson(
        { message: "Too many incorrect attempts. Request a new code." },
        { status: 429 },
      );
    }

    const suppliedHash = hashAdminOtp(challengeId, code);
    if (!secureHashEqual(suppliedHash, challenge.codeHash)) {
      const [updated] = await db
        .update(adminLoginChallenges)
        .set({
          attemptsRemaining: sql`${adminLoginChallenges.attemptsRemaining} - 1`,
        })
        .where(
          and(
            eq(adminLoginChallenges.id, challengeId),
            gt(adminLoginChallenges.attemptsRemaining, 0),
            isNull(adminLoginChallenges.verifiedAt),
          ),
        )
        .returning({ attemptsRemaining: adminLoginChallenges.attemptsRemaining });

      const attemptsRemaining = updated?.attemptsRemaining ?? 0;
      return noStoreJson(
        {
          message:
            attemptsRemaining > 0
              ? `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`
              : "Too many incorrect attempts. Request a new code.",
          attemptsRemaining,
        },
        { status: attemptsRemaining > 0 ? 401 : 429 },
      );
    }

    const loginToken = createAdminLoginToken();
    const [verified] = await db
      .update(adminLoginChallenges)
      .set({
        loginTokenHash: hashAdminLoginToken(challengeId, loginToken),
        verifiedAt: now,
      })
      .where(
        and(
          eq(adminLoginChallenges.id, challengeId),
          isNull(adminLoginChallenges.verifiedAt),
          gt(adminLoginChallenges.expiresAt, now),
          gt(adminLoginChallenges.attemptsRemaining, 0),
        ),
      )
      .returning({ id: adminLoginChallenges.id });

    if (!verified) {
      return noStoreJson(
        { message: "This code is no longer valid. Request a new code." },
        { status: 409 },
      );
    }

    return noStoreJson({ challengeId, loginToken });
  } catch (error) {
    console.error("Admin OTP verification error:", error);
    return noStoreJson({ message: "Unable to verify the code." }, { status: 500 });
  }
}
