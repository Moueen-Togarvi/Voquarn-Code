"use client";

import { useEffect, useState } from "react";
import type { TableOfContentsItem } from "@/components/ui/rich-content";

const ACTIVE_OFFSET = 140;

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;

    const updateActive = () => {
      frame = 0;
      let current = items[0].id;
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET) current = item.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      setActiveId(atBottom ? items[items.length - 1].id : current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-labelledby="table-of-contents-heading"
      className="hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] lg:block"
    >
      <h2 id="table-of-contents-heading" className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[var(--foreground)]">
        In this article
      </h2>
      <ol className="space-y-0.5 border-l border-[var(--border)]">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <span aria-hidden="true" className="absolute inset-y-0.5 -left-px w-[2px] rounded-full bg-[#ff5400]" />
              )}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(item.id)}
                className={`block rounded-r-md py-1 pr-1 text-[13px] leading-[1.45] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] ${
                  item.level === 3 ? "pl-7" : "pl-4"
                } ${
                  isActive
                    ? "font-bold text-[var(--blog-accent)]"
                    : "text-[var(--muted)] hover:text-[#ff5400]"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
