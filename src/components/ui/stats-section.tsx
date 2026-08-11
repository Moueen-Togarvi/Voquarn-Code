import type { Stat } from "@/lib/site-data";

type StatsSectionProps = {
  items: Stat[];
};

export function StatsSection({ items }: StatsSectionProps) {
  return (
    <section
      className="relative w-full py-16 md:py-20 bg-[var(--background)] border-b border-[var(--section-border)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="relative rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8 text-center transition-transform hover:scale-[1.02]"
            >
              <p className="font-display text-4xl md:text-5xl font-black text-[#ff5400] tracking-tight">
                {item.value}
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
