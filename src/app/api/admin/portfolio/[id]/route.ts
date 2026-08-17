import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import {
  AdminValidationError,
  optionalText,
  parsePositiveId,
  requiredText,
  safeSlug,
  safeUrl,
  stringArray,
} from "@/lib/admin-validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;

  try {
    const id = parsePositiveId(rawId);
    const [item] = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.id, id))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("GET /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;

  try {
    const id = parsePositiveId(rawId);
    const body = await req.json();

    const [updated] = await db
      .update(portfolioItems)
      .set({
        title: requiredText(body.title, "Title", 160),
        slug: safeSlug(body.slug),
        category: requiredText(body.category, "Category", 120),
        summary: optionalText(body.summary, "Summary", 2000),
        outcome: optionalText(body.outcome, "Outcome", 2000),
        stack: stringArray(body.stack, "Stack", 30, 80),
        liveUrl: safeUrl(body.liveUrl, "Live URL"),
        imageUrl: safeUrl(body.imageUrl, "Image URL", { allowRelative: true }),
      })
      .where(eq(portfolioItems.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("PUT /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: rawId } = await params;

  try {
    const id = parsePositiveId(rawId);
    const [deleted] = await db
      .delete(portfolioItems)
      .where(eq(portfolioItems.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("DELETE /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 },
    );
  }
}
