"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Video as VideoIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadAdminMedia } from "@/lib/client-media-upload";

type MediaType = "image" | "video";

export function MediaUpload({
  value,
  mediaType,
  onChange,
  label = "Photo or Video",
  aspect = "aspect-[4/3]",
}: {
  value?: string;
  mediaType?: MediaType | null;
  onChange: (value: string, mediaType: MediaType | null) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    try {
      const data = await uploadAdminMedia(file);
      onChange(data.url, data.type);
    } catch (err) {
      // No base64 fallback here on purpose — embedding a multi-MB file as a
      // data URI in the database once bloated a page past what Vercel's
      // serverless response size allows, which silently broke the entire
      // section that read it. Surface the failure instead of hiding it.
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[#ff5400]",
          aspect,
        )}
      >
        {value ? (
          <>
            {mediaType === "video" ? (
              <video src={value} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
            )}
            {mediaType === "video" && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                <VideoIcon size={12} /> Video
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("", null);
              }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/80 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--muted)]">
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Upload size={24} />
                <p className="text-sm">Click to upload</p>
                <p className="text-xs text-[var(--muted)]">
                  Image up to 5MB, video up to 30MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleUpload}
        className="hidden"
      />
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}
