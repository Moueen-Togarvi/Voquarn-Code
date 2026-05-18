"use client";
 
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
const showcaseData = [
  {
    id: 1,
    eyebrow: "A VOQUARN DIGITAL PRODUCTION",
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
    bottomText: "ZERO TRUST ARCHITECTURE",
  }
];
 
export function SpotlightShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
 
  // Auto-scroll through cards
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
 
  const activeItem = showcaseData[activeIndex];
 
  return (
    <section className="relative w-full min-h-[350px] md:min-h-[400px] bg-black text-white overflow-hidden flex items-center justify-center py-10">
      
      {/* ─── DARK BACKGROUND LAYER (Always visible but extremely dark) ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center px-4"
          >
            {/* Dark Eyebrow */}
            <p className="text-[8px] md:text-[9px] font-semibold tracking-[0.3em] text-[#ff5400]/20 uppercase mb-3">
              {activeItem.eyebrow}
            </p>
            
            {/* Dark Center Text */}
            <h2 className="text-[11vw] md:text-[6.5vw] font-black uppercase tracking-tighter text-[#121214] leading-none font-display">
              {activeItem.bgText}
            </h2>
            
            {/* Dark Main Title */}
            <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-[#1c1c1f] mt-3">
              {activeItem.fgText}
            </h3>
 
            {/* Dark Bottom Specs */}
            <div className="mt-6 border-t border-neutral-900 pt-3 w-full max-w-[100px] text-center">
              <p className="text-[8px] tracking-[0.4em] font-semibold text-neutral-900 uppercase">
                {activeItem.bottomText}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
 
      {/* ─── THE NARROW WHITE SPOTLIGHT CONE LAYER (Clipped & Illuminated) ─── */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] md:w-[22vw] h-full z-20 pointer-events-none"
        style={{ clipPath: 'polygon(48% 0, 52% 0, 85% 100%, 15% 100%)' }}
      >
        {/* Spotlight light beam glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/12 to-transparent blur-[12px]" />
 
        {/* ─── BRIGHT ILLUMINATED FOREGROUND LAYER ─── */}
        {/* We use width 100vw centered relative to this clipped container, matching the dark background layer exactly! */}
        <div className="absolute inset-0 w-[100vw] left-1/2 -translate-x-1/2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              {/* Bright Eyebrow */}
              <p className="text-[8px] md:text-[9px] font-semibold tracking-[0.3em] text-[#ff5400] uppercase mb-3">
                {activeItem.eyebrow}
              </p>
              
              {/* Bright Center Text */}
              <h2 className="text-[11vw] md:text-[6.5vw] font-black uppercase tracking-tighter text-white leading-none font-display">
                {activeItem.bgText}
              </h2>
              
              {/* Bright Main Title */}
              <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-white mt-3">
                {activeItem.fgText}
              </h3>
 
              {/* Bright Bottom Specs */}
              <div className="mt-6 border-t border-white/10 pt-3 w-full max-w-[100px] text-center">
                <p className="text-[8px] tracking-[0.4em] font-semibold text-white/50 uppercase">
                  {activeItem.bottomText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
 
      {/* Intense light origin point at the very top ceiling */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[5vw] h-[8vh] bg-white/70 blur-[20px] z-30 pointer-events-none"
      />
 
      {/* Manual Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {showcaseData.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? 'bg-[#ff5400] scale-125' : 'bg-neutral-800 hover:bg-neutral-600'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
 
    </section>
  );
}
