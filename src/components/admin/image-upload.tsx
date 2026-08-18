"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadAdminMedia } from "@/lib/client-media-upload";

export function ImageUpload({
  value,
  onChange,
  label = "Cover Image",
  aspect = "aspect-[16/9]",
}: {
  value?: string;
  onChange: (url: string) => void;
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
      if (!file.type.startsWith("image/")) throw new Error("Please select an image file");
      const data = await uploadAdminMedia(file);
      onChange(data.url);
    } catch (err) {
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
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
                  PNG, JPG up to 5MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle size={13} /> {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
        />
      )}
    </div>
  );
}
