"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const isHoveredRef = useRef(false);

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

    let animationFrameId: number;
    let latestX = 0;
    let latestY = 0;

    const updateCursorPosition = () => {
      if (cursorRef.current) {
        const scale = isHoveredRef.current ? 1.25 : 1;
        cursorRef.current.style.transform = `translate3d(${latestX - 20}px, ${latestY - 20}px, 0) scale(${scale})`;
      }
    };

    // Track cursor coordinates directly via DOM to bypass React re-renders completely
    const handleMouseMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      
      if (cursorRef.current && cursorRef.current.style.opacity !== "1") {
        cursorRef.current.style.opacity = "1";
      }

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    // Detect if hovering over interactive components
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

      if (isHoveredRef.current !== !!isInteractive) {
        isHoveredRef.current = !!isInteractive;
        if (cursorRef.current) {
          const scale = isHoveredRef.current ? 1.25 : 1;
          cursorRef.current.style.transform = `translate3d(${latestX - 20}px, ${latestY - 20}px, 0) scale(${scale})`;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Disable cursor on mobile or touch-only environments
  if (isMobile) return null;

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
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-150 ease-out"
        style={{
          mixBlendMode: "difference",
          willChange: "transform, opacity",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* Custom radiating spark dashes around the arrow tip (20, 20) */}
          <g className="transition-transform duration-300 origin-[20px_20px]">
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
