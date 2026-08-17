import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { auth, isAdminSession } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { AdminValidationError, parseStat } from "@/lib/admin-validation";

export async function GET() {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await db.select().from(stats).orderBy(desc(stats.createdAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const [item] = await db.insert(stats).values(parseStat(body)).returning();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof AdminValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("POST /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
