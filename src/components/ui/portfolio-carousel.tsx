"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
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

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  return (
    <div className="relative w-full bg-white text-black pt-24 pb-32 px-4 overflow-hidden flex flex-col items-center">
      {/* Exact style matches for 3D layout, adapted for light theme */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-wrapper {
          perspective: 1500px;
          transform-style: preserve-3d;
        }
        .coverflow-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease;
          border-radius: 16px;
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
        <p className="text-black/60 mt-6 text-[15px] max-w-lg leading-relaxed font-normal">
          Turn your ideas into high-quality digital systems in seconds,<br/>
          no technical bottlenecks needed.
        </p>

        {/* Dark button for high contrast on white background */}
        <div className="mt-8">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-3 bg-black rounded-[2rem] px-6 py-2.5 text-[14px] font-medium text-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-black hover:border-[#ff5400] hover:text-[#ff5400]"
          >
            Explore portfolio <ArrowRight size={14} className="ml-1" />
          </a>
        </div>
      </div>

      {/* 2. The 3D Coverflow Section - Clean light theme, real images */}
      <div className="relative w-full max-w-[1400px] h-[450px] flex items-center justify-center mt-4 mb-16 z-10">
        
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
            let zIndex = 20 - absOffset;
            let opacity = 1;

            if (offset < 0) {
              rotateY = 35 + (absOffset * 5);
              translateX = offset * 180 - (absOffset * 20);
              translateZ = -absOffset * 150;
              scale = 0.85 - (absOffset * 0.05);
            } else if (offset > 0) {
              rotateY = -35 - (absOffset * 5);
              translateX = offset * 180 + (absOffset * 20);
              translateZ = -absOffset * 150;
              scale = 0.85 - (absOffset * 0.05);
            } else {
              rotateY = 0;
              translateX = 0;
              translateZ = 100;
              scale = 1.1;
            }

            if (absOffset > 3) {
              opacity = 0;
            }

            return (
              <div
                key={`${item.slug}-${index}`}
                onClick={() => setActiveIndex(index)}
                className="coverflow-card absolute w-[240px] h-[360px] bg-gray-200 overflow-hidden cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-black/5"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  pointerEvents: opacity === 0 ? "none" : "auto",
                }}
              >
                {/* Real Image Integration */}
                <div className="relative w-full h-full group">
                  <Image 
                    src={cardImages[index % cardImages.length]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  
                  {/* Subtle color overlay to match brand */}
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Bottom shadow for image text readability if hover isn't active */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <h4 className="text-white font-bold text-sm line-clamp-1">{item.title}</h4>
                  </div>

                  {/* HOVER INFO & LINK - Elegant light theme overlay */}
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center items-center text-center z-20">
                    <span className="text-[10px] uppercase text-[#ff5400] font-bold tracking-widest">{item.category}</span>
                    <h3 className="text-lg font-bold text-black mt-2 leading-tight">{item.title}</h3>
                    <p className="text-[11px] text-black/60 mt-3 line-clamp-4 leading-relaxed">{item.summary}</p>
                    
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 bg-[#ff5400] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-black transition-colors"
                    >
                      View Live <ExternalLink size={12} />
                    </a>
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
