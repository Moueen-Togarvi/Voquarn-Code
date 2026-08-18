import { upload } from "@vercel/blob/client";
import {
  getUploadValidation,
  safeUploadPath,
  type UploadedMediaType,
} from "@/lib/media-upload";

export type AdminMediaUploadResult = {
  url: string;
  filename: string;
  type: UploadedMediaType;
  mimeType: string;
};

export async function uploadAdminMedia(file: File): Promise<AdminMediaUploadResult> {
  const media = getUploadValidation(file.name, file.type, file.size);
  const pathname = safeUploadPath(file.name, media.extension);
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    contentType: file.type,
    multipart: media.mediaType === "video" || file.size > 4 * 1024 * 1024,
    clientPayload: JSON.stringify({
      contentType: file.type,
      size: file.size,
    }),
  });

  return {
    url: blob.url,
    filename: blob.pathname,
    type: media.mediaType,
    mimeType: blob.contentType,
  };
}
