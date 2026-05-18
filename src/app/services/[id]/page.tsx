import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { services, getService, portfolioItems } from "@/lib/site-data";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
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
    <>
      <section className="page-section relative overflow-hidden pt-12 sm:pt-16">
        {/* Ambient signature orange gradient glow */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.08] z-0 blur-[140px]" 
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

          <div className="panel rounded-[2.5rem] p-8 sm:p-14 border border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl">
            <span className="eyebrow text-[#ff5400] font-black">Service Overview</span>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-none">
              {service.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-[rgba(233,238,242,0.8)] max-w-3xl">
              {service.description}
            </p>

            <div className="mt-12 pt-12 border-t border-white/10">
              <h2 className="font-display text-2xl font-bold text-white mb-8 uppercase tracking-wide">
                What We Deliver
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-6 h-6 text-[#ff5400] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg text-white">{item}</h3>
                      <p className="mt-1 text-sm text-[rgba(233,238,242,0.6)]">
                        High-fidelity execution, rigorous testing, and seamless integration tailored for your business goals.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <article key={item.slug} className="panel rounded-[2rem] p-8 flex flex-col justify-between border border-white/10 bg-[rgba(255,255,255,0.02)] hover:border-white/20 transition-all">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#ff5400]">{item.category}</span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm text-[rgba(233,238,242,0.7)] leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outcome</span>
                      <p className="text-sm font-semibold text-[#99f6e4] mt-0.5">{item.outcome}</p>
                    </div>
                    <Link
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white hover:text-[#ff5400] transition-colors"
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
        <div className="mx-auto max-w-5xl rounded-[3rem] border-4 border-black bg-white p-12 sm:p-16 relative overflow-hidden group">
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
    </>
  );
}
