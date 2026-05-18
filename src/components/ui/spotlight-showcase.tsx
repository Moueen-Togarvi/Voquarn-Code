"use client";
 
import React from "react";
 
const showcaseData = [
  {
    id: 1,
    eyebrow: "DIGITAL PRODUCTION",
    bgText: "ENGINEER",
    fgText: "THE FUTURE OF WEB",
    bottomText: "SCALABLE SYSTEMS",
  },
  {
    id: 2,
    eyebrow: "ARTIFICIAL INTELLIGENCE",
    bgText: "INTELLIGENT",
    fgText: "AUTOMATED GROWTH",
    bottomText: "MACHINE LEARNING",
  },
  {
    id: 3,
    eyebrow: "CYBER SECURITY",
    bgText: "SECURE",
    fgText: "FORTRESS PROTOCOLS",
    bottomText: "ZERO TRUST ARCH.",
  }
];
 
export function SpotlightShowcase() {
  return (
    <section className="relative w-full bg-black text-white py-12 px-4 md:px-8 overflow-hidden border-t border-b border-neutral-900">
      
      {/* Section Eyebrow & Title */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#ff5400] mb-2 font-display">
          Core Capabilities
        </p>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-display">
          Precision Engineered Systems
        </h2>
      </div>

      {/* 3-Column Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {showcaseData.map((item) => (
          <div 
            key={item.id}
            className="relative w-full min-h-[200px] md:min-h-[220px] bg-[#08080a] border border-neutral-900/80 rounded-3xl overflow-hidden flex flex-col items-center justify-center group shadow-2xl"
          >
            {/* Ceiling Light Origin Point */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/80 blur-[8px] z-30 pointer-events-none transition-all duration-500 group-hover:w-12 group-hover:bg-white" />

            {/* ─── DARK BACKGROUND LAYER (Always visible, slightly blurred) ─── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 blur-[1.5px] select-none z-0 transition-all duration-500 group-hover:blur-[2px]">
              {/* Dark Eyebrow */}
              <p className="text-[8px] font-semibold tracking-[0.25em] text-[#ff5400]/40 uppercase mb-2">
                {item.eyebrow}
              </p>
              
              {/* Dark Center Text */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-[#3a3a40] leading-none font-display my-2">
                {item.bgText}
              </h3>
              
              {/* Dark Main Title */}
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#4a4a52] mt-1">
                {item.fgText}
              </h4>
   
              {/* Dark Bottom Specs */}
              <div className="mt-4 border-t border-neutral-800 pt-2 w-16 text-center">
                <p className="text-[8px] tracking-[0.3em] font-semibold text-neutral-600 uppercase">
                  {item.bottomText}
                </p>
              </div>
            </div>
   
            {/* ─── THE SPOTLIGHT CONE & BRIGHT FOREGROUND LAYER ─── */}
            <div 
              className="absolute inset-0 w-full h-full z-20 pointer-events-none transition-all duration-700 group-hover:scale-105"
              style={{ clipPath: 'polygon(48% 0, 52% 0, 82% 100%, 18% 100%)' }}
            >
              {/* Spotlight light beam glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/8 to-transparent blur-[8px]" />
   
              {/* Bright Illuminated Foreground matching exact dimensions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
                {/* Bright Eyebrow */}
                <p className="text-[8px] font-semibold tracking-[0.25em] text-[#ff5400] uppercase mb-2">
                  {item.eyebrow}
                </p>
                
                {/* Bright Center Text */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white leading-none font-display my-2 shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                  {item.bgText}
                </h3>
                
                {/* Bright Main Title */}
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-white mt-1">
                  {item.fgText}
                </h4>
   
                {/* Bright Bottom Specs */}
                <div className="mt-4 border-t border-white/20 pt-2 w-16 text-center">
                  <p className="text-[8px] tracking-[0.3em] font-semibold text-white/70 uppercase">
                    {item.bottomText}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle ambient border glow on hover */}
            <div className="absolute inset-0 border border-[#ff5400]/0 group-hover:border-[#ff5400]/30 rounded-3xl transition-colors duration-500 pointer-events-none z-30" />
          </div>
        ))}
      </div>
    </section>
  );
}
