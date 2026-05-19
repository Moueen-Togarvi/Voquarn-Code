import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { Globe, Share2, ExternalLink, Sparkles, ArrowRight, ShieldCheck, Mail, Cpu, Terminal, Compass, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = buildMetadata(
  "Our Team | Voquarn Code",
  "Meet the engineering, design, and growth leadership behind Voquarn Code.",
  "/team",
);

export default function TeamPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Leadership & Vision"
          title="Designed for high-impact execution"
          description="We do not hide behind layers of managers. Our founder actively designs, architects, and deploys every single system we ship."
        />

        {/* --- PINTEREST/MUSEUM STYLE CEO PORTRAIT CARD --- */}
        <div className="mt-20 max-w-4xl mx-auto">
          <article className="group bg-black text-white rounded-[2.5rem] border border-neutral-800 flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
            {/* Soft background ambient gradient glow inside card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff5400]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Left Column - High-Contrast Black & White Portrait */}
            <div className="w-full md:w-1/2 relative min-h-[380px] sm:min-h-[460px] bg-neutral-950 flex overflow-hidden">
              <Image 
                src="/profile-bw.png" 
                alt="Moueen Togarvi" 
                fill
                priority
                className="object-cover object-center grayscale contrast-[1.1] brightness-[0.95] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Subtle dark vignette overlay over portrait */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
            </div>

            {/* Border Divider (Architectural Line representation) */}
            <div className="hidden md:block w-[1px] bg-neutral-800 relative z-10" />

            {/* Right Column - Premium Clean Grid Text Layout */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between relative z-10 min-h-[420px]">
              
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
                <div className="flex items-center gap-3.5 text-neutral-500">
                  <a href="#" className="hover:text-[#ff5400] transition-colors"><Globe className="w-4 h-4 stroke-[1.5]" /></a>
                  <a href="#" className="hover:text-[#ff5400] transition-colors"><Mail className="w-4 h-4 stroke-[1.5]" /></a>
                </div>
              </div>

            </div>
          </article>
        </div>

        {/* --- HIGH-FIDELITY PINTEREST DIAGONAL RIBBON "COMING SOON" TEASER --- */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="relative rounded-[3rem] border border-neutral-200 bg-[#0f172a] p-12 sm:p-20 shadow-2xl overflow-hidden text-center min-h-[380px] sm:min-h-[460px] flex flex-col justify-center items-center">
            {/* Deep rich blue gradient radial background mirroring the user image */}
            <div className="absolute inset-0 bg-radial-gradient bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/60 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            {/* Soft top-left light leak */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Giant Poster Headline behind the ribbons */}
            <div className="relative z-10 select-none space-y-1 mb-6">
              <h4 className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-white opacity-20 uppercase leading-none">
                BUILDING
              </h4>
              <h4 className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-[#ff5400] opacity-25 uppercase leading-none">
                THE TEAM
              </h4>
            </div>

            {/* --- DIAGONAL CROSSING RIBBONS (INNOVA INDIA STYLE POSTER) --- */}
            {/* Ribbon 1: Left to Right (Downward) */}
            <div className="absolute w-[140%] h-10 sm:h-12 bg-[#eab308] border-y border-yellow-300 text-black font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center rotate-[7deg] shadow-2xl select-none z-20 overflow-hidden whitespace-nowrap">
              <div className="animate-[marquee_20s_linear_infinite] flex gap-8">
                <span>✦ TEAM COMING SOON </span>
                <span>✦ SHAPING THE FUTURE </span>
                <span>✦ TEAM COMING SOON </span>
                <span>✦ SHAPING THE FUTURE </span>
                <span>✦ TEAM COMING SOON </span>
                <span>✦ SHAPING THE FUTURE </span>
              </div>
            </div>

            {/* Ribbon 2: Left to Right (Upward) */}
            <div className="absolute w-[140%] h-10 sm:h-12 bg-neutral-950 border-y border-neutral-800 text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center rotate-[-7deg] shadow-2xl select-none z-20 overflow-hidden whitespace-nowrap">
              <div className="animate-[marquee_20s_linear_infinite_reverse] flex gap-8">
                <span>✦ NOW WE ARE BUILDING </span>
                <span>✦ CHANGING DIGITAL BUSINESSES </span>
                <span>✦ NOW WE ARE BUILDING </span>
                <span>✦ CHANGING DIGITAL BUSINESSES </span>
                <span>✦ NOW WE ARE BUILDING </span>
                <span>✦ CHANGING DIGITAL BUSINESSES </span>
              </div>
            </div>

            {/* Poster Info Context & CTA Button */}
            <div className="relative z-30 max-w-xl mt-8 space-y-6">
              <p className="text-xs sm:text-sm text-neutral-300 font-semibold leading-relaxed max-w-md mx-auto">
                Now we are building a team to change digital businesses. We are handpicking specialized practitioners who value discipline and real growth over meeting rooms.
              </p>
              
              <div className="flex justify-center">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff5400] hover:bg-[#e04800] text-white px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                >
                  <span>Join Our Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spontaneous Careers Application CTA */}
      <section className="page-section pt-12 pb-24">
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
      </section>
    </>
  );
}
