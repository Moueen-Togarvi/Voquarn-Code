import type { CSSProperties } from "react";

// A fixed, curated palette so topic colors stay on-brand instead of
// hashing into arbitrary (potentially ugly) hues. Any category string
// deterministically maps to the same color everywhere it's shown.
const CATEGORY_PALETTE = [
  "#ff5400", // orange (brand)
  "#2563eb", // blue
  "#7c3aed", // violet
  "#059669", // emerald
  "#e11d48", // rose
  "#ca8a04", // gold
  "#0891b2", // cyan
  "#c026d3", // fuchsia
  "#4f46e5", // indigo
  "#16a34a", // green
  "#db2777", // pink
  "#0d9488", // teal
] as const;

/** Deterministic hash so the same category always lands on the same color. */
export function categoryColor(category: string): string {
  let hash = 0;
  for (let index = 0; index < category.length; index += 1) {
    hash = (hash * 31 + category.charCodeAt(index)) >>> 0;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

/**
 * "solid" — a tinted, semi-opaque chip for badges sitting on photos (white text).
 * "soft" — a light tint + colored text for pills sitting on the page background.
 */
export function categoryBadgeStyle(category: string, variant: "solid" | "soft" = "solid"): CSSProperties {
  const hex = categoryColor(category);
  if (variant === "soft") {
    return { color: hex, backgroundColor: `${hex}14`, borderColor: `${hex}33` };
  }
  return { backgroundColor: `${hex}cc`, borderColor: `${hex}55` };
}
