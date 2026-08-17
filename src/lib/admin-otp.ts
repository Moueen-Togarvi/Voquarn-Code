import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";

export const ADMIN_OTP_TTL_MS = 5 * 60 * 1000;
export const ADMIN_OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const ADMIN_OTP_MAX_ATTEMPTS = 5;
export const ADMIN_OTP_MAX_SENDS = 3;
export const ADMIN_OTP_MAX_CHALLENGES = 3;
export const ADMIN_PASSWORD_WINDOW_MS = 15 * 60 * 1000;
export const ADMIN_PASSWORD_MAX_ATTEMPTS = 5;

function securitySecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

function hmac(purpose: string, value: string) {
  return createHmac("sha256", securitySecret())
    .update(`${purpose}:${value}`)
    .digest("hex");
}

export function createAdminOtp() {
  return randomInt(100_000, 1_000_000).toString();
}

export function createAdminLoginToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAdminOtp(challengeId: string, code: string) {
  return hmac("admin-otp", `${challengeId}:${code}`);
}

export function hashAdminLoginToken(challengeId: string, token: string) {
  return hmac("admin-login-token", `${challengeId}:${token}`);
}

export function hashClientIp(ip: string) {
  return hmac("admin-login-ip", ip);
}

export function secureHashEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function getClientIp(headers: Headers) {
  if (process.env.VERCEL === "1") {
    return (
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip")?.trim() ||
      "unknown"
    );
  }

  if (process.env.CF_PAGES === "1" || process.env.CLOUDFLARE === "1") {
    return headers.get("cf-connecting-ip")?.trim() || "unknown";
  }

  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "your admin email";

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${"•".repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
}
