import { PricingToggle } from "@/components/ui/pricing-toggle";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { GSAPReveal } from "@/components/ui/gsap-reveal";

const pageTitle = "Website, App, SEO & AI Automation Pricing | Voquarn Code";
const pageDescription =
  "Compare starting package prices for Voquarn Code websites, apps, SaaS builds, SEO systems, and AI automation projects in PKR and USD.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/pricing",
  {
    keywords: [
      "website development pricing",
      "app development pricing",
      "SEO package pricing",
      "AI automation pricing",
    ],
  },
);

export default function PricingPage() {
  return (
    <>
      <PageStructuredData path="/pricing" name={pageTitle} description={pageDescription} type="CollectionPage" />
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple tiers to make early scoping faster"
            description="The packages below are starting points. Final scope depends on content, workflow complexity, integrations, and timelines."
            headingLevel="h1"
          />
        </GSAPReveal>
        <GSAPReveal direction="up" delay={0.15}>
          <div className="mt-10">
            <PricingToggle />
          </div>
        </GSAPReveal>
        <GSAPReveal direction="fade" delay={0.2}>
          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
            PKR and USD values are presented as straightforward package references for international and local clients.
          </p>
        </GSAPReveal>
      </section>
    </>
  );
}
