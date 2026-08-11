import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRight, Globe, Smartphone, Bot, Code2, Layers, MessageCircle, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { serviceJsonLd } from "@/lib/schema";
import { getServices, getService, getPortfolioItems, getSiteSettings } from "@/lib/data";
import type { PortfolioItem } from "@/lib/site-data";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Helper to map categories and item IDs to elegant Lucide icons matching services
const getPricingIcon = (categoryName: string, id: string) => {
  if (categoryName.toLowerCase().includes("web")) {
    return <Globe className="w-5 h-5 text-white" />;
  }
  if (categoryName.toLowerCase().includes("ai")) {
    return <Bot className="w-5 h-5 text-white" />;
  }
  if (id.toLowerCase().includes("saas")) {
    return <Code2 className="w-5 h-5 text-white" />;
  }
  if (categoryName.toLowerCase().includes("app")) {
    return <Smartphone className="w-5 h-5 text-white" />;
  }
  return <Layers className="w-5 h-5 text-white" />;
};

// Matches the "Best for SaaS" / "Most Popular" badges used in pricing-toggle.tsx
// and services-toggle.tsx, so the same packages are called out consistently.
const featuredSubServiceIds = new Set(["ecommerce-web", "saas-web", "saas-app", "full-saas", "ai-agents"]);

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return buildMetadata("Service not found", "The requested service could not be found.", "/services");
  }

  return buildMetadata(
    `${service.title} Services | Voquarn Code`,
    `${service.description} See deliverables, sub-services, and related work from Voquarn Code.`,
    `/services/${service.id}`,
    {
      keywords: [
        `${service.title} services`,
        `${service.title} agency`,
        `Voquarn Code ${service.title}`,
      ],
    },
  );
}

// Match portfolio items to a service by comparing keywords in the service title
// against portfolio categories, since services are admin-managed and don't carry
// a fixed foreign key to portfolio categories.
function getRelatedWork(serviceTitle: string, portfolioItems: PortfolioItem[]) {
  const title = serviceTitle.toLowerCase();
  const keywordToCategory: [string, PortfolioItem["category"]][] = [
    ["ai", "AI Solutions"],
    ["seo", "SEO"],
    ["design", "Graphic Design"],
    ["app", "App Development"],
    ["web", "Web Development"],
  ];

  for (const [keyword, category] of keywordToCategory) {
    if (title.includes(keyword)) {
      const matches = portfolioItems.filter((item) => item.category === category);
      if (matches.length > 0) return matches;
    }
  }

  return portfolioItems.slice(0, 2);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const [service, portfolioItems, site] = await Promise.all([
    getService(id),
    getPortfolioItems(),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const relatedWork = getRelatedWork(service.title, portfolioItems);

  return (
    <div className="relative bg-white text-black min-h-screen pt-40 lg:pt-48">
      <PageStructuredData
        path={`/services/${service.id}`}
        name={`${service.title} Services | Voquarn Code`}
        description={service.description}
        type="WebPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.id}` },
        ]}
      />
      <JsonLd data={serviceJsonLd(service)} />
      <section className="page-section relative overflow-hidden mt-24 lg:mt-32 pt-40 lg:pt-56">
        {/* Ambient signature orange gradient glow in background */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.05] z-0 blur-[140px]" 
          style={{
            background: "radial-gradient(circle, #ff5400 0%, transparent 70%)"
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#ff5400] hover:text-[#ff5400]/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all services
          </Link>

          <div className="panel rounded-[2.5rem] p-8 sm:p-14 border border-neutral-200 bg-white shadow-xl relative z-10">
            <span className="eyebrow text-[#ff5400] font-black">Service Overview</span>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-neutral-900 sm:text-6xl uppercase leading-none">
              {service.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 max-w-3xl font-medium">
              {service.description}
            </p>

            {/* Deliverables */}
            <div className="mt-12 pt-12 border-t border-neutral-200">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-8 uppercase tracking-wide">
                What We Deliver
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#ff5400] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900">{item}</h3>
                      <p className="mt-1.5 text-xs text-neutral-500 font-medium leading-relaxed">
                        High-fidelity execution, rigorous testing, and seamless integration tailored for your business goals.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-services / Sub-types breakdown */}
            {service.subServices && service.subServices.length > 0 && (
              <div className="mt-16 pt-16 border-t border-neutral-200">
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-8 uppercase tracking-wide">
                  Available Sub-types
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {service.subServices.map((sub) => {
                    const featured = featuredSubServiceIds.has(sub.id);
                    return (
                    <article
                      key={sub.id}
                      className="group relative flex flex-col justify-between rounded-[32px] border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
                    >
                      {featured && (
                        <div className="absolute -right-11 top-6 w-40 rotate-45 bg-[#ff5400] py-1.5 shadow-[0_4px_12px_rgba(255,84,0,0.35)] z-20">
                          <span className="flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider text-white">
                            <Star className="w-2.5 h-2.5 fill-white" /> Best Choice
                          </span>
                        </div>
                      )}

                      <div className="relative z-10 flex flex-col h-full justify-between">

                        {/* ── Top Row: Icon & Starting Price ── */}
                        <div className="flex items-start justify-between">
                          <div className="w-[46px] h-[46px] rounded-[14px] bg-[#ff5400] flex items-center justify-center shadow-[0_4px_12px_rgba(255,84,0,0.25)] group-hover:scale-105 transition-transform duration-300">
                            {getPricingIcon(service.title, sub.id)}
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-neutral-400">from</p>
                            <p className="text-sm font-bold text-neutral-900">
                              PKR <span className="text-[#ff5400]">{sub.pricePkr.toLocaleString()}</span>
                            </p>
                          </div>
                        </div>

                        {/* ── Middle Section: Category, Title, Checklist ── */}
                        <div className="mt-6 flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-neutral-800">Voquarn</span>
                            <span className="text-[11px] text-neutral-400">• {service.title}</span>
                          </div>

                          <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-neutral-900 tracking-tight leading-tight truncate">
                            {sub.name}
                          </h3>

                          <div className="my-4 border-t border-neutral-200/80" />

                          <ul className="space-y-2">
                            {sub.features.slice(0, 3).map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-[12px] font-medium text-neutral-500">
                                <CheckCircle2 className="w-4 h-4 text-[#ff5400] flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ── Bottom Section: Scope Button ── */}
                        <div className="mt-6 pt-2">
                          <div className="my-4 border-t border-neutral-200/80" />

                          <WhatsAppLink
                            href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(service.title + " - " + sub.name)}%20package.`}
                            className="w-full h-12 py-3 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide bg-gradient-to-b from-[#ff6b21] to-[#e04800] hover:from-[#ff7c3b] hover:to-[#f05000] shadow-[0_8px_20px_rgba(255,84,0,0.2)]"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" /> Discuss on WhatsApp
                          </WhatsAppLink>
                        </div>

                      </div>
                    </article>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Related Work Section */}
      {relatedWork.length > 0 && (
        <section className="page-section pt-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="Proven Track Record"
              title="Relevant Case Studies"
              description="Explore recent engagements where we delivered robust solutions in this domain."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {relatedWork.map((item) => (
                <article key={item.slug} className="rounded-[2rem] p-8 flex flex-col justify-between border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg transition-all shadow-sm">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#ff5400]">{item.category}</span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-neutral-900">{item.title}</h3>
                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-medium">{item.summary}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outcome</span>
                      <p className="text-sm font-semibold text-teal-700 mt-0.5">{item.outcome}</p>
                    </div>
                    <Link
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#ff5400] transition-colors"
                    >
                      View Live <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="page-section pt-12 pb-20">
        <div className="mx-auto max-w-5xl rounded-[3rem] border-4 border-black bg-white p-12 sm:p-16 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[#ff5400] rounded-bl-[4rem] transition-transform group-hover:scale-110" />
          <span className="eyebrow text-[#ff5400] font-black">Next Steps</span>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-black sm:text-4xl leading-tight">
                READY TO ELEVATE YOUR DIGITAL CAPABILITIES WITH {service.title}?
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-[#ff5400] px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:scale-105 transition-all active:scale-95 shadow-xl flex-shrink-0"
            >
              Start Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
