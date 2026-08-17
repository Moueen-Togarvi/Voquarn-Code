import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services, subServices } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { AdminValidationError, parseService } from "@/lib/admin-validation";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) {
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
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = parseService(body);

    const [service] = await db
      .insert(services)
      .values(parsed.service)
      .returning();

    // Insert sub-services if provided
    if (parsed.subServices.length > 0) {
      for (const ss of parsed.subServices) {
        await db.insert(subServices).values({
          serviceId: service.id,
          ...ss,
        });
      }
    }

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("POST /api/admin/services error:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
