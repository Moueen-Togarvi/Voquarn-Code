import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { buildMetadata } from "@/lib/metadata";
import { services } from "@/lib/site-data";

const process = [
  "Discovery and positioning",
  "UX, structure, and visual direction",
  "Build, content, and implementation",
  "Launch support and iteration",
];

export const metadata = buildMetadata(
  "Voquarn Code Services",
  "Web development, app development, SEO, AI solutions, and graphic design services from Voquarn Code.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <section className="page-section">
        <SectionHeading
          eyebrow="Services"
          title="Execution across the work that shapes digital credibility"
          description="We combine product thinking, strong visuals, and technical delivery so the final result looks sharp and performs like it was planned properly."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Process"
          title="A simple delivery rhythm"
          description="Enough structure to keep things clear, without burying the project in ceremony."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {process.map((step, index) => (
            <div key={step} className="panel rounded-[1.5rem] p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">Step {index + 1}</p>
              <p className="mt-3 font-display text-2xl text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section pt-8">
        <div className="panel rounded-[2rem] p-8 sm:p-10">
          <h2 className="font-display text-3xl font-semibold text-white">Need help choosing the right service mix?</h2>
          <p className="mt-4 max-w-2xl text-[rgba(233,238,242,0.72)]">
            We can scope a focused launch, a multi-phase rebuild, or a growth plan that pairs design and delivery with acquisition.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[#14b8a6] px-6 py-3 text-sm font-semibold text-[#07111a] hover:bg-[#2dd4bf]"
          >
            Talk through your project
          </Link>
        </div>
      </section>
    </>
  );
}
