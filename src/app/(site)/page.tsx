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
import { FaqSection } from "@/components/ui/faq-section";
import { BlogPreview } from "@/components/ui/blog-preview";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { stats } from "@/lib/site-data";
import { getServices, getPortfolioItems, getTestimonials, getFaqItems, getSiteSettings } from "@/lib/data";

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

export default async function HomePage() {
  const [services, portfolioItems, testimonials, faqItems, settings] = await Promise.all([
    getServices(),
    getPortfolioItems(),
    getTestimonials(),
    getFaqItems(),
    getSiteSettings(),
  ]);

  return (
    <div className="relative bg-[var(--background)] text-[var(--foreground)]">
      <PageStructuredData
        path="/"
        name={pageTitle}
        description={pageDescription}
        breadcrumbs={[{ name: "Home", path: "/" }]}
      />
      <JsonLd data={faqJsonLd(faqItems)} />

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
            <ServicesToggle services={services} whatsapp={settings.whatsapp} limit={4} />
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
        <HomeLazySections items={portfolioItems} />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <ReviewsCollage reviews={testimonials} />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <BlogPreview />
      </GSAPReveal>

      <GSAPReveal direction="up" delay={0.05}>
        <FaqSection items={faqItems} />
      </GSAPReveal>

    </div>
  );
}
