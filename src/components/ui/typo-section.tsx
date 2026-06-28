"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TypoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const [activeWord, setActiveWord] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden py-10 lg:py-14 text-[var(--foreground)] border-b border-[var(--section-border)]"
      style={{ background: "var(--background)", cursor: "default" }}
    >
      <motion.div
        className="pointer-events-none absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,84,0,0.06)_0%,transparent_70%)] z-0"
        style={{ left: glowX, top: glowY }}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10 lg:px-8">
        <div className="relative w-full z-10">
          <div className="max-w-[80%] lg:max-w-[85%]">
            <div className="flex items-center gap-3 mb-4 select-none">
              <motion.span
                animate={{ width: activeWord ? 36 : 24 }}
                className="h-[2px] bg-[#ff5400]"
              />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff5400] transition-all duration-300">
                {activeWord ? `[ ACTIVE STAGE: ${activeWord} ]` : "Core Philosophy"}
              </span>
              <span className="text-[10px] text-[var(--muted)] opacity-50 ml-2">hover to explore</span>
            </div>

            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl leading-[1.08] mb-0 select-none">
              <span className="inline-block mr-3 transition-transform duration-300 hover:scale-[1.02]">
                For Every
              </span>

              <motion.span
                onMouseEnter={() => setActiveWord("PROJECT")}
                onMouseLeave={() => setActiveWord(null)}
                className="relative inline-block text-[#ff5400] cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <span className="absolute bottom-[102%] left-0 text-[9px] font-mono font-bold tracking-widest text-[#ff5400]/50 select-none pointer-events-none">
                  [ BUILD_INIT ]
                </span>
                PROJECT,
              </motion.span>

              <br />

              <span className="inline-block mr-3 transition-transform duration-300 hover:scale-[1.02]">
                A
              </span>

              <motion.span
                onMouseEnter={() => setActiveWord("BETTER")}
                onMouseLeave={() => setActiveWord(null)}
                className="relative inline-block italic font-normal font-serif text-[var(--foreground)]/85 cursor-pointer mr-3"
                whileHover={{ scale: 1.05, rotate: -1, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Better
              </motion.span>

              <motion.span
                onMouseEnter={() => setActiveWord("SOLUTION")}
                onMouseLeave={() => setActiveWord(null)}
                className="relative inline-block text-[var(--foreground)] cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                SOLUTION.
                <span className="absolute inset-0 bg-[#ff5400]/5 filter blur-md rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.span>
            </h2>

            <p className="mt-5 max-w-xl text-[14px] font-medium leading-7 text-[var(--muted)]">
              We approach every project with a clear process: understand the business goal first, then design the system that delivers it — no unnecessary complexity, no wasted motion.
            </p>

            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#ff5400] hover:gap-3 transition-all duration-300"
            >
              See our process <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
