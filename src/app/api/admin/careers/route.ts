import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await db.select().from(jobOpenings).orderBy(asc(jobOpenings.order));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/admin/careers error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const [item] = await db.insert(jobOpenings).values({
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      salary: body.salary || null,
      description: body.description,
      tags: body.tags || [],
      order: body.order ?? 0,
    }).returning();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/careers error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
