import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

async function fileManagedResponse() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Blog posts are file-managed in content/blogs and cannot be edited through this API." },
    { status: 405 },
  );
}

export const GET = fileManagedResponse;
export const PUT = fileManagedResponse;
export const DELETE = fileManagedResponse;
