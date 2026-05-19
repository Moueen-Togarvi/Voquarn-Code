import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { team } from "@/lib/site-data";
import { Globe, Share2, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
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
        <SectionHeading
          eyebrow="Our Team"
          title="Disciplined execution by specialized experts"
          description="We keep our team lean, senior, and highly focused. Every project is led by practitioners who actually build the architecture, write the code, and design the workflows."
        />

        {/* Team Members Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <article
              key={member.name}
              className="group relative flex flex-col justify-between rounded-[2.5rem] border border-neutral-200 bg-white p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                {/* Avatar Placeholder / Initial */}
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 text-white font-display font-black text-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-105 transition-transform duration-300">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <h3 className="font-display text-2xl font-bold text-neutral-900 tracking-tight">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-black uppercase tracking-wider text-[#ff5400]">
                  {member.role}
                </p>
                <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>

              {/* Social Links & Decorative Divider */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-neutral-400">
                  <a href="#" className="hover:text-black transition-colors"><Globe className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-black transition-colors"><Share2 className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-black transition-colors"><ExternalLink className="w-4 h-4" /></a>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest group-hover:text-[#ff5400] transition-colors">
                  Core Lead
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Amazing Interactive Call to Action */}
      <section className="page-section pt-12">
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5400]" /> Join Voquarn Code
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Want to build elite digital systems with us?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              We are always looking for exceptional AI engineers, Next.js developers, and UI/UX directors who value discipline over corporate bureaucracy.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <Link
              href="/careers"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>Explore Open Roles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
