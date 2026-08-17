import { timingSafeEqual } from "crypto";
import { lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";

function validCronSecret(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!secret || secret.length < 32) return false;
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function GET(request: Request) {
  if (!validCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await db
    .delete(jobApplications)
    .where(lte(jobApplications.retentionExpiresAt, new Date()))
    .returning({ id: jobApplications.id });

  return NextResponse.json(
    { deleted: deleted.length },
    { headers: { "Cache-Control": "no-store" } },
  );
}
