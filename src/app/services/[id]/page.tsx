import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRight, Globe, Smartphone, Bot, Code2, Layers, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { services, getService, portfolioItems, site } from "@/lib/site-data";

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

export async function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = getService(id);

  if (!service) {
    return buildMetadata("Service not found", "The requested service could not be found.", "/services");
  }

  return buildMetadata(`${service.title} | Voquarn Code`, service.description, `/services/${service.id}`);
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const service = getService(id);

  if (!service) {
    notFound();
  }

  // Helper to match portfolio items to service
  const getRelatedWork = (serviceId: string) => {
    switch (serviceId) {
      case "web-dev":
        return portfolioItems.filter((item) => item.category === "Web Development");
      case "app-dev":
        return portfolioItems.filter((item) => item.category === "App Development");
      case "saas-apps":
        return portfolioItems.filter((item) => item.category === "Web Development" || item.category === "AI Solutions").slice(0, 2);
      case "ai-workflows":
        return portfolioItems.filter((item) => item.category === "AI Solutions");
      default:
        return portfolioItems.slice(0, 2);
    }
  };

  const relatedWork = getRelatedWork(service.id);

  return (
    <div className="relative bg-white text-black min-h-screen pt-40 lg:pt-48">
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
                  {service.subServices.map((sub) => (
                    <article 
                      key={sub.id} 
                      className="group relative flex flex-col justify-between rounded-[32px] border border-neutral-200/80 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] h-full min-h-[380px]"
                    >
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        
                        {/* ── Top Row: App Icon & Tagline ── */}
                        <div className="flex items-center">
                          {/* Rounded Dark Square App Icon */}
                          <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1a1a1a] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300">
                            {getPricingIcon(service.title, sub.id)}
                          </div>
                        </div>

                        {/* ── Middle Section: Category, Title, Short Desc & Tags ── */}
                        <div className="mt-6 flex-1 flex flex-col justify-center">
                          {/* Category & Tagline */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-neutral-800">Voquarn</span>
                            <span className="text-[11px] text-neutral-400">• {service.title}</span>
                          </div>

                          {/* Main Title */}
                          <h3 className="mt-1.5 text-base sm:text-[18px] font-bold text-neutral-900 tracking-tight leading-tight truncate">
                            {sub.name}
                          </h3>

                          {/* Short Description */}
                          <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2 leading-relaxed min-h-[32px]">
                            {sub.description}
                          </p>

                          {/* Feature Tags (Soft Gray Pill Style - Compact Size) */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {sub.features.slice(0, 3).map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-semibold tracking-wide text-neutral-600"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* ── Bottom Section: Scope Button ── */}
                        <div className="mt-6 pt-2">
                          {/* Horizontal Divider */}
                          <div className="my-4 border-t border-neutral-200/80" />

                          {/* Spectacular 3D Glossy Black Button */}
                          <a
                            href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20discuss%20the%20${encodeURIComponent(service.title + " - " + sub.name)}%20package.`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-12 py-3 rounded-full text-white font-medium text-[13px] flex items-center justify-center transition-all duration-300 active:scale-[0.98] cursor-pointer tracking-wide bg-gradient-to-b from-[#2c2c2e] to-[#151516] hover:from-[#3a3a3c] hover:to-[#1c1c1e] shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_2px_1px_rgba(255,255,255,0.2)]"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" /> Discuss on WhatsApp
                          </a>
                        </div>

                      </div>
                    </article>
                  ))}
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
