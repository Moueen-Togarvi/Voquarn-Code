import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { TrustedClients } from "@/components/ui/trusted-clients";
import { TypoSection } from "@/components/ui/typo-section";
import { PortfolioCarousel } from "@/components/ui/portfolio-carousel";
import { SpotlightShowcase } from "@/components/ui/spotlight-showcase";
import { DiagonalMarquees } from "@/components/ui/diagonal-marquees";
import { EnterpriseSuites } from "@/components/ui/enterprise-suites";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { buildMetadata } from "@/lib/metadata";
import { portfolioItems, services } from "@/lib/site-data";

export const metadata = buildMetadata(
  "Voquarn Code | Home",
  "Explore Voquarn Code services, selected work, testimonials, and growth-focused digital delivery.",
  "/",
);

export default function HomePage() {
  return (
    <div className="relative bg-white text-black">
      {/* Pure white background for high-end minimal aesthetic */}

      <Hero />

      <TrustedClients />

      <TypoSection />

      <section className="page-section relative overflow-hidden border-b border-neutral-200 pb-20">
        {/* Ambient signature orange gradient glow in the background of the services section */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-[0.06] z-0 blur-[120px]" 
          style={{
            background: "radial-gradient(circle, #ff5400 0%, transparent 70%)"
          }}
        />

        <div className="relative z-10">
          <SectionHeading
            eyebrow="Our Services"
            title="We build digital systems that actually work"
            description="From high-end websites to custom SaaS products, we provide end-to-end engineering and design."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* The New Enterprise Domain Suites Showcase */}
      <EnterpriseSuites />

      {/* The New Criss-Crossing Diagonal Marquee Tape Section */}
      <DiagonalMarquees />

      <PortfolioCarousel items={portfolioItems} />

      {/* The New Cinematic Spotlight Showcase */}
      <SpotlightShowcase />

      <section className="page-section pt-8">
        <div className="rounded-[4rem] border-4 border-black bg-white p-12 sm:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[#ff5400] rounded-bl-[4rem] transition-transform group-hover:scale-110" />
          <span className="eyebrow text-[#ff5400] font-black">Ready when you are</span>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-black sm:text-5xl leading-none">
                IF YOUR CURRENT WEBSITE FEELS OUTDATED, <br /> WE SHOULD FIX THAT.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-[#ff5400] px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:scale-105 transition-all active:scale-95 shadow-xl"
            >
              Start Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
