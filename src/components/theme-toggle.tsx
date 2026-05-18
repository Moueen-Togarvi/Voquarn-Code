"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-full border border-border bg-panel animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-panel text-foreground transition-all hover:bg-foreground/5 active:scale-95 shadow-sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[#f59e0b]" />
      ) : (
        <Moon className="h-5 w-5 text-[#14b8a6]" />
      )}
    </button>
  );
}
