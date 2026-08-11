"use client";

import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="order-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] transition-all duration-300 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
      aria-label="Back to top"
    >
      <ArrowUp size={12} /> Top
    </button>
  );
}
