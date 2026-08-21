import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { TESTIMONIALS_CACHE_TAG } from "@/lib/data";
import { desc } from "drizzle-orm";
import { AdminValidationError, parseTestimonial } from "@/lib/admin-validation";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/admin/testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const [item] = await db.insert(testimonials).values(parseTestimonial(body)).returning();
    revalidateTag(TESTIMONIALS_CACHE_TAG, "max");
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("POST /api/admin/testimonials error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
