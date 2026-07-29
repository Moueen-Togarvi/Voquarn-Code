import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services, subServices } from "@/db/schema";
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
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, parseInt(id)))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const subs = await db
      .select()
      .from(subServices)
      .where(eq(subServices.serviceId, parseInt(id)));

    return NextResponse.json({ ...service, subServices: subs });
  } catch (error) {
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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const [updated] = await db
      .update(services)
      .set({
        title: body.title,
        slug: body.slug,
        description: body.description,
        deliverables: body.deliverables || [],
        icon: body.icon || null,
        updatedAt: new Date(),
      })
      .where(eq(services.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Replace sub-services: delete existing and insert new
    await db
      .delete(subServices)
      .where(eq(subServices.serviceId, parseInt(id)));

    if (body.subServices?.length > 0) {
      for (let i = 0; i < body.subServices.length; i++) {
        const ss = body.subServices[i];
        await db.insert(subServices).values({
          serviceId: parseInt(id),
          slug: ss.slug || slugify(ss.name),
          name: ss.name,
          description: ss.description || null,
          pricePkr: ss.pricePkr || null,
          priceUsd: ss.priceUsd || null,
          features: ss.features || [],
          order: i,
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
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
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(subServices).where(eq(subServices.serviceId, parseInt(id)));
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
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
