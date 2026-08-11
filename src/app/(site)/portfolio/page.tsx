import { PortfolioGrid } from "@/components/ui/portfolio-grid";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { itemListJsonLd } from "@/lib/schema";
import { getPortfolioItems } from "@/lib/data";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

const pageTitle = "Portfolio & Case Studies | Voquarn Code";
const pageDescription =
  "Browse Voquarn Code case studies across websites, apps, SEO growth, AI systems, and brand design with outcomes and live project references.";
const pageKeywords = [
  "web development portfolio Pakistan",
  "website design case studies",
  "Next.js projects portfolio",
  "mobile app development portfolio",
  "SaaS development case studies",
  "SEO results case studies",
  "AI automation projects",
  "ecommerce website portfolio",
  "UI UX design portfolio Pakistan",
  "software agency case studies",
];

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/portfolio",
  {
    keywords: pageKeywords,
  },
);

// Regenerated hourly so admin edits reach the live site without a redeploy.
export const revalidate = 3600;

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <>
      <PageStructuredData
        path="/portfolio"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
        keywords={pageKeywords}
      />
      <JsonLd
        data={itemListJsonLd(
          portfolioItems.map((item) => ({
            name: item.title,
            path: `/portfolio#${item.slug}`,
            description: item.summary,
          })),
          "Voquarn Code case studies",
        )}
      />
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Portfolio"
          title="A cross-section of delivery work"
          description="Filter the work by category, scan the outcomes, and jump into live project references."
          headingLevel="h1"
        />
        <div className="mt-10">
          <PortfolioGrid items={portfolioItems} />
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Case studies"
          title="Quick snapshots from recent engagements"
          description="Each project is scoped differently, but the goal stays the same: create a stronger business system than what was there before."
        />
        <div className="mt-10 space-y-6">
          {portfolioItems.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="group scroll-mt-28 rounded-[30px] border border-neutral-200 bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#ff5400]/40 hover:shadow-[0_24px_70px_rgba(255,84,0,0.12)]"
            >
              <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                <div className="relative min-h-[260px] overflow-hidden rounded-[22px] border border-neutral-200 bg-neutral-950">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.title} preview`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-col p-1 lg:py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ff5400]">
                    Case study
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-black sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-neutral-600">
                    {item.summary}
                  </p>

                  <div className="mt-6 border-l-2 border-[#ff5400] pl-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff5400]">
                      Outcome
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-7 text-black">
                      {item.outcome}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-bold text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-black text-[#ff5400] hover:gap-3 hover:text-black"
                  >
                    Open live project
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
