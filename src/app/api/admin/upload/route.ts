import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { auth, isAdminSession } from "@/lib/auth";
import { getUploadValidation, MediaUploadValidationError } from "@/lib/media-upload";

type UploadPayload = {
  contentType?: unknown;
  size?: unknown;
};

function parseUploadPayload(clientPayload: string | null): {
  contentType: string;
  size: number;
} {
  if (!clientPayload) throw new MediaUploadValidationError("Missing upload metadata");

  let payload: UploadPayload;
  try {
    payload = JSON.parse(clientPayload) as UploadPayload;
  } catch {
    throw new MediaUploadValidationError("Invalid upload metadata");
  }

  if (typeof payload.contentType !== "string" || typeof payload.size !== "number") {
    throw new MediaUploadValidationError("Invalid upload metadata");
  }

  return { contentType: payload.contentType, size: payload.size };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HandleUploadBody;

    if (body.type === "blob.generate-client-token") {
      const session = await auth();
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const response = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("uploads/") || pathname.includes("..")) {
          throw new MediaUploadValidationError("Invalid upload path");
        }

        const { contentType, size } = parseUploadPayload(clientPayload);
        const media = getUploadValidation(pathname, contentType, size);

        return {
          allowedContentTypes: [contentType],
          maximumSizeInBytes: media.maxSize,
          addRandomSuffix: true,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ contentType, mediaType: media.mediaType }),
        };
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to prepare upload";
    const configurationError = /token|store|oidc/i.test(message);
    const validationError = error instanceof MediaUploadValidationError;
    return NextResponse.json(
      {
        error: configurationError
          ? "Upload storage is not configured. Connect a Vercel Blob store to this project."
          : validationError
            ? message
            : "Failed to prepare upload",
      },
      { status: configurationError ? 503 : validationError ? 400 : 500 },
    );
  }
}
