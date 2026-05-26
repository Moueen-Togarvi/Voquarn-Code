import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { HomeLazySections } from "@/components/ui/home-lazy-sections";
import { TrustedClients } from "@/components/ui/trusted-clients";
import { TypoSection } from "@/components/ui/typo-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesToggle } from "@/components/ui/services-toggle";
import { GSAPReveal } from "@/components/ui/gsap-reveal";
import { buildMetadata } from "@/lib/metadata";
import { portfolioItems } from "@/lib/site-data";

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

      <GSAPReveal>
        <TrustedClients />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <TypoSection />
      </GSAPReveal>

      <section className="page-section relative overflow-hidden border-b border-neutral-200 pb-20">
        <GSAPReveal direction="up">
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
          <div className="mt-10">
            <ServicesToggle limit={4} buttonVariant="orange" />
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5"
            >
              View all services
            </Link>
          </div>
        </div>
        </GSAPReveal>
      </section>

      <GSAPReveal direction="up" delay={0.05}>
        <HomeLazySections items={portfolioItems} />
      </GSAPReveal>

      <section className="page-section pt-8">
        <GSAPReveal direction="up" delay={0.1}>
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
        </GSAPReveal>
      </section>
    </div>
  );
}
