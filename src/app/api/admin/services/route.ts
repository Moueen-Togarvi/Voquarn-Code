import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services, subServices } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allServices = await db.query?.services?.findMany
      ? await db.query.services.findMany({
          with: { subServices: true } as never,
          orderBy: desc(services.createdAt),
        })
      : await db.select().from(services).orderBy(desc(services.createdAt));

    return NextResponse.json(allServices);
  } catch (error) {
    console.error("GET /api/admin/services error:", error);
    // Fallback without relations
    try {
      const allServices = await db
        .select()
        .from(services)
        .orderBy(desc(services.createdAt));
      const allSubServices = await db.select().from(subServices);

      const withSubs = allServices.map((s) => ({
        ...s,
        subServices: allSubServices.filter((ss) => ss.serviceId === s.id),
      }));
      return NextResponse.json(withSubs);
    } catch (err) {
      console.error("Fallback error:", err);
      return NextResponse.json([]);
    }
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

    const [service] = await db
      .insert(services)
      .values({
        title: body.title,
        slug,
        description: body.description,
        deliverables: body.deliverables || [],
        icon: body.icon || null,
      })
      .returning();

    // Insert sub-services if provided
    if (body.subServices?.length > 0) {
      for (let i = 0; i < body.subServices.length; i++) {
        const ss = body.subServices[i];
        await db.insert(subServices).values({
          serviceId: service.id,
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

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/services error:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
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
