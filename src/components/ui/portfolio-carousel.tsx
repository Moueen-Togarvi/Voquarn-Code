"use client";

import React, { useState, useEffect } from "react";
import type { PortfolioItem } from "@/lib/site-data";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PortfolioCarouselProps = {
  items: PortfolioItem[];
};

// High-quality tech/SaaS Unsplash images to map to the items
const cardImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", // Dashboard/Data
  "https://images.unsplash.com/photo-1460925895:afdab827c52f?auto=format&fit=crop&q=80&w=800", // Analytics
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800", // Code
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800", // Finance/Graph
  "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800", // Abstract Tech
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800", // Data Center/Servers
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", // Global/Network
];

export function PortfolioCarousel({ items }: PortfolioCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(10000); // Start at a high number so decrementing never goes negative
  const [isPaused, setIsPaused] = useState(false);

  // Continuous, slow majestic circular animation (infinite growth, 0 seconds pause, NO rewind jump)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 3800); // Super slow, majestic 3.8s perpetual motion
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCardClick = (virtualIndex: number, url: string) => {
    if (virtualIndex === activeIndex) {
      window.open(url, "_blank");
    } else {
      setActiveIndex(virtualIndex);
    }
  };

  return (
    <div className="relative w-full bg-white text-black pt-24 pb-32 px-4 overflow-hidden flex flex-col items-center border-b border-neutral-200">
      {/* Exact style matches for 3D layout with custom, hyper-smooth easing */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-wrapper {
          perspective: 1400px;
          transform-style: preserve-3d;
        }
        .coverflow-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: transform 3.8s linear, opacity 3.8s linear, box-shadow 0.5s ease, border-color 0.5s ease;
          border-radius: 32px;
        }
        .coverflow-card:hover {
          box-shadow: 0 30px 70px rgba(255, 84, 0, 0.15) !important;
          border-color: rgba(255, 84, 0, 0.4) !important;
        }
        .pixel-text {
          font-family: 'Courier New', monospace;
          letter-spacing: -2px;
          font-weight: 900;
          position: relative;
        }
        /* Tiny visual glitch/pixel effect adapted for white background */
        .pixel-text::after {
          content: '';
          position: absolute;
          top: 30%; right: -2px; width: 4px; height: 4px; background: #ff5400;
        }
        .pixel-text::before {
          content: '';
          position: absolute;
          bottom: 20%; left: -2px; width: 4px; height: 4px; background: #ff5400;
        }
      `}} />

      {/* 1. Header Section - Light theme adaptation */}
      <div className="text-center max-w-4xl mb-12 relative z-20 flex flex-col items-center">
        <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.1] font-medium text-black tracking-tight">
          Create <span className="pixel-text text-[1.1em] text-[#ff5400]">Stunning</span> Products <br />
          with Just a <span className="pixel-text text-[1.1em] text-[#ff5400]">Vision</span>
        </h2>
      </div>

      {/* 2. The 3D Coverflow Section - Premium Luxury Cards */}
      <div 
        className="relative w-full max-w-[1400px] h-[420px] flex items-center justify-center mt-4 mb-12 z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Subtle background element instead of intense glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-[100%] bg-gray-50 blur-[80px] pointer-events-none" />

        {/* Navigation Buttons matching the screenshot */}
        <button
          onClick={() => setActiveIndex((prev) => prev - 1)}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:bg-[#ff5400] transition-colors cursor-pointer active:scale-95 border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveIndex((prev) => prev + 1)}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:bg-[#ff5400] transition-colors cursor-pointer active:scale-95 border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="perspective-wrapper relative w-full h-full flex items-center justify-center">
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((offset) => {
            const virtualIndex = activeIndex + offset;
            const itemIndex = ((virtualIndex % items.length) + items.length) % items.length;
            const item = items[itemIndex];
            const absOffset = Math.abs(offset);

            // Highly accurate 3D transforms matching the inward-curving amphitheater screenshot perfectly
            let rotateY = 0;
            let translateZ = 0;
            let translateX = 0;
            let scale = 1;
            // In a concave cylinder, outer cards come closer to the viewer, so they get higher zIndex!
            const zIndex = 20 + absOffset;
            let opacity = 1;

            if (offset < 0) {
              // Left side cards (curving inward towards the viewer)
              if (absOffset === 1) {
                rotateY = 15; // Clockwise rotation so left edge comes closer
                translateX = -240;
                translateZ = 0;
                scale = 0.95;
              } else if (absOffset === 2) {
                rotateY = 32;
                translateX = -490;
                translateZ = 120;
                scale = 1.08;
              } else if (absOffset === 3) {
                rotateY = 45;
                translateX = -760;
                translateZ = 240;
                scale = 1.25;
              } else {
                // Offsets -4, -5 (offscreen to the left, animating out smoothly)
                rotateY = 55;
                translateX = -1050;
                translateZ = 360;
                scale = 1.35;
                opacity = 0;
              }
            } else if (offset > 0) {
              // Right side cards (curving inward towards the viewer)
              if (absOffset === 1) {
                rotateY = -15; // Counter-clockwise rotation so right edge comes closer
                translateX = 240;
                translateZ = 0;
                scale = 0.95;
              } else if (absOffset === 2) {
                rotateY = -32;
                translateX = 490;
                translateZ = 120;
                scale = 1.08;
              } else if (absOffset === 3) {
                rotateY = -45;
                translateX = 760;
                translateZ = 240;
                scale = 1.25;
              } else {
                // Offsets +4, +5 (offscreen to the right, animating out smoothly)
                rotateY = -55;
                translateX = 1050;
                translateZ = 360;
                scale = 1.35;
                opacity = 0;
              }
            } else {
              // Center active card (furthest back in the concave curve)
              rotateY = 0;
              translateX = 0;
              translateZ = -100;
              scale = 0.85;
            }

            if (absOffset > 3) {
              opacity = 0; // Show center + 3 on each side (7 cards total), exactly like the screenshot
            }

            return (
              <div
                key={virtualIndex}
                onClick={() => handleCardClick(virtualIndex, item.liveUrl)}
                className="coverflow-card absolute w-[250px] h-[350px] bg-white p-4 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-neutral-200/80 flex flex-col justify-between group"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  pointerEvents: opacity === 0 ? "none" : "auto",
                }}
              >
                {/* Image Container on Top - Cinematic layout inside padding */}
                <div className="relative w-full h-[160px] overflow-hidden rounded-[24px] bg-neutral-900 shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                  <Image 
                    src={cardImages[itemIndex % cardImages.length]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  
                  {/* Subtle inner shadow overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Glassmorphic Category tag overlaid at Top Left */}
                  <span className="absolute top-3 left-3 px-3.5 py-1 text-[9px] font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Details Section */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-end px-1 pb-1">
                  
                  {/* Left Column: Title, Metadata, and View Project Button */}
                  <div className="flex flex-col items-start justify-center flex-1 pr-2">
                    <h3 className="text-[11px] font-normal text-neutral-900 leading-snug tracking-tight uppercase line-clamp-2 group-hover:text-[#ff5400] transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Masterpiece 3D Glossy Pill Button */}
                    <span
                      className="inline-flex items-center justify-center bg-gradient-to-b from-[#2d2d2f] via-[#1b1b1d] to-[#0f0f10] text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_2px_2px_rgba(255,255,255,0.2),inset_0_-2px_2px_rgba(0,0,0,0.5)] group-hover:from-[#ff5400] group-hover:via-[#e04800] group-hover:to-[#b33900] group-hover:shadow-[0_10px_25px_rgba(255,84,0,0.4),inset_0_2px_2px_rgba(255,255,255,0.4)] transition-all duration-500 mt-4 active:scale-95"
                    >
                      View Project
                    </span>
                  </div>

                  {/* Right Column: Premium Neumorphic QR Code Scanner Badge */}
                  <div className="flex flex-col items-center flex-shrink-0 mb-0.5">
                    <div className="p-2 bg-neutral-900/5 rounded-[16px] border border-neutral-900/10 group-hover:bg-[#ff5400]/10 group-hover:border-[#ff5400]/20 transition-all duration-300 shadow-sm">
                      <svg width="28" height="28" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-600 group-hover:text-[#ff5400] transition-colors duration-300">
                        <rect x="0" y="0" width="7" height="7" fill="currentColor" />
                        <rect x="1" y="1" width="5" height="5" fill="white" />
                        <rect x="2" y="2" width="3" height="3" fill="currentColor" />
                        
                        <rect x="22" y="0" width="7" height="7" fill="currentColor" />
                        <rect x="23" y="1" width="5" height="5" fill="white" />
                        <rect x="24" y="2" width="3" height="3" fill="currentColor" />
                        
                        <rect x="0" y="22" width="7" height="7" fill="currentColor" />
                        <rect x="1" y="23" width="5" height="5" fill="white" />
                        <rect x="2" y="24" width="3" height="3" fill="currentColor" />
                        
                        <rect x="20" y="20" width="5" height="5" fill="currentColor" />
                        <rect x="21" y="21" width="3" height="3" fill="white" />
                        <rect x="22" y="22" width="1" height="1" fill="currentColor" />
                        
                        <rect x="8" y="2" width="2" height="1" fill="currentColor" />
                        <rect x="12" y="0" width="1" height="3" fill="currentColor" />
                        <rect x="15" y="1" width="3" height="1" fill="currentColor" />
                        <rect x="19" y="3" width="2" height="2" fill="currentColor" />
                        <rect x="9" y="5" width="3" height="2" fill="currentColor" />
                        <rect x="14" y="4" width="2" height="3" fill="currentColor" />
                        <rect x="0" y="9" width="3" height="2" fill="currentColor" />
                        <rect x="4" y="8" width="2" height="4" fill="currentColor" />
                        <rect x="8" y="9" width="5" height="2" fill="currentColor" />
                        <rect x="15" y="8" width="4" height="2" fill="currentColor" />
                        <rect x="21" y="9" width="3" height="1" fill="currentColor" />
                        <rect x="25" y="8" width="2" height="3" fill="currentColor" />
                        <rect x="1" y="13" width="4" height="2" fill="currentColor" />
                        <rect x="7" y="12" width="3" height="3" fill="currentColor" />
                        <rect x="12" y="15" width="2" height="2" fill="currentColor" />
                        <rect x="16" y="13" width="5" height="2" fill="currentColor" />
                        <rect x="23" y="12" width="2" height="4" fill="currentColor" />
                        <rect x="27" y="14" width="1" height="3" fill="currentColor" />
                        <rect x="4" y="17" width="2" height="2" fill="currentColor" />
                        <rect x="9" y="18" width="2" height="3" fill="currentColor" />
                        <rect x="13" y="19" width="4" height="1" fill="currentColor" />
                        <rect x="18" y="17" width="3" height="4" fill="currentColor" />
                        <rect x="25" y="19" width="3" height="2" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-black text-neutral-400 group-hover:text-[#ff5400] tracking-widest text-center mt-1.5 uppercase leading-none transition-colors duration-300">Scan live</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Columns - Clean light theme typography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1000px] w-full relative z-10 mt-8 px-4">
        
        {/* Column 1 */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-black leading-snug">
            Lightning-Fast<br/>Product Launches
          </h3>
          <p className="text-[13px] text-black/60 mt-3 leading-relaxed max-w-[260px]">
            From initial strategy to full deployment, we bring complex products to life in moments.
          </p>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-black leading-snug">
            Modular Architecture &<br/>Customization
          </h3>
          <p className="text-[13px] text-black/60 mt-3 leading-relaxed max-w-[260px]">
            Pick a core tech stack and fine-tune details like real-time databases and scaling logic.
          </p>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-black leading-snug">
            High-Resolution<br/>Engineering
          </h3>
          <p className="text-[13px] text-black/60 mt-3 leading-relaxed max-w-[260px]">
            Export your creations in high-quality robust architectures built for web or enterprise.
          </p>
        </div>

      </div>
    </div>
  );
}
