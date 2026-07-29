import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) {
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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug || slugify(body.title);

    const [item] = await db
      .insert(portfolioItems)
      .values({
        title: body.title,
        slug,
        category: body.category,
        summary: body.summary || null,
        outcome: body.outcome || null,
        stack: body.stack || [],
        liveUrl: body.liveUrl || null,
        imageUrl: body.imageUrl || null,
      })
      .returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
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
