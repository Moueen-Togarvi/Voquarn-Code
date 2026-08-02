import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/admin/newsletter error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
