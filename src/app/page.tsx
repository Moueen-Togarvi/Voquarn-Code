import Link from "next/link";
import { Hero } from "@/components/ui/hero";
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
    <>
      <Hero />

      <section className="page-section">
        <SectionHeading
          eyebrow="Services preview"
          title="Digital execution across the pieces that usually break in separate hands"
          description="We bring strategy, design, engineering, and growth thinking into one delivery path so launches feel coordinated instead of stitched together."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected builds and growth systems"
          description="A mix of websites, apps, SEO sprints, and automation work shaped around real business bottlenecks."
        />
        <div className="mt-10">
          <PortfolioGrid items={portfolioItems.slice(0, 4)} />
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Testimonials"
          title="Teams trust us to turn scattered ideas into launchable systems"
          description="The work matters, but so does the process around it: clarity, responsiveness, and useful momentum."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Stats counter"
          title="A compact team built for sharp execution"
          description="We keep delivery lean, collaborative, and close to outcomes."
        />
        <div className="mt-10">
          <StatsCounter items={stats} />
        </div>
      </section>

      <section className="page-section pt-8">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(20,184,166,0.16),rgba(245,158,11,0.16))] p-8 sm:p-10">
          <span className="eyebrow">Ready when you are</span>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                If your current site feels generic, outdated, or disconnected from how you sell, we should fix that.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07111a] hover:bg-[#f8fafc]"
            >
              Start the conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
