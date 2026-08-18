export type UploadedMediaType = "image" | "video";

export class MediaUploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaUploadValidationError";
  }
}

type MediaSpec = {
  extension: string;
  mediaType: UploadedMediaType;
  maxSize: number;
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 30 * 1024 * 1024;

export const SUPPORTED_MEDIA_TYPES: Record<string, MediaSpec> = {
  "image/png": { extension: ".png", mediaType: "image", maxSize: MAX_IMAGE_BYTES },
  "image/jpeg": { extension: ".jpg", mediaType: "image", maxSize: MAX_IMAGE_BYTES },
  "image/gif": { extension: ".gif", mediaType: "image", maxSize: MAX_IMAGE_BYTES },
  "image/webp": { extension: ".webp", mediaType: "image", maxSize: MAX_IMAGE_BYTES },
  "image/avif": { extension: ".avif", mediaType: "image", maxSize: MAX_IMAGE_BYTES },
  "video/mp4": { extension: ".mp4", mediaType: "video", maxSize: MAX_VIDEO_BYTES },
  "video/webm": { extension: ".webm", mediaType: "video", maxSize: MAX_VIDEO_BYTES },
};

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

export function getUploadValidation(
  filename: string,
  contentType: string,
  size: number,
): { mediaType: UploadedMediaType; extension: string; maxSize: number } {
  const spec = SUPPORTED_MEDIA_TYPES[contentType];
  if (!spec) {
    throw new MediaUploadValidationError(
      "Only PNG, JPG, GIF, WebP, AVIF, MP4, or WebM files are allowed",
    );
  }

  const dotIndex = filename.lastIndexOf(".");
  const extension = dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
  if (!ALLOWED_EXTENSIONS[contentType].includes(extension)) {
    throw new MediaUploadValidationError("The file extension does not match its media type");
  }

  if (!Number.isSafeInteger(size) || size <= 0) {
    throw new MediaUploadValidationError("The selected file is empty");
  }

  if (size > spec.maxSize) {
    const limit = spec.mediaType === "video" ? "30MB" : "5MB";
    throw new MediaUploadValidationError(
      `${spec.mediaType === "video" ? "Video" : "Image"} must be ${limit} or smaller`,
    );
  }

  return { mediaType: spec.mediaType, extension: spec.extension, maxSize: spec.maxSize };
}

export function safeUploadPath(filename: string, canonicalExtension: string) {
  const dotIndex = filename.lastIndexOf(".");
  const basename = (dotIndex >= 0 ? filename.slice(0, dotIndex) : filename)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "media";

  return `uploads/${basename}${canonicalExtension}`;
}
