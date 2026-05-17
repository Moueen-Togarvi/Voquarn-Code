"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const showcaseData = [
  {
    id: 1,
    eyebrow: "A VOQUARN DIGITAL PRODUCTION",
    bgText: "ENGINEER",
    fgText: "THE FUTURE OF WEB",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    bottomText: "SCALABLE SYSTEMS",
  },
  {
    id: 2,
    eyebrow: "ARTIFICIAL INTELLIGENCE",
    bgText: "INTELLIGENT",
    fgText: "AUTOMATED GROWTH",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    bottomText: "MACHINE LEARNING",
  },
  {
    id: 3,
    eyebrow: "CYBER SECURITY",
    bgText: "SECURE",
    fgText: "FORTRESS PROTOCOLS",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
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
    <section className="relative w-full min-h-[90vh] bg-black text-white overflow-hidden flex flex-col items-center justify-center py-20">
      
      {/* --- SPOTLIGHT CONE (ALWAYS ON, NARROW AT TOP, BRAND ORANGE) --- */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[70vw] h-full bg-gradient-to-b from-[#ff5400]/40 via-[#ff5400]/10 to-transparent blur-[35px] z-10 pointer-events-none"
        style={{ clipPath: 'polygon(48% 0, 52% 0, 85% 100%, 15% 100%)' }}
      />
      
      {/* Intense light origin point at the very top ceiling */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[15vw] h-[10vh] bg-[#ff5400]/60 blur-[40px] z-10 pointer-events-none"
      />

      {/* --- CONTENT CONTAINER (SLIDING ANIMATION) --- */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center h-full min-h-[600px] justify-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -150, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* Top Eyebrow Text */}
            <p className="text-[10px] md:text-xs font-medium tracking-[0.3em] text-[#ff5400]/60 uppercase mb-8 md:mb-12">
              {activeItem.eyebrow}
            </p>

            {/* Huge Background Text & Image Container */}
            <div className="relative w-full flex justify-center items-center -mt-4">
              <h2 className="text-[16vw] md:text-[11vw] font-black uppercase tracking-tighter text-[#ff5400]/15 leading-none whitespace-nowrap absolute top-1/2 -translate-y-1/2 z-0 font-display">
                {activeItem.bgText}
              </h2>
              
              {/* Foreground Image (The Subject in the Light) */}
              <div className="relative w-[280px] h-[350px] md:w-[350px] md:h-[450px] z-20 mt-12 mb-8">
                <Image 
                  src={activeItem.image}
                  alt={activeItem.fgText}
                  fill
                  className="object-cover rounded-xl shadow-[0_30px_60px_rgba(255,84,0,0.15)] border border-[#ff5400]/20"
                  style={{
                    // Mask the bottom so it fades into darkness like a poster
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                  }}
                  unoptimized
                />
              </div>
            </div>

            {/* Main Foreground Text */}
            <h3 className="text-xl md:text-3xl font-bold tracking-widest uppercase text-white mt-4 z-20 shadow-black drop-shadow-xl">
              {activeItem.fgText}
            </h3>

            {/* Bottom Small Text */}
            <div className="mt-20 border-t border-[#ff5400]/20 pt-8 w-full max-w-[200px] text-center z-20">
              <p className="text-[10px] md:text-xs tracking-[0.4em] font-medium text-[#ff5400]/60 uppercase">
                {activeItem.bottomText}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Manual Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {showcaseData.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === i ? 'bg-[#ff5400] scale-150' : 'bg-[#ff5400]/30 hover:bg-[#ff5400]/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
