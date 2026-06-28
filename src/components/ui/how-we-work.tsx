"use client";

import { motion } from "framer-motion";
import { Search, Palette, Code, Rocket } from "lucide-react";

const PROCESS_STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Discovery",
    description: "We learn your business, audience, and goals. No assumptions — just clarity on what needs to be built and why.",
    color: "#14b8a6",
  },
  {
    num: "02",
    icon: Palette,
    title: "Design",
    description: "Wireframes and visual systems that prioritize conversion, clarity, and brand consistency over decoration.",
    color: "#f59e0b",
  },
  {
    num: "03",
    icon: Code,
    title: "Build",
    description: "Clean, performant code with real functionality. Every feature tested, every page optimized for speed and SEO.",
    color: "#ff5400",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Launch",
    description: "Deployment, monitoring, and post-launch support. We stay until it works — and keep working after.",
    color: "#8b5cf6",
  },
];

export function HowWeWork() {
  return (
    <section className="relative w-full py-20 md:py-24 bg-[var(--background)] border-b border-[var(--section-border)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5400]" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400]">
            Our Process
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-display text-[var(--foreground)] mb-4">
          How We Work
        </h2>
        <p className="max-w-xl text-[15px] font-medium leading-7 text-[var(--muted)] mb-12">
          A proven four-step methodology that takes your project from idea to launch — without the messy middle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 rounded-t-[24px] transition-all duration-300"
                  style={{ background: step.color }}
                />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${step.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <span className="text-[11px] font-mono font-bold text-[var(--muted)] tracking-wider">
                  STEP {step.num}
                </span>

                <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-[var(--foreground)]">
                  {step.title}
                </h3>

                <p className="mt-3 text-[13px] font-medium leading-6 text-[var(--muted)]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
