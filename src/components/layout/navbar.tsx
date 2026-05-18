"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/site-data";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
      <div className="bg-white/85 backdrop-blur-md border border-neutral-200/80 rounded-full px-6 py-1.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.12)]">

        {/* Logo Section */}
        <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/final-logo.png"
            alt="Voquarn Logo"
            className="h-20 md:h-24 w-auto object-contain -my-4 md:-my-6 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${active
                    ? "bg-black text-white shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-[#ff5400] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md md:inline-flex"
          >
            Contact Us
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-black md:hidden hover:bg-neutral-100 transition-colors"
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

      {/* Mobile Dropdown Menu */}
      {isOpen ? (
        <div className="mt-3 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-3xl p-6 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${active ? "bg-black text-white shadow-md" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
