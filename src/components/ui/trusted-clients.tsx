import Image from "next/image";
import type { ClientLogo, ClientCategory } from "@/lib/site-data";

type TrustedClientsProps = {
  logos: ClientLogo[];
  categories: ClientCategory[];
};

export function TrustedClients({ logos, categories }: TrustedClientsProps) {
  if (logos.length === 0 && categories.length === 0) return null;

  // Repeated enough times for the marquee loop to read as seamless — admin
  // content can be any length, so repeat count scales down as the list grows.
  const logoRepeat = logos.length > 0 ? Math.max(2, Math.ceil(16 / logos.length)) : 0;
  const categoryRepeat = categories.length > 0 ? Math.max(2, Math.ceil(28 / categories.length)) : 0;
  const repeatedLogos = Array(logoRepeat).fill(logos).flat();
  const repeatedCategories = Array(categoryRepeat).fill(categories).flat();

  return (
    <section id="trusted" className="relative w-full py-16 border-b border-[var(--section-border)] overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--muted)] font-display">
          Teams we&apos;ve worked with
        </p>
      </div>

      {logos.length > 0 && (
        <div className="relative w-full overflow-hidden flex items-center mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-ltr flex items-center gap-16 md:gap-24 pl-16 md:pl-24">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`logo-${index}`}
                className="flex items-center justify-center cursor-pointer min-w-[120px] group relative"
                title={logo.name}
              >
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  width={128}
                  height={128}
                  className="object-contain max-h-12 md:max-h-16 w-auto rounded-lg transition-all duration-500 group-hover:scale-105"
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-ltr flex items-center gap-8 pl-8" style={{ animationDirection: "reverse", animationDuration: "50s" }}>
            {repeatedCategories.map((category, index) => (
              <span
                key={`category-${index}`}
                className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--muted)] opacity-40 hover:opacity-80 transition-opacity duration-300 whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full border border-[var(--border)]"
              >
                {category.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
