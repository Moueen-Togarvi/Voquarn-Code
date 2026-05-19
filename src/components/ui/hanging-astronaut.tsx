"use client";

import { usePathname } from "next/navigation";

export function HangingAstronaut() {
  const pathname = usePathname();

  return (
    <div 
      className={`fixed top-0 transition-all duration-1000 ease-in-out pointer-events-none origin-top animate-astronaut-swing z-40 hidden sm:block ${
        pathname === "/about" 
          ? "left-0 sm:left-4 md:left-6 lg:left-8" 
          : "right-0 sm:right-4 md:right-6 lg:right-8"
      } w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/astronaut-hanging.png" 
        alt="Hanging Astronaut"
        className="w-full h-auto"
      />
    </div>
  );
}
