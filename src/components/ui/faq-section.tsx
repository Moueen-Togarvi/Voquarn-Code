"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/site-data";

type FaqEntry = FaqItem;

function FaqItemRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--border)]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between py-5 text-left group"
        >
          <span className="text-[15px] sm:text-[16px] font-bold text-[var(--foreground)] pr-4 group-hover:text-[#ff5400] transition-colors">
            {item.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-[var(--muted)]" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] font-medium leading-7 text-[var(--muted)] max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ items }: { items?: FaqEntry[] }) {
  const faqItems = items ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full py-20 md:py-24 bg-[var(--background)] border-b border-[var(--section-border)]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5400]" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
            FAQ
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display text-[var(--foreground)] mb-4">
          Common Questions
        </h2>
        <p className="text-[15px] font-medium leading-7 text-[var(--muted)] mb-10">
          Quick answers to the things clients ask most. Still have questions? Reach out anytime.
        </p>

        <div>
          {faqItems.map((item, index) => (
            <FaqItemRow
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
