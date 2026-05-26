import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata(
  "Our Team | Voquarn Code",
  "Meet the engineering, design, and growth leadership behind Voquarn Code.",
  "/team",
);

export default function TeamPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Leadership & Vision"
            title="Designed for high-impact execution"
            description="We do not hide behind layers of managers. Our founder actively designs, architects, and deploys every single system we ship."
          />
        </ScrollReveal>

        {/* --- PINTEREST/MUSEUM STYLE CEO PORTRAIT CARD --- */}
        <ScrollReveal delay={0.2}>
        <div className="mt-20 max-w-4xl mx-auto">
          <article className="group bg-[#111111] text-white rounded-[2.5rem] border border-neutral-800 flex flex-col overflow-hidden shadow-2xl relative">
            {/* Soft background ambient gradient glow inside card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff5400]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Premium Clean Grid Text Layout */}
            <div className="w-full p-8 sm:p-14 flex flex-col justify-between relative z-10 min-h-[300px]">
              
              {/* Top - Museum Quote */}
              <div className="space-y-4">
                <blockquote className="font-sans font-extralight text-2xl sm:text-[1.65rem] text-neutral-200 tracking-wide leading-relaxed">
                  Leadership requires a world view beyond oneself.
                </blockquote>
              </div>

              {/* Middle - Asterisk & Cliche tag */}
              <div className="my-6">
                <span className="block text-neutral-500 text-3xl font-extralight leading-none mb-1">
                  *
                </span>
                <span className="font-sans font-extralight text-[10px] text-neutral-400 tracking-[0.15em] uppercase">
                  sounds cliche but true.
                </span>
              </div>

              {/* Bottom Divider Architectural Line */}
              <div className="w-full h-[1px] bg-neutral-900 my-4" />

              {/* Bottom - Name & Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-xl sm:text-2xl text-white tracking-[0.15em] uppercase">
                    Moueen Togarvi
                  </h3>
                  <p className="text-[9px] font-extralight text-neutral-400 uppercase tracking-[0.2em] mt-2">
                    Founder & CEO / Technical Lead
                  </p>
                </div>
                <div className="flex items-center gap-4 text-neutral-500">
                  <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href={`mailto:${site.email}`} className="hover:text-white transition-colors" aria-label="Email">
                    <Mail className="w-5 h-5 stroke-[1.5]" />
                  </a>
                </div>
              </div>

            </div>
          </article>
        </div>

        {/* --- TEAM MEMBERS GRID --- */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Team Member: Abdul Rehman */}
            <div className="group bg-[#111111] rounded-[2rem] p-8 border border-neutral-800 shadow-sm hover:shadow-2xl hover:border-neutral-700 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-900 rounded-full blur-2xl group-hover:bg-[#ff5400]/10 transition-colors duration-500" />
              <div className="relative z-10">
                <h3 className="font-display font-medium text-lg text-white uppercase tracking-[0.1em] mb-1">Abdul Rehman</h3>
                <p className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-[0.2em]">Graphic Designer</p>
              </div>
              <div className="relative z-10 flex items-center gap-4 mt-8">
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Email">
                  <Mail className="w-5 h-5 stroke-[1.5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Spontaneous Careers Application CTA */}
      <section className="page-section pt-12 pb-24">
        <ScrollReveal>
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5400]" /> Open Positions
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to ship elite code with us?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-semibold">
              Browse our high-performance open roles or send a spontaneous application. We make decisions in 48 hours.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <Link
              href="/careers"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>View Open Roles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        </ScrollReveal>
      </section>
    </>
  );
}
