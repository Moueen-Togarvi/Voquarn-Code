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
            className={`rounded-full px-4 py-2 text-sm ${
              activeCategory === category
                ? "bg-[#f59e0b] text-[#07111a]"
                : "border border-white/10 bg-white/5 text-[rgba(233,238,242,0.72)] hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <article key={item.slug} className="panel rounded-[1.75rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#99f6e4]">
                {item.category}
              </span>
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#fcd34d] hover:text-[#fde68a]"
              >
                Live link
              </a>
            </div>
            <h3 className="mt-5 font-display text-2xl text-white">{item.title}</h3>
            <p className="mt-3 text-[rgba(233,238,242,0.72)]">{item.summary}</p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white">{item.outcome}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.stack.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-[rgba(233,238,242,0.68)]">
                  {tag}
                </span>
              ))}
            </div>
            <a href={`/portfolio#${item.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[#99f6e4] hover:text-white">
              Case study snapshot
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
