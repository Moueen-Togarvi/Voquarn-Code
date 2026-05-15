"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/lib/site-data";

type PortfolioGridProps = {
  items: PortfolioItem[];
};

const allLabel = "All";

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const categories = [allLabel, ...new Set(items.map((item) => item.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredItems =
    activeCategory === allLabel ? items : items.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              activeCategory === category
                ? "bg-[#f59e0b] text-[#07111a] font-semibold"
                : "border border-border bg-panel text-muted hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <article key={item.slug} className="panel rounded-[1.75rem] p-6 transition-all duration-300 hover:border-[#14b8a6]/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-[#14b8a6]/20 bg-[#14b8a6]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#14b8a6]">
                {item.category}
              </span>
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#f59e0b] hover:text-[#fbbf24]"
              >
                Live link
              </a>
            </div>
            <h3 className="mt-5 font-display text-2xl text-foreground">{item.title}</h3>
            <p className="mt-3 text-muted">{item.summary}</p>
            <p className="mt-4 rounded-2xl border border-border bg-foreground/5 p-4 text-sm text-foreground">{item.outcome}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.stack.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <a href={`/portfolio#${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488]">
              Case study snapshot
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
