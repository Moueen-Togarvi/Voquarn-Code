import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/site-data";

export function FaqSection({ items = [] }: { items?: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="relative w-full border-b border-[var(--section-border)] bg-[var(--background)] py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#ff5400]" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
            FAQ
          </span>
        </div>
        <h2 className="mb-4 font-display text-3xl font-black uppercase tracking-tight text-[var(--foreground)] md:text-4xl">
          Common Questions
        </h2>
        <p className="mb-10 text-[15px] font-medium leading-7 text-[var(--muted)]" data-speakable>
          Clear answers about our web development, SEO, app development, SaaS, and AI automation services.
        </p>

        <div>
          {items.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-[var(--border)]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-left marker:content-none">
                <span className="pr-4 text-[15px] font-bold text-[var(--foreground)] transition-colors group-hover:text-[#ff5400] sm:text-[16px]">
                  {item.question}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pb-5 text-[14px] font-medium leading-7 text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
