"use client";

import React, { useState, useEffect } from "react";
import type { PortfolioItem } from "@/lib/site-data";
import Image from "next/image";

type PortfolioCarouselProps = {
  items: PortfolioItem[];
};

// High-quality tech/SaaS Unsplash images to map to the items
const cardImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", // Dashboard/Data
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", // Analytics
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800", // Code
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800", // Finance/Graph
  "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800", // Abstract Tech
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800", // Data Center/Servers
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", // Global/Network
];

export function PortfolioCarousel({ items }: PortfolioCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(3);

  // Ensure we have exactly 7 items to form the perfect 3D arc (duplicate if necessary)
  const displayItems = [...items, ...items, ...items].slice(0, 7);

  // Buttery-smooth auto-advance interval for a continuous, lifelike feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayItems.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  const handleCardClick = (index: number, url: string) => {
    if (index === activeIndex) {
      window.open(url, "_blank");
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full bg-white text-black pt-24 pb-32 px-4 overflow-hidden flex flex-col items-center">
      {/* Exact style matches for 3D layout with custom, hyper-smooth easing */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-wrapper {
          perspective: 1500px;
          transform-style: preserve-3d;
        }
        .coverflow-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s ease, box-shadow 0.5s ease, border-color 0.5s ease;
          border-radius: 28px;
        }
        .coverflow-card:hover {
          box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important;
          border-color: rgba(255, 84, 0, 0.35) !important;
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
          top: 30%; right: -2px; width: 4px; height: 4px; background: black;
        }
        .pixel-text::before {
          content: '';
          position: absolute;
          bottom: 20%; left: -2px; width: 4px; height: 4px; background: black;
        }
      `}} />

      {/* 1. Header Section - Light theme adaptation */}
      <div className="text-center max-w-4xl mb-12 relative z-20 flex flex-col items-center">
        <h2 className="text-[clamp(32px,4vw,52px)] leading-[1.1] font-medium text-black tracking-tight">
          Create <span className="pixel-text text-[1.1em]">Stunning</span> Products <br />
          with Just a <span className="pixel-text text-[1.1em]">Vision</span>
        </h2>
      </div>

      {/* 2. The 3D Coverflow Section - Premium White Cards with QR codes */}
      <div className="relative w-full max-w-[1400px] h-[380px] flex items-center justify-center mt-4 mb-8 z-10">
        
        {/* Subtle background element instead of intense glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-[100%] bg-gray-50 blur-[80px] pointer-events-none" />

        <div className="perspective-wrapper relative w-full h-full flex items-center justify-center">
          {displayItems.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Highly accurate 3D transforms
            let rotateY = 0;
            let translateZ = 0;
            let translateX = 0;
            let scale = 1;
            const zIndex = 20 - absOffset;
            let opacity = 1;

            if (offset < 0) {
              rotateY = 32 + (absOffset * 4);
              translateX = offset * 210 - (absOffset * 25);
              translateZ = -absOffset * 180;
              scale = 0.85 - (absOffset * 0.04);
            } else if (offset > 0) {
              rotateY = -32 - (absOffset * 4);
              translateX = offset * 210 + (absOffset * 25);
              translateZ = -absOffset * 180;
              scale = 0.85 - (absOffset * 0.04);
            } else {
              rotateY = 0;
              translateX = 0;
              translateZ = 120;
              scale = 1.12;
            }

            if (absOffset > 3) {
              opacity = 0;
            }

            return (
              <div
                key={`${item.slug}-${index}`}
                onClick={() => handleCardClick(index, item.liveUrl)}
                className="coverflow-card absolute w-[270px] h-[325px] bg-white p-3.5 cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-neutral-100 flex flex-col justify-between"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  pointerEvents: opacity === 0 ? "none" : "auto",
                }}
              >
                {/* Image Container on Top - Bleeding layout inside padding */}
                <div className="relative w-full h-[145px] overflow-hidden rounded-[20px] bg-neutral-100 group">
                  <Image 
                    src={cardImages[index % cardImages.length]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  
                  {/* Glassmorphic Category tag overlaid at Top Left */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#ff5400] bg-white/95 backdrop-blur-md rounded-md shadow-sm border border-[#ff5400]/10">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Details Section */}
                <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex justify-between items-end px-0.5 pb-0.5">
                  
                  {/* Left Column: Title, Metadata, and View Project Button */}
                  <div className="flex flex-col items-start justify-center">
                    <h3 className="text-[13px] font-black text-black leading-tight tracking-tight uppercase line-clamp-1 font-display">
                      {item.title}
                    </h3>
                    
                    <div className="flex flex-col gap-0.5 text-[8px] font-bold uppercase text-neutral-400 tracking-widest mt-1.5 leading-tight font-display">
                      <span>REF: VQ-{item.slug.slice(0, 4).toUpperCase()}</span>
                      <span>Launch - {item.slug.includes("seo") ? "04/26" : "05/26"}</span>
                    </div>

                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center bg-black hover:bg-[#ff5400] text-white px-3.5 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-widest transition-all duration-300 mt-2.5 shadow-sm hover:shadow-md"
                    >
                      View Project
                    </a>
                  </div>

                  {/* Right Column: Premium Orange QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="p-1 bg-neutral-50 rounded-xl border border-neutral-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)] hover:bg-[#ff5400]/5 transition-colors">
                      <svg width="30" height="30" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#ff5400]">
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
                    <span className="text-[7px] font-black text-[#ff5400] tracking-wider text-center mt-1 uppercase leading-none">Scan live</span>
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
