import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { HomeLazySections } from "@/components/ui/home-lazy-sections";
import { TrustedClients } from "@/components/ui/trusted-clients";
import { TypoSection } from "@/components/ui/typo-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesToggle } from "@/components/ui/services-toggle";
import { GSAPReveal } from "@/components/ui/gsap-reveal";
import { ReviewsCollage } from "@/components/ui/reviews-collage";
import { StatsSection } from "@/components/ui/stats-section";
import { HowWeWork } from "@/components/ui/how-we-work";
import { FaqSection } from "@/components/ui/faq-section";
import { BlogPreview } from "@/components/ui/blog-preview";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { buildMetadata } from "@/lib/metadata";
import { portfolioItems, testimonials, stats } from "@/lib/site-data";

const pageTitle = "Voquarn Code | Web Development, SEO & AI Automation Agency";
const pageDescription =
  "Voquarn Code builds conversion-focused websites, mobile apps, SEO systems, and AI automation workflows for businesses in Pakistan and worldwide.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/",
  {
    keywords: [
      "web development agency Pakistan",
      "SEO agency Pakistan",
      "AI automation agency",
      "business website development",
    ],
  },
);

export default function HomePage() {
  return (
    <div className="relative bg-[var(--background)] text-[var(--foreground)]">
      <PageStructuredData
        path="/"
        name={pageTitle}
        description={pageDescription}
        breadcrumbs={[{ name: "Home", path: "/" }]}
      />

      <Hero />

      <GSAPReveal>
        <StatsSection items={stats} />
      </GSAPReveal>

      <GSAPReveal>
        <TrustedClients />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <TypoSection />
      </GSAPReveal>

      <section className="page-section relative overflow-hidden border-b border-[var(--section-border)] pb-20">
        <GSAPReveal direction="up">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-[0.06] z-0 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #ff5400 0%, transparent 70%)"
          }}
        />

        <div className="relative z-10">
          <SectionHeading
            eyebrow="What we do"
            title="Our Services"
            description="From high-end websites to custom SaaS products, we provide end-to-end engineering and design."
          />
          <div className="mt-10">
            <ServicesToggle limit={4} buttonVariant="orange" />
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--foreground)] shadow-sm transition-all hover:bg-[var(--surface)] hover:shadow-md hover:-translate-y-0.5"
            >
              View all services
            </Link>
          </div>
        </div>
        </GSAPReveal>
      </section>

      <GSAPReveal direction="up" delay={0.05}>
        <HowWeWork />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <HomeLazySections items={portfolioItems} />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <ReviewsCollage reviews={testimonials} />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <BlogPreview />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <FaqSection />
      </GSAPReveal>

      <section className="page-section pt-8">
        <GSAPReveal direction="up" delay={0.1}>
        <div className="rounded-[4rem] border-4 border-[var(--foreground)] bg-[var(--panel)] p-12 sm:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[#ff5400] rounded-bl-[4rem] transition-transform group-hover:scale-110" />
          <span className="eyebrow text-[#ff5400] font-black">Ready when you are</span>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-[var(--foreground)] sm:text-5xl leading-none">
                LET&apos;S BUILD SOMETHING <br /> REMARKABLE TOGETHER.
              </h2>
              <p className="mt-4 text-[14px] font-medium text-[var(--muted)]">
                Free consultation · No commitment · Reply within 24hrs
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-[#ff5400] px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:scale-105 transition-all active:scale-95 shadow-xl"
              >
                Start Project
              </Link>
              <a
                href="https://wa.me/923241940988"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border-2 border-[var(--foreground)] bg-[var(--panel)] px-10 py-5 text-sm font-black uppercase tracking-widest text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
        </GSAPReveal>
      </section>
    </div>
  );
}
