"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site-data";

const navbarNavItems = navItems.filter((item) => item.href !== "/contact");

export function Navbar() {
  const pathname = usePathname();
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
    <header className="fixed top-6 left-1/2 z-50 hidden w-[92%] max-w-5xl -translate-x-1/2 md:block">
      <div className="bg-[var(--nav-bg)] backdrop-blur-md border border-[var(--border)] rounded-full px-4 md:px-6 py-1.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative">
        <div
          className="absolute top-0 left-0 h-[2px] bg-[#ff5400] rounded-full transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        <Link href="/" className="flex items-center group">
          <Image
            src="/final-logo.png"
            alt="Voquarn Logo"
            width={200}
            height={200}
            priority
            className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav className="flex items-center gap-1">
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

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-[#ff5400] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Contact Us
        </Link>
      </div>
    </header>
  );
}
