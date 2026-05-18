"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device is desktop / supports fine pointer
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateMobile = (matches: boolean) => {
      setIsMobile(!matches);
    };
    updateMobile(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      updateMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Track cursor coordinates
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible((prev) => {
        if (!prev) return true;
        return prev;
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect if hovering over interactive components to scale up the sparks
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer");

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Disable cursor on mobile or touch-only environments
  if (isMobile || !isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Remove default cursor for premium interactive desktop feel */
        @media (pointer: fine) {
          body, a, button, [role="button"], input, textarea, select, .cursor-pointer {
            cursor: none !important;
          }
        }
      `}} />

      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isHovered ? 1.25 : 1})`,
          mixBlendMode: "difference",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
        >
          {/* Custom radiating spark dashes around the arrow tip (20, 20) */}
          <g className={`transition-transform duration-300 origin-[20px_20px] ${isHovered ? "rotate-[15deg] scale-110" : ""}`}>
            {/* Spark 1 (Left-most, approx 165deg) */}
            <line x1="14.2" y1="21.5" x2="8.4" y2="23.1" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            {/* Spark 2 (approx 195deg) */}
            <line x1="14.2" y1="18.4" x2="8.4" y2="16.9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            {/* Spark 3 (Center, pointing up-left, 225deg) */}
            <line x1="15.8" y1="15.8" x2="10.1" y2="10.1" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            {/* Spark 4 (approx 255deg) */}
            <line x1="18.4" y1="14.2" x2="16.9" y2="8.4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            {/* Spark 5 (Right-most/Up-most, approx 285deg) */}
            <line x1="21.5" y1="14.2" x2="23.1" y2="8.4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          </g>

          {/* Stemless sharp chevron arrowhead pointing up-left (Tip points to 20, 20) */}
          <path
            d="M20 20 L37 27 L26 26 L27 37 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </>
  );
}
