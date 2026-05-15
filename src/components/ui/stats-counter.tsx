"use client";

import { useEffect, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

type StatsCounterProps = {
  items: Stat[];
};

export function StatsCounter({ items }: StatsCounterProps) {
  const [values, setValues] = useState(items.map(() => 0));

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);

      setValues(items.map((item) => Math.round(item.value * progress)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [items]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div key={item.label} className="panel rounded-[1.5rem] p-6 transition-transform hover:scale-[1.02]">
          <p className="counter-pop font-display text-4xl font-semibold text-foreground">
            {values[index]}
            {item.suffix || ""}
          </p>
          <p className="mt-2 text-sm text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
