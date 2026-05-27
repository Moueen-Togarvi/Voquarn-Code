"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
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
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
              activeCategory === category
                ? "bg-[#ff5400] text-white shadow-[0_12px_28px_rgba(255,84,0,0.25)]"
                : "border border-neutral-200 bg-white text-neutral-500 hover:border-[#ff5400]/40 hover:text-[#ff5400]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={item.slug}
            className="group flex h-full flex-col rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff5400]/40 hover:shadow-[0_24px_70px_rgba(255,84,0,0.14)]"
          >
            <div className="flex min-h-[64px] items-start justify-between gap-5 px-1 pt-1">
              <h3 className="max-w-[82%] text-[22px] font-extrabold leading-tight tracking-tight text-black sm:text-2xl">
                {item.title}
              </h3>
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${item.title}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm hover:border-[#ff5400] hover:bg-[#ff5400] hover:text-white"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-950">
              <Image
                src={item.imageUrl}
                alt={`${item.title} preview`}
                fill
                sizes="(min-width: 1280px) 31vw, (min-width: 1024px) 47vw, 92vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
              <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-sm">
                {item.category}
              </span>
            </div>

            <p className="mt-6 min-h-[84px] text-[15px] leading-7 text-neutral-600 line-clamp-3">
              {item.summary}
            </p>
            <p className="mt-4 border-t border-neutral-100 pt-4 text-sm leading-6 text-neutral-700">
              <span className="font-black uppercase tracking-[0.16em] text-[#ff5400]">Outcome </span>
              {item.outcome}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={`/portfolio#${item.slug}`}
              className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-black text-[#ff5400] hover:gap-3 hover:text-black"
            >
              Read more
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
