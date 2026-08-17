import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import {
  AdminValidationError,
  requiredText,
  safeEmail,
  safeUrl,
} from "@/lib/admin-validation";

const allowedSettings = new Set([
  "site_name",
  "site_description",
  "site_email",
  "site_phone",
  "site_whatsapp",
  "site_location",
  "social_linkedin",
  "social_instagram",
  "social_facebook",
]);

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await db.select().from(siteSettings);
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AdminValidationError("Settings must be an object");
    }
    const entries = Object.entries(body);
    if (entries.length === 0 || entries.length > allowedSettings.size) {
      throw new AdminValidationError("Invalid settings payload");
    }

    for (const [key, value] of entries) {
      if (!allowedSettings.has(key)) throw new AdminValidationError(`Unknown setting: ${key}`);
      const normalizedValue = key === "site_email"
        ? safeEmail(value, key, true)!
        : key.startsWith("social_")
          ? safeUrl(value, key, { required: true, maxLength: 500 })!
          : requiredText(value, key, key === "site_description" ? 500 : 160);
      // Upsert: try to update, if no rows changed, insert
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value: normalizedValue }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ key, value: normalizedValue });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
