"use client";

import dynamic from "next/dynamic";
import type { PortfolioItem } from "@/lib/site-data";

const EnterpriseSuites = dynamic(
  () =>
    import("@/components/ui/enterprise-suites").then(
      (mod) => mod.EnterpriseSuites,
    ),
  { ssr: false },
);

const DiagonalMarquees = dynamic(
  () =>
    import("@/components/ui/diagonal-marquees").then(
      (mod) => mod.DiagonalMarquees,
    ),
  { ssr: false },
);

const PortfolioCarousel = dynamic(
  () =>
    import("@/components/ui/portfolio-carousel").then(
      (mod) => mod.PortfolioCarousel,
    ),
  { ssr: false },
);

type HomeLazySectionsProps = {
  items: PortfolioItem[];
};

export function HomeLazySections({ items }: HomeLazySectionsProps) {
  return (
    <>
      <EnterpriseSuites />
      <DiagonalMarquees />
      <PortfolioCarousel items={items} />
    </>
  );
}
