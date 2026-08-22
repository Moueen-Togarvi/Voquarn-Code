"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ConfettiBurst } from "@/components/ui/confetti-burst";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  // Incremented on every toggle so each click fires its own burst.
  const [bursts, setBursts] = React.useState(0);
  const [burstOrigin, setBurstOrigin] = React.useState({ x: 0.5, y: 0.5 });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function handleToggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      // canvas-confetti wants viewport fractions, and the canvas is full-screen.
      setBurstOrigin({
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      });
    }
    setBursts((count) => count + 1);
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-full border border-border bg-panel animate-pulse" />
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-panel text-foreground transition-all hover:bg-foreground/5 active:scale-95 shadow-sm"
        onClick={handleToggle}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-[#f59e0b]" />
        ) : (
          <Moon className="h-5 w-5 text-[#14b8a6]" />
        )}
      </button>
      <ConfettiBurst preset="pop" trigger={bursts} origin={burstOrigin} />
    </>
  );
}
