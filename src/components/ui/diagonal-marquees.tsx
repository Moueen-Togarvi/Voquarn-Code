"use client";

import React from "react";

export function DiagonalMarquees() {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-[var(--background)] select-none border-b border-[var(--section-border)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] bg-white/60 dark:bg-black/60 backdrop-blur-md py-5 shadow-2xl border-y border-[var(--border)] z-10 transform rotate-4">
        <div className="marquee-ribbon animate-marquee-right flex items-center gap-16 pr-16">
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-6 flex-shrink-0">
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain dark:brightness-0 dark:invert"
                />
                <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-[var(--foreground)] uppercase font-display">
                  <span>VOQUARN,</span>
                  <span>PROFESSIONAL</span>
                  <span>DIGITAL PLATFORM</span>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain dark:brightness-0 dark:invert"
                />
                <div className="flex items-end gap-3">
                  <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-[var(--foreground)] uppercase font-display">
                    <span>BUILT IN PAKISTAN</span>
                    <span>USED</span>
                    <span>WORLDWIDE</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-black leading-none text-[#ff5400] font-display">
                    2026
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] bg-[#ff5400]/80 backdrop-blur-md py-5 shadow-2xl border-y border-white/30 z-20 transform -rotate-4">
        <div className="marquee-ribbon animate-marquee-left flex items-center gap-16 pr-16">
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-6 flex-shrink-0">
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain"
                />
                <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-black uppercase font-display">
                  <span>VOQUARN,</span>
                  <span>PROFESSIONAL</span>
                  <span>DIGITAL PLATFORM</span>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain"
                />
                <div className="flex items-end gap-3">
                  <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-black uppercase font-display">
                    <span>BUILT IN PAKISTAN</span>
                    <span>USED</span>
                    <span>WORLDWIDE</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-black leading-none text-white font-display shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                    2026
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
