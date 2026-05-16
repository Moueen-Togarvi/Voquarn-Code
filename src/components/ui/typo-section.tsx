"use client";

import { motion } from "framer-motion";

const reveal = {
  duration: 0.7,
  ease: "easeOut" as const,
};

export function TypoSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 text-black lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative">
          <motion.div
            initial={false}
            animate={{ opacity: [0.35, 1], y: [18, 0] }}
            transition={reveal}
            className="relative z-10 flex items-start justify-between gap-8"
          >
            <h2 className="font-display text-[16vw] font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-[13vw] lg:text-[10rem]">
              For Every
            </h2>
            <div className="hidden max-w-[220px] pt-3 lg:block">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/40">
                Strategic insight.
              </p>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Every build starts with structure, clarity, and a direct business goal.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: [0.35, 1], y: [18, 0] }}
            transition={{ ...reveal, delay: 0.08 }}
            className="relative z-20 -mt-4 flex items-center justify-end sm:-mt-6 lg:-mt-8"
          >
            <span className="absolute left-0 hidden text-[11px] font-black uppercase tracking-[0.32em] text-black/35 lg:block">
              Scalable Systems
            </span>
            <h2 className="font-display text-[17vw] font-black uppercase leading-[0.82] tracking-[-0.06em] text-black/90 sm:text-[14vw] lg:text-[11rem]">
              Project
            </h2>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: [0.35, 1], y: [18, 0] }}
            transition={{ ...reveal, delay: 0.16 }}
            className="relative z-30 -mt-5 sm:-mt-7 lg:-mt-10"
          >
            <h2 className="font-display text-[16vw] font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-[13vw] lg:text-[10rem]">
              <span className="text-[#ff5400]">Better</span>{" "}
              <span className="text-black/85">Solution</span>
            </h2>

            <div className="mt-6 flex flex-col gap-6 border-t border-black/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/40">
                  Built For Modern Teams
                </p>
                <p className="mt-3 text-sm leading-6 text-black/60 sm:text-base">
                  We turn ideas into clean digital systems that look sharp, work fast, and stay easy to
                  manage after launch.
                </p>
              </div>

              <div className="flex gap-6 sm:gap-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/35">Build Fast</p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-black/35">
                    Launch Clean
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-black uppercase leading-none tracking-[-0.04em] sm:text-3xl">
                    Voquarn
                    <br />
                    Code
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,84,0,0.08),transparent_30%)]" />
    </section>
  );
}
