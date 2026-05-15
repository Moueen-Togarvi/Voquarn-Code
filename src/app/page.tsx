import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { TypoSection } from "@/components/ui/typo-section";
import { PortfolioGrid } from "@/components/ui/portfolio-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { StatsCounter } from "@/components/ui/stats-counter";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { buildMetadata } from "@/lib/metadata";
import { portfolioItems, services, stats, testimonials } from "@/lib/site-data";

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

      <TypoSection />

      <section className="page-section">
        <SectionHeading
          eyebrow="Our Services"
          title="We build digital systems that actually work"
          description="From high-end websites to custom SaaS products, we provide end-to-end engineering and design."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Recent Work"
          title="Selected builds and growth systems"
          description="A mix of websites, apps, SEO sprints, and automation work shaped around real business bottlenecks."
        />
        <div className="mt-12">
          <PortfolioGrid items={portfolioItems.slice(0, 4)} />
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by businesses worldwide"
          description="The work matters, but so does the process around it: clarity, responsiveness, and useful momentum."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="The Numbers"
          title="A compact team built for sharp execution"
          description="We keep delivery lean, collaborative, and close to outcomes."
        />
        <div className="mt-12">
          <StatsCounter items={stats} />
        </div>
      </section>

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
