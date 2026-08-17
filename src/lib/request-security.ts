import { createHmac } from "crypto";
import { lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { requestRateLimits } from "@/db/schema";
import { getClientIp } from "@/lib/admin-otp";

export class RequestBodyTooLargeError extends Error {}
export class InvalidJsonError extends Error {}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyTooLargeError("Request body is too large");
  }

  if (!request.body) throw new InvalidJsonError("Request body is required");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let body = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError("Request body is too large");
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new InvalidJsonError("Request body must be valid JSON");
  }
}

function rateLimitSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured for rate limiting");
  }
  return secret;
}

function rateLimitKey(namespace: string, ip: string) {
  return createHmac("sha256", rateLimitSecret())
    .update(`public-rate-limit:${namespace}:${ip}`)
    .digest("hex");
}

export async function checkRateLimit(
  request: Request,
  options: { namespace: string; limit: number; windowMs: number },
) {
  const now = new Date();
  const nextWindow = new Date(now.getTime() + options.windowMs);
  const key = rateLimitKey(options.namespace, getClientIp(request.headers));

  const [bucket] = await db
    .insert(requestRateLimits)
    .values({ key, count: 1, windowEndsAt: nextWindow, updatedAt: now })
    .onConflictDoUpdate({
      target: requestRateLimits.key,
      set: {
        count: sql<number>`case when ${requestRateLimits.windowEndsAt} <= ${now} then 1 else ${requestRateLimits.count} + 1 end`,
        windowEndsAt: sql<Date>`case when ${requestRateLimits.windowEndsAt} <= ${now} then ${nextWindow} else ${requestRateLimits.windowEndsAt} end`,
        updatedAt: now,
      },
    })
    .returning({ count: requestRateLimits.count, windowEndsAt: requestRateLimits.windowEndsAt });

  // Bounded opportunistic cleanup without adding another write to every request.
  if (Number.parseInt(key.slice(0, 2), 16) % 64 === 0) {
    const staleBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    await db.delete(requestRateLimits).where(lt(requestRateLimits.windowEndsAt, staleBefore));
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.windowEndsAt.getTime() - now.getTime()) / 1000));
  return { allowed: bucket.count <= options.limit, retryAfter };
}

export function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}
