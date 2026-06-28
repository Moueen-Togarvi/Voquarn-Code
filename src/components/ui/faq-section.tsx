"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How long does a typical project take?",
    answer: "Basic websites launch in 2-3 weeks. Custom web apps and SaaS products typically take 4-8 weeks depending on scope. We provide a clear timeline before any work begins.",
  },
  {
    question: "What is your pricing model?",
    answer: "We offer fixed-price packages starting from PKR 10,000 for basic websites. Custom projects are scoped and quoted individually. No hidden fees, no hourly billing surprises.",
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Yes. Every project includes 2 weeks of complimentary support after launch. We also offer ongoing maintenance plans for clients who want continuous updates and monitoring.",
  },
  {
    question: "What technologies do you work with?",
    answer: "We primarily build with Next.js, React, TypeScript, and Node.js. For AI projects, we integrate with OpenAI, Gemini, and custom LLM pipelines. We choose tools based on your project's needs, not trends.",
  },
  {
    question: "Can I see your previous work?",
    answer: "Absolutely. Our portfolio showcases websites, mobile apps, AI tools, and enterprise systems we've built for clients across healthcare, retail, education, and more. Visit our Portfolio page for details.",
  },
  {
    question: "How do we communicate during the project?",
    answer: "We use WhatsApp for quick updates and scheduled calls for reviews. You'll receive progress updates at every milestone with live preview links so you can see the work in real time.",
  },
];

function FaqItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border)]">
      <button
        type="button"
        onClick={onToggle}
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

export function FaqSection() {
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
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
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
