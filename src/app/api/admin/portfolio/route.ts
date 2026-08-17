import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { desc } from "drizzle-orm";
import {
  AdminValidationError,
  optionalText,
  requiredText,
  safeSlug,
  safeUrl,
  stringArray,
} from "@/lib/admin-validation";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await db
      .select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.createdAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/admin/portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const title = requiredText(body.title, "Title", 160);
    const slug = safeSlug(body.slug || slugify(title));

    const [item] = await db
      .insert(portfolioItems)
      .values({
        title,
        slug,
        category: requiredText(body.category, "Category", 120),
        summary: optionalText(body.summary, "Summary", 2000),
        outcome: optionalText(body.outcome, "Outcome", 2000),
        stack: stringArray(body.stack, "Stack", 30, 80),
        liveUrl: safeUrl(body.liveUrl, "Live URL"),
        imageUrl: safeUrl(body.imageUrl, "Image URL", { allowRelative: true }),
      })
      .returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof AdminValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/admin/portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 },
    );
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
