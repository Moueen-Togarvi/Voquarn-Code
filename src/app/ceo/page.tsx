import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";
import { Globe, Share2, ExternalLink, Sparkles, MessageCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata(
  "Our CEO | Voquarn Code",
  "Meet Moueen Togarvi, Founder and CEO of Voquarn Code.",
  "/ceo",
);

export default function CeoPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Our CEO"
          title="Engineering Leadership & Strategic Vision"
          description="Moueen Togarvi leads Voquarn Code with a singular focus: building high-performance, AI-integrated digital systems that drive measurable business outcomes without corporate bloat."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: CEO Profile Card */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5400]/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Avatar / Monogram */}
            <div className="w-28 h-28 rounded-[2rem] bg-neutral-900 text-white font-display font-black text-4xl flex items-center justify-center shadow-lg mb-8">
              MT
            </div>

            <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">
              Moueen Togarvi
            </h3>
            <p className="mt-1.5 text-xs font-black uppercase tracking-widest text-[#ff5400]">
              Founder & Chief Executive Officer
            </p>
            <p className="mt-6 text-sm text-neutral-600 leading-relaxed font-medium">
              Moueen combines deep technical engineering expertise with strategic product vision. He oversees the core architecture, AI workflow integrations, and deployment standards across all client engagements at Voquarn Code.
            </p>

            <div className="mt-8 pt-8 border-t border-neutral-100 space-y-4">
              <a
                href={`https://wa.me/${site.whatsapp}?text=Hi%20Moueen,%20I%20would%20like%20to%20discuss%20a%20strategic%20project%20with%20Voquarn%20Code.`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" /> Message CEO on WhatsApp
              </a>

              <div className="flex items-center justify-center gap-6 pt-4 text-neutral-400">
                <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors flex items-center gap-1.5 text-xs font-bold">
                  <Globe className="w-4 h-4" /> LinkedIn Profile
                </a>
                <a href="#" className="hover:text-black transition-colors flex items-center gap-1.5 text-xs font-bold">
                  <ExternalLink className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: CEO Philosophy & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400]">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight">Velocity Over Bureaucracy</h4>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                "We believe that lengthy meetings and corporate ceremony destroy product momentum. We keep our feedback loops instant, our documentation crisp, and our focus entirely on shipping high-converting software."
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight">AI-First Engineering Standards</h4>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                "Artificial Intelligence is not a gimmick to be tacked onto a website. We build autonomous lead scoring, automated triage, and smart workflows directly into the foundational Next.js and Supabase architecture."
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight">Uncompromising Digital Credibility</h4>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                "Your website is your ultimate digital storefront. If it looks generic or loads slowly, you lose high-intent buyers instantly. We ensure every pixel we deploy reflects absolute industry leadership."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Amazing Interactive Call to Action */}
      <section className="page-section pt-12">
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5400]" /> Direct Partnership
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to scope your project directly with our CEO?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              Bypass sales reps entirely. Discuss your architecture, timelines, and growth objectives directly with Moueen Togarvi.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <Link
              href="/contact"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>Book Strategy Call</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
