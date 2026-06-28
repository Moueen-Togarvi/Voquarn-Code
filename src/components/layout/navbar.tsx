"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navItems } from "@/lib/site-data";
import { ThemeToggle } from "@/components/theme-toggle";

const navbarNavItems = navItems.filter((item) => item.href !== "/contact");

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
      <div className="bg-[var(--nav-bg)] backdrop-blur-md border border-[var(--border)] rounded-full px-4 md:px-6 py-1.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative">
        <div
          className="absolute top-0 left-0 h-[2px] bg-[#ff5400] rounded-full transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
          <img
            src="/final-logo.png"
            alt="Voquarn Logo"
            className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navbarNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-md"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link
            href="/contact"
            className="hidden items-center justify-center rounded-full bg-[#ff5400] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md md:inline-flex"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] md:hidden hover:bg-[var(--surface)] transition-colors"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
            </span>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="mt-3 bg-[var(--nav-bg)] backdrop-blur-md border border-[var(--border)] rounded-3xl p-6 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2">
            {navbarNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    active ? "bg-[var(--foreground)] text-[var(--background)] shadow-md" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Link
                href="/contact"
                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-[#ff5400] px-4 py-3 text-sm font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
