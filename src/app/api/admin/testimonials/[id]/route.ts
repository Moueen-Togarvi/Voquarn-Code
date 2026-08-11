import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const [updated] = await db.update(testimonials).set({
      name: body.name,
      company: body.company || null,
      review: body.review,
      stars: body.stars ?? 5,
      mediaUrl: body.mediaUrl || null,
      mediaType: body.mediaType || null,
      order: body.order ?? 0,
    }).where(eq(testimonials.id, parseInt(id))).returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, parseInt(id))).returning();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
