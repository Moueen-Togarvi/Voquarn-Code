import { NextRequest, NextResponse } from "next/server";
import { auth, isAdminSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { randomUUID } from "crypto";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;

type SafeMedia = { extension: string; mimeType: string; type: "image" | "video" };

function detectSafeMedia(buffer: Buffer): SafeMedia | null {
  const hex = buffer.subarray(0, 16).toString("hex");
  const ascii = buffer.subarray(0, 16).toString("ascii");

  if (hex.startsWith("89504e470d0a1a0a")) return { extension: ".png", mimeType: "image/png", type: "image" };
  if (hex.startsWith("ffd8ff")) return { extension: ".jpg", mimeType: "image/jpeg", type: "image" };
  if (ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a")) return { extension: ".gif", mimeType: "image/gif", type: "image" };
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") return { extension: ".webp", mimeType: "image/webp", type: "image" };
  if (ascii.slice(4, 12).includes("ftypavif") || ascii.slice(4, 12).includes("ftypavis")) return { extension: ".avif", mimeType: "image/avif", type: "image" };
  if (ascii.slice(4, 8) === "ftyp") return { extension: ".mp4", mimeType: "video/mp4", type: "video" };
  if (hex.startsWith("1a45dfa3")) return { extension: ".webm", mimeType: "video/webm", type: "video" };
  return null;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const declaredLength = Number(req.headers.get("content-length") || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_VIDEO_BYTES + 1024 * 1024) {
      return NextResponse.json({ error: "Upload is too large" }, { status: 413 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "File must be non-empty and no larger than 30MB" },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = detectSafeMedia(buffer);
    if (!media) {
      return NextResponse.json(
        { error: "Only verified PNG, JPG, GIF, WebP, AVIF, MP4, or WebM files are allowed" },
        { status: 400 },
      );
    }
    const maxSize = media.type === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (buffer.byteLength > maxSize) {
      return NextResponse.json(
        { error: `${media.type === "video" ? "Video" : "Image"} exceeds its size limit` },
        { status: 413 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // The stored extension is derived from verified bytes, never user input.
    const filename = `${randomUUID()}${media.extension}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      type: media.type,
      mimeType: media.mimeType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
