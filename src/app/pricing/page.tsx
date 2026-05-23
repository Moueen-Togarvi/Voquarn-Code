import { PricingToggle } from "@/components/ui/pricing-toggle";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { GSAPReveal } from "@/components/ui/gsap-reveal";

export const metadata = buildMetadata(
  "Voquarn Code Pricing",
  "Compare Voquarn Code package tiers with PKR and USD pricing, then continue the conversation on WhatsApp.",
  "/pricing",
);

export default function PricingPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple tiers to make early scoping faster"
            description="The packages below are starting points. Final scope depends on content, workflow complexity, integrations, and timelines."
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
