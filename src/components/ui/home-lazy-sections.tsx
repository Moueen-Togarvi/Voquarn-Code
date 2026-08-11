import dynamic from "next/dynamic";
import type { PortfolioItem } from "@/lib/site-data";

const EnterpriseSuites = dynamic(
  () =>
    import("@/components/ui/enterprise-suites").then(
      (mod) => mod.EnterpriseSuites,
    ),
);

const DiagonalMarquees = dynamic(
  () =>
    import("@/components/ui/diagonal-marquees").then(
      (mod) => mod.DiagonalMarquees,
    ),
);

const PortfolioCarousel = dynamic(
  () =>
    import("@/components/ui/portfolio-carousel").then(
      (mod) => mod.PortfolioCarousel,
    ),
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
