import Link from "next/link";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesToggle } from "@/components/ui/services-toggle";
import { buildMetadata } from "@/lib/metadata";
import { GSAPReveal, GSAPStagger } from "@/components/ui/gsap-reveal";

const process = [
  "Discovery and positioning",
  "UX, structure, and visual direction",
  "Build, content, and implementation",
  "Launch support and iteration",
];

const pageTitle = "Web Development, SEO, Apps & AI Automation Services | Voquarn Code";
const pageDescription =
  "Explore Voquarn Code services for conversion-focused websites, mobile apps, SaaS products, SEO systems, and AI workflow automation.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/services",
  {
    keywords: [
      "web development services",
      "SEO services",
      "mobile app development",
      "AI workflow automation",
      "SaaS development agency",
    ],
  },
);

export default function ServicesPage() {
  return (
    <>
      <PageStructuredData path="/services" name={pageTitle} description={pageDescription} type="CollectionPage" />
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-[0.06] z-0 blur-[120px]"
          style={{ background: "radial-gradient(circle, #ff5400 0%, transparent 70%)" }}
        />
        <div className="relative z-10">
          <GSAPReveal direction="up">
            <SectionHeading
              eyebrow="Services"
              title="Execution across the work that shapes digital credibility"
              description="We combine product thinking, strong visuals, and technical delivery so the final result looks sharp and performs like it was planned properly."
              headingLevel="h1"
            />
          </GSAPReveal>
          <GSAPReveal direction="up" delay={0.15}>
            <div className="mt-10">
              <ServicesToggle />
            </div>
          </GSAPReveal>
        </div>
      </section>

      <section className="page-section">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Process"
            title="A simple delivery rhythm"
            description="Enough structure to keep things clear, without burying the project in ceremony."
          />
        </GSAPReveal>
        <GSAPStagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {process.map((step, index) => (
            <div key={step} className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5400]">Step {index + 1}</p>
              <p className="mt-6 font-display text-2xl font-bold text-neutral-900 tracking-tight leading-snug">{step}</p>
            </div>
          ))}
        </GSAPStagger>
      </section>

      <section className="page-section pt-12">
        <GSAPReveal direction="up" delay={0.1}>
          <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5400]/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">Need help choosing the right service mix?</h2>
            <p className="mt-6 max-w-2xl text-neutral-300 text-base sm:text-lg leading-relaxed font-medium">
              We can scope a focused launch, a multi-phase rebuild, or a growth plan that pairs design and delivery with acquisition.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff5400] px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-lg transition-all hover:scale-105"
            >
              Talk through your project
            </Link>
          </div>
        </GSAPReveal>
      </section>
    </>
  );
}
