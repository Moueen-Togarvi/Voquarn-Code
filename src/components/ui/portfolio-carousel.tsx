"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MousePointer2,
  MoveHorizontal,
} from "lucide-react";
import type { PortfolioItem } from "@/lib/site-data";

type PortfolioCarouselProps = {
  items: PortfolioItem[];
};

export function PortfolioCarousel({ items }: PortfolioCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeCard = trackRef.current?.children[activeIndex];

    activeCard?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  const move = (direction: "previous" | "next") => {
    setActiveIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? items.length - 1 : current - 1;
      }

      return (current + 1) % items.length;
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="portfolio"
      className="relative scroll-mt-24 overflow-hidden border-b border-neutral-200 bg-white px-4 py-20 text-black sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:76px_76px]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff5400]">
              Portfolio
            </span>
            <h2 className="mt-3 text-[clamp(34px,5vw,64px)] font-extrabold uppercase leading-none tracking-tight text-black">
              Selected Work
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-black/55">
              Clean digital products, growth systems, and AI workflows shaped for measurable business outcomes.
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#ff5400]/20 bg-[#ff5400]/10 px-3 py-2 text-[#ff5400]"
              aria-label="Scroll left to right. Hover cards to reveal tags."
              title="Scroll left to right. Hover cards to reveal tags."
            >
              <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
              <MousePointer2 className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => move("previous")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm hover:border-[#ff5400] hover:bg-[#ff5400] hover:text-white active:scale-95"
              aria-label="Previous portfolio item"
              title="Previous"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move("next")}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-sm hover:bg-[#ff5400] active:scale-95"
              aria-label="Next portfolio item"
              title="Next"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-7 pl-8 pr-4 [scrollbar-width:none] sm:pl-12 lg:pl-16 [&::-webkit-scrollbar]:hidden"
          aria-label="Portfolio carousel. Scroll left to right and hover cards to reveal technology tags."
        >
          {items.map((item, index) => (
            <article
              key={item.slug}
              className={`group flex h-[468px] w-[min(82vw,430px)] shrink-0 snap-center flex-col rounded-[24px] border bg-white p-5 shadow-[0_18px_58px_rgba(0,0,0,0.07)] transition-all duration-300 ${
                activeIndex === index
                  ? "border-[#ff5400]/45 shadow-[0_24px_74px_rgba(255,84,0,0.14)]"
                  : "border-neutral-200 hover:border-[#ff5400]/35 hover:shadow-[0_24px_74px_rgba(0,0,0,0.09)]"
              }`}
              onMouseEnter={() => setRevealedIndex(index)}
              onMouseLeave={() => setRevealedIndex(null)}
              onFocus={() => setRevealedIndex(index)}
              onBlur={() => setRevealedIndex(null)}
            >
              <div className="flex min-h-[58px] items-start justify-between gap-4">
                <h3 className="max-w-[82%] text-[21px] font-extrabold leading-tight tracking-tight text-black sm:text-[24px]">
                  {item.title}
                </h3>
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${item.title}`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-sm hover:border-[#ff5400] hover:bg-[#ff5400] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="relative mt-3 h-[210px] overflow-hidden rounded-[18px] border border-neutral-200 bg-neutral-950 sm:h-[250px]">
                <Image
                  src={item.imageUrl}
                  alt={`${item.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 390px, 82vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
                <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-sm">
                  {item.category}
                </span>
                <div
                  className={`absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
                    revealedIndex === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {item.stack.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/35 bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#ff5400] shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-4 min-h-[56px] text-[14px] font-medium leading-7 text-neutral-600 line-clamp-2 sm:text-[15px]">
                {item.summary}
              </p>

              <a
                href={`/portfolio#${item.slug}`}
                className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-black text-[#ff5400] hover:gap-3 hover:text-black"
              >
                Read more
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? "w-9 bg-[#ff5400]" : "w-2.5 bg-neutral-300 hover:bg-neutral-500"
              }`}
              aria-label={`Show ${item.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
