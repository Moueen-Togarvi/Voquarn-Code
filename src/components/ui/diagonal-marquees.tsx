"use client";

import React from "react";

export function DiagonalMarquees() {
  return (
    <section className="relative w-full py-36 overflow-hidden bg-white select-none border-b border-neutral-200 blur-[1px] md:blur-[1.5px]">

      {/* Inject custom CSS keyframes for smooth infinite marquee looping */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 35s linear infinite;
        }
        .marquee-ribbon {
          display: flex;
          width: max-content;
        }
      `}} />

      {/* ─── BLACK RIBBON (Bottom Layer, Tilted Downwards +4deg, Moving Right) ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] bg-black py-5 shadow-2xl border-y border-neutral-800 z-10 transform rotate-4">
        <div className="marquee-ribbon animate-marquee-right flex items-center gap-16 pr-16">
          {/* Repeat 6 times (12 blocks total) for seamless infinite looping */}
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              {/* Item 1: Logo + Block A */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Logo - Pure White */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain filter brightness-0 invert"
                />
                {/* Block A Typography - White text */}
                <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-white uppercase font-display">
                  <span>VOQUARN,</span>
                  <span>PROFESSIONAL</span>
                  <span>DIGITAL PLATFORM</span>
                </div>
              </div>

              {/* Item 2: Logo + Block B (Conference + 2026 in Orange) */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Logo - Pure White */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain filter brightness-0 invert"
                />
                {/* Block B Typography */}
                <div className="flex items-end gap-3">
                  <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-white uppercase font-display">
                    <span>VOQUARN</span>
                    <span>COMMUNITY</span>
                    <span>CONFERENCE</span>
                  </div>
                  {/* Highlighted Year - Orange */}
                  <span className="text-2xl md:text-3xl font-black leading-none text-[#ff5400] font-display">
                    2026
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── ORANGE RIBBON (Top Layer, Tilted Upwards -4deg, Moving Left) ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] bg-[#ff5400] py-5 shadow-2xl border-y border-white/30 z-20 transform -rotate-4">
        <div className="marquee-ribbon animate-marquee-left flex items-center gap-16 pr-16">
          {/* Repeat 6 times (12 blocks total) for seamless infinite looping */}
          {Array.from({ length: 6 }).map((_, idx) => (
            <React.Fragment key={idx}>
              {/* Item 1: Logo + Block A */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Logo - Pure Black */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain"
                />
                {/* Block A Typography - Black text */}
                <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-black uppercase font-display">
                  <span>VOQUARN,</span>
                  <span>PROFESSIONAL</span>
                  <span>DIGITAL PLATFORM</span>
                </div>
              </div>

              {/* Item 2: Logo + Block B (Conference + 2026 in White) */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Logo - Pure Black */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/final-logo.png"
                  alt="Voquarn Logo"
                  className="h-11 w-auto object-contain"
                />
                {/* Block B Typography */}
                <div className="flex items-end gap-3">
                  <div className="flex flex-col text-[11px] md:text-xs font-black tracking-tight leading-[1.1] text-black uppercase font-display">
                    <span>VOQUARN</span>
                    <span>COMMUNITY</span>
                    <span>CONFERENCE</span>
                  </div>
                  {/* Highlighted Year - White */}
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
