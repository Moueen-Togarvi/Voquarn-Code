"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef } from "react";

export function TypoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-fidelity cursor tracking coordinates for interactive spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring parameters for cursor glow lag
  const glowX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const [activeWord, setActiveWord] = useState<string | null>(null);

  // Mouse move handler
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
      className="relative overflow-hidden bg-white py-6 lg:py-8 text-black border-b border-neutral-200"
      style={{ cursor: "default" }}
    >
      {/* 1. HIGH-FIDELITY SPOTLIGHT: Interactive human-attraction cursor tracking glow */}
      <motion.div 
        className="pointer-events-none absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,84,0,0.06)_0%,transparent_70%)] z-0"
        style={{
          left: glowX,
          top: glowY,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10 lg:px-8">
        
        <div className="relative w-full z-10 flex items-center justify-between">
          
          {/* Left Side - Headline & Eyebrow */}
          <div className="max-w-[65%] lg:max-w-[72%]">
            
            {/* Eyebrow Philosophy label */}
            <div className="flex items-center gap-3 mb-4 select-none">
              <motion.span 
                animate={{ width: activeWord ? 36 : 24 }}
                className="h-[2px] bg-[#ff5400]" 
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff5400] transition-all duration-300">
                {activeWord ? `[ ACTIVE STAGE: ${activeWord} ]` : "Core Philosophy"}
              </span>
            </div>

            {/* 3. HUMAN ATTRACTION: Premium Headline with letter-hover reactions and micro-indicators */}
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-black sm:text-6xl lg:text-7xl leading-[1.08] mb-0 select-none">
              
              {/* Word Block 1 */}
              <span className="inline-block mr-3 transition-transform duration-300 hover:scale-[1.02]">
                For Every
              </span>

              {/* Word Block 2 (Interactive) */}
              <motion.span
                onMouseEnter={() => {
                  setActiveWord("PROJECT");
                }}
                onMouseLeave={() => {
                  setActiveWord(null);
                }}
                className="relative inline-block text-[#ff5400] cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {/* Tech tag floating above */}
                <span className="absolute bottom-[102%] left-0 text-[8px] font-mono font-bold tracking-widest text-[#ff5400]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none pointer-events-none">
                  [ BUILD_INIT ]
                </span>
                PROJECT,
              </motion.span>

              <br />

              {/* Word Block 3 */}
              <span className="inline-block mr-3 transition-transform duration-300 hover:scale-[1.02]">
                A 
              </span>

              {/* Word Block 4 (Interactive Serif font) */}
              <motion.span
                onMouseEnter={() => {
                  setActiveWord("BETTER");
                }}
                onMouseLeave={() => {
                  setActiveWord(null);
                }}
                className="relative inline-block italic font-normal font-serif text-black/85 cursor-pointer mr-3"
                whileHover={{ scale: 1.05, rotate: -1, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Better
              </motion.span>

              {/* Word Block 5 (Interactive Bold Outline/Solid Glow) */}
              <motion.span
                onMouseEnter={() => {
                  setActiveWord("SOLUTION");
                }}
                onMouseLeave={() => {
                  setActiveWord(null);
                }}
                className="relative inline-block text-black cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                SOLUTION.
                
                {/* Pulse glow background under SOLUTION */}
                <span className="absolute inset-0 bg-[#ff5400]/5 filter blur-md rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.span>
            </h2>

          </div>

          {/* Right Side - Absolute Positioned Asset Showcase (Guarantees ZERO impact on section height) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[130px] sm:w-[180px] md:w-[240px] lg:w-[300px] pointer-events-none flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/ass.png" 
              alt="Voquarn Asset Showcase" 
              className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105" 
            />
          </div>

        </div>

      </div>
    </section>
  );
}
