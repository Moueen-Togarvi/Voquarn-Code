"use client";

import React from "react";

export function TrustedClients() {
  const logos = [
    "/client-logo.png",
    "/client-logo-2.jpeg",
    "/client-logo-3.png",
  ];
  
  const repeatedImages = Array(12).fill(logos).flat();

  return (
    <section className="relative w-full bg-white py-16 border-b border-neutral-200 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 40s linear infinite;
        }
        .animate-marquee-ltr:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Eyebrow Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-display">
          Trusted by world-class teams and innovative brands
        </p>
      </div>

      {/* Marquee Container with Left-to-Right Animation */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Subtle gradient masks on left and right edges for smooth fading */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-ltr flex items-center gap-16 md:gap-24 pl-16 md:pl-24">
          {repeatedImages.map((src, index) => (
            <div 
              key={`logo-${index}`} 
              className="flex items-center justify-center cursor-pointer min-w-[120px] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={src} 
                alt="Client Logo" 
                className="object-contain max-h-12 md:max-h-16 w-auto rounded-lg grayscale opacity-40 mix-blend-multiply transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
