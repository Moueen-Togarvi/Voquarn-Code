"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export function ArticleShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this article link", url);
    }
  }

  async function shareArticle() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await copyLink();
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 text-xs font-bold text-[var(--foreground)] hover:border-[#ff5400]/50 hover:text-[#ff5400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        type="button"
        onClick={shareArticle}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-3 text-xs font-bold text-white hover:bg-[#e04800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Article link copied" : ""}</span>
    </div>
  );
}
