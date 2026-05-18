"use client";

import React from "react";

// Premium high-fidelity SVGs for world-class tech brands
const clientLogos = [
  {
    name: "Linear",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
        <text x="32" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">LINEAR</text>
      </svg>
    ),
  },
  {
    name: "Vercel",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L24 20H0L12 0z" />
        <text x="32" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">VERCEL</text>
      </svg>
    ),
  },
  {
    name: "Supabase",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 110 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6 0L2 14h9.6v10L26 10h-11.4V0z" />
        <text x="34" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">SUPABASE</text>
      </svg>
    ),
  },
  {
    name: "Raycast",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 110 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="6" fill="currentColor" />
        <circle cx="10" cy="10" r="4" fill="white" />
        <text x="32" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">RAYCAST</text>
      </svg>
    ),
  },
  {
    name: "Retool",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4zm6 2v12h8V6H6z" />
        <text x="30" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">RETOOL</text>
      </svg>
    ),
  },
  {
    name: "Stripe",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4a4 4 0 0 0-4 4c0 3 4 4 4 6s-2 2-4 2c-2 0-3-1-3-3H0c0 5 4 7 8 7a8 8 0 0 0 8-8c0-4-4-5-4-7s2-1 4-1c2 0 3 1 3 3h5c0-4-4-7-8-7z" />
        <text x="28" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">STRIPE</text>
      </svg>
    ),
  },
  {
    name: "Figma",
    svg: (
      <svg className="h-6 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0h6a6 6 0 0 1 0 12H6a6 6 0 0 1 0-12zm0 12h6a6 6 0 0 1 0 12H6a6 6 0 0 1 0-12z" />
        <text x="28" y="17" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="16" letterSpacing="-0.5">FIGMA</text>
      </svg>
    ),
  },
];

export function TrustedClients() {
  return (
    <section className="relative w-full bg-white py-16 border-b border-neutral-100 overflow-hidden">
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
          animation: marquee-ltr 35s linear infinite;
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
          {/* Duplicate the list twice so it loops flawlessly from left to right */}
          {[...clientLogos, ...clientLogos].map((logo, index) => (
            <div 
              key={`${logo.name}-${index}`} 
              className="flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors duration-300 cursor-pointer"
            >
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
