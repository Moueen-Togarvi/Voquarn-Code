import { PricingToggle } from "@/components/ui/pricing-toggle";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { pricingPlans } from "@/lib/site-data";

export const metadata = buildMetadata(
  "Voquarn Code Pricing",
  "Compare Voquarn Code package tiers with PKR and USD pricing, then continue the conversation on WhatsApp.",
  "/pricing",
);

export default function PricingPage() {
  return (
    <>
      <section className="page-section">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple tiers to make early scoping faster"
          description="The packages below are starting points. Final scope depends on content, workflow complexity, integrations, and timelines."
        />
        <div className="mt-10">
          <PricingToggle plans={pricingPlans} />
        </div>
        <p className="mt-5 text-sm text-[rgba(233,238,242,0.56)]">
          PKR and USD values are presented as straightforward package references for international and local clients.
        </p>
      </section>
    </>
  );
}
