"use client";

import React from "react";

const CLIENT_LOGOS = [
  { src: "/client-logo.png", name: "Abayiza" },
  { src: "/client-logo-2.jpeg", name: "Baba Farid Public School" },
  { src: "/client-logo-3.png", name: "Al Farooq" },
  { src: "/client-logo-4.png", name: "Partner" },
];

const TEXT_CLIENTS = [
  "Healthcare Clinics",
  "Retail Brands",
  "Educational Institutions",
  "Local Businesses",
  "Startups",
  "E-commerce Stores",
  "Service Providers",
];

export function TrustedClients() {
  const repeatedLogos = Array(4).fill(CLIENT_LOGOS).flat();
  const repeatedText = Array(4).fill(TEXT_CLIENTS).flat();

  return (
    <section id="trusted" className="relative w-full py-16 border-b border-[var(--section-border)] overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--muted)] font-display">
          Teams we&apos;ve worked with
        </p>
      </div>

      <div className="relative w-full overflow-hidden flex items-center mb-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-ltr flex items-center gap-16 md:gap-24 pl-16 md:pl-24">
          {repeatedLogos.map((logo, index) => (
            <div
              key={`logo-${index}`}
              className="flex items-center justify-center cursor-pointer min-w-[120px] group relative"
              title={logo.name}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="object-contain max-h-12 md:max-h-16 w-auto rounded-lg grayscale opacity-40 mix-blend-multiply transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-ltr flex items-center gap-8 pl-8" style={{ animationDirection: "reverse", animationDuration: "50s" }}>
          {repeatedText.map((name, index) => (
            <span
              key={`text-${index}`}
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)] opacity-40 hover:opacity-80 transition-opacity duration-300 whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full border border-[var(--border)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
