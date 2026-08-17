import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { auth } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  try {
    const [application] = await db
      .select({
        cvData: jobApplications.cvData,
        cvMimeType: jobApplications.cvMimeType,
        cvFileName: jobApplications.cvFileName,
      })
      .from(jobApplications)
      .where(eq(jobApplications.id, id))
      .limit(1);

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const file = Buffer.from(application.cvData, "base64");
    const safeFileName = application.cvFileName.replace(/["\r\n]/g, "_");
    return new Response(file, {
      headers: {
        "Content-Type": application.cvMimeType,
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Content-Length": String(file.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/applications/[id]/cv error:", error);
    return NextResponse.json({ error: "Failed to download CV" }, { status: 500 });
  }
}
