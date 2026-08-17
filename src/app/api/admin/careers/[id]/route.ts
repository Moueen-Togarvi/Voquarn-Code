import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { AdminValidationError, parseCareer, parsePositiveId } from "@/lib/admin-validation";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: rawId } = await params;
  try {
    const id = parsePositiveId(rawId);
    const body = await req.json();
    const [updated] = await db.update(jobOpenings).set(parseCareer(body)).where(eq(jobOpenings.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("PUT /api/admin/careers/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: rawId } = await params;
  try {
    const id = parsePositiveId(rawId);
    const [deleted] = await db.delete(jobOpenings).where(eq(jobOpenings.id, id)).returning();
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("DELETE /api/admin/careers/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
