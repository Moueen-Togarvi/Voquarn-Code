import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [item] = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.id, parseInt(id)))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const [updated] = await db
      .update(portfolioItems)
      .set({
        title: body.title,
        slug: body.slug,
        category: body.category,
        summary: body.summary || null,
        outcome: body.outcome || null,
        stack: body.stack || [],
        liveUrl: body.liveUrl || null,
        imageUrl: body.imageUrl || null,
      })
      .where(eq(portfolioItems.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(portfolioItems)
      .where(eq(portfolioItems.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/portfolio/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 },
    );
  }
}
