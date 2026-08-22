"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { navItems } from "@/lib/site-data";

// Contact is the standalone call to action on the right, so it is not repeated
// inside the centre group.
const navbarNavItems = navItems.filter((item) => item.href !== "/contact");

// The hash is read by ContactPanel to open the matching tab.
const quickActions = [
  { href: "/contact#meeting", label: "Book a meeting", Icon: CalendarDays, dot: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressRef.current?.style.setProperty("transform", `scaleX(${progress / 100})`);
        frameId = 0;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <header className="fixed top-5 left-1/2 z-50 w-[94%] max-w-6xl -translate-x-1/2">
      <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--nav-bg)] px-3 py-2 shadow-[0_18px_44px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-[#ff5400]"
        />

        <Link href="/" className="group shrink-0" onClick={() => setIsOpen(false)}>
          {/* nav-logo.png is final-logo.png with its ~31% dead padding trimmed, so
              the wordmark stays readable at navbar size. Black line-art, so it
              needs inverting on dark backgrounds. */}
          <Image
            src="/nav-logo.png"
            alt="Voquarn Code"
            width={356}
            height={204}
            priority
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 md:h-10 dark:brightness-0 dark:invert"
          />
        </Link>

        <div className="hidden items-center gap-1 rounded-xl bg-[var(--surface)] p-1.5 lg:flex">
          <nav aria-label="Main menu" className="flex items-center gap-0.5">
            {navbarNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold text-[var(--foreground)] transition-all duration-200 ${
                    active
                      ? "bg-[var(--panel)] shadow-sm"
                      : "hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <span className="mx-1 h-6 w-px bg-[var(--border)]" aria-hidden="true" />

          {quickActions.map(({ href, label, Icon, dot }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className="relative flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)] transition-colors hover:border-[#ff5400]/40 hover:text-[#ff5400]"
            >
              <Icon className="size-4" aria-hidden="true" />
              {dot ? (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500 ring-2 ring-[var(--panel)]" />
              ) : null}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,84,0,0.28)] transition-all duration-300 hover:bg-[#e64c00] active:scale-95 lg:inline-flex"
            onClick={() => setIsOpen(false)}
          >
            Start a Project
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] lg:hidden"
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
        <div className="mt-2.5 rounded-2xl border border-[var(--border)] bg-[var(--nav-bg)] p-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile menu">
            {navbarNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors ${
                    active ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <span className="my-1 h-px bg-[var(--border)]" aria-hidden="true" />

            {quickActions.map(({ href, label, Icon, dot }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative flex size-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--panel)]">
                  <Icon className="size-4" aria-hidden="true" />
                  {dot ? (
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500 ring-2 ring-[var(--panel)]" />
                  ) : null}
                </span>
                {label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5400] px-4 py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              Start a Project
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
