"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/site-data";

type StatsSectionProps = {
  items: Stat[];
};

export function StatsSection({ items }: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [values, setValues] = useState(items.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValues(items.map((item) => Math.round(item.value * eased)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, items]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 bg-[var(--background)] border-b border-[var(--section-border)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div
              key={item.label}
              className="relative rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8 text-center transition-transform hover:scale-[1.02]"
            >
              <p className="font-display text-4xl md:text-5xl font-black text-[#ff5400] tracking-tight">
                {values[index]}
                {item.suffix || ""}
              </p>
              <p className="mt-2 text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
