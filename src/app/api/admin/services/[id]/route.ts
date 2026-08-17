import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services, subServices } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { AdminValidationError, parsePositiveId, parseService } from "@/lib/admin-validation";

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
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const subs = await db
      .select()
      .from(subServices)
      .where(eq(subServices.serviceId, id));

    return NextResponse.json({ ...service, subServices: subs });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("GET /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
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
    const parsed = parseService(body);

    const [updated] = await db
      .update(services)
      .set({
        ...parsed.service,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Replace sub-services: delete existing and insert new
    await db
      .delete(subServices)
      .where(eq(subServices.serviceId, id));

    if (parsed.subServices.length > 0) {
      for (const ss of parsed.subServices) {
        await db.insert(subServices).values({
          serviceId: id,
          ...ss,
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("PUT /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
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
    await db.delete(subServices).where(eq(subServices.serviceId, id));
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("DELETE /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
