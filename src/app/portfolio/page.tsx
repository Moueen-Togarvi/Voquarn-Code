import { PortfolioGrid } from "@/components/ui/portfolio-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { portfolioItems } from "@/lib/site-data";

export const metadata = buildMetadata(
  "Voquarn Code Portfolio",
  "Browse case studies and live project snapshots across web development, apps, SEO, AI, and design.",
  "/portfolio",
);

export default function PortfolioPage() {
  return (
    <>
      <section className="page-section">
        <SectionHeading
          eyebrow="Portfolio"
          title="A cross-section of delivery work"
          description="Filter the work by category, scan the outcomes, and jump into live project references."
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
            <article key={item.slug} id={item.slug} className="panel rounded-[2rem] p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">{item.category}</p>
                  <h3 className="mt-3 font-display text-3xl text-white">{item.title}</h3>
                  <p className="mt-4 text-[rgba(233,238,242,0.74)]">{item.summary}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#fcd34d]">Outcome</p>
                  <p className="mt-3 text-lg text-white">{item.outcome}</p>
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex text-sm font-semibold text-[#99f6e4] hover:text-white"
                  >
                    Open live project
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
