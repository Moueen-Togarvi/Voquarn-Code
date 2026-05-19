import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-data";
import { Sparkles, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Send } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata(
  "Careers | Voquarn Code",
  "Explore open engineering, design, and growth roles at Voquarn Code.",
  "/careers",
);

const openRoles = [
  {
    title: "Senior Next.js & AI Engineer",
    department: "Engineering",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$80k - $120k",
    description: "Lead the architectural development of high-performance Next.js web applications and autonomous AI agent workflows for our global enterprise clients.",
    tags: ["Next.js 15", "React", "TypeScript", "Python", "AI LLMs"]
  },
  {
    title: "UI/UX Design Director",
    department: "Design",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Shape the visual direction, design systems, and conversion-optimized user experiences across all Voquarn Code products and marketing surfaces.",
    tags: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS"]
  },
  {
    title: "Growth & Technical SEO Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $90k",
    description: "Drive organic acquisition strategies, technical site audits, schema architectures, and high-intent funnel optimizations for fast-growing brands.",
    tags: ["Technical SEO", "Ahrefs", "Google Analytics", "Conversion Rate"]
  },
  {
    title: "Full Stack Supabase Architect",
    department: "Engineering",
    location: "Remote",
    type: "Contract / Full-time",
    salary: "$75k - $110k",
    description: "Design secure multi-tenant database schemas, row-level security policies, and real-time backend integrations for our custom SaaS platforms.",
    tags: ["Supabase", "PostgreSQL", "Node.js", "Edge Functions"]
  }
];

const perks = [
  { title: "Work Anywhere", description: "Complete remote freedom or join us in our modern Lahore hub." },
  { title: "Competitive Compensation", description: "Top-tier salary packages pegged to USD value with performance bonuses." },
  { title: "Latest Hardware", description: "M3 Max MacBooks and premium 4K displays provided to all core leads." },
  { title: "Zero Bureaucracy", description: "No micromanagement or useless daily standups. We judge purely on output." }
];

export default function CareersPage() {
  return (
    <>
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56">
        <SectionHeading
          eyebrow="Careers"
          title="Build elite digital systems without corporate bureaucracy"
          description="We are looking for elite practitioners who take immense pride in their craft. No endless meetings, no office politics—just disciplined execution and high-impact shipping."
        />

        {/* Perks Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk, index) => (
            <div key={perk.title} className="bg-white border border-neutral-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#ff5400]/10 flex items-center justify-center text-[#ff5400] mb-6 font-display font-black text-lg">
                0{index + 1}
              </div>
              <h4 className="font-display text-xl font-bold text-neutral-900 tracking-tight mb-2">{perk.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">{perk.description}</p>
            </div>
          ))}
        </div>

        {/* Open Roles Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-12">
            <div>
              <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">Open Positions</h3>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">4 Active Roles Available</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#ff5400]/10 border border-[#ff5400]/20 px-4 py-2 rounded-full text-[#ff5400] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Fast 48-Hour Interview Process
            </div>
          </div>

          <div className="space-y-6">
            {openRoles.map((role) => (
              <article 
                key={role.title} 
                className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 sm:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#ff5400] bg-[#ff5400]/10 px-3 py-1 rounded-full border border-[#ff5400]/20">{role.department}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {role.location}</span>
                    <span className="text-neutral-600 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-400" /> {role.type}</span>
                    <span className="text-neutral-900 font-extrabold flex items-center gap-0.5 bg-neutral-100 px-3 py-1 rounded-full"><DollarSign className="w-3.5 h-3.5 text-[#ff5400]" /> {role.salary}</span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">{role.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">{role.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.tags.map((t) => (
                      <span key={t} className="bg-neutral-100 text-neutral-700 text-[10px] font-bold px-3 py-1 rounded-full border border-neutral-200/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <a
                    href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20am%20applying%20for%20the%20${encodeURIComponent(role.title)}%20role.%20Here%20is%20my%20portfolio/LinkedIn:`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#ff5400] shadow-md hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Send className="w-4 h-4" /> <span>Apply via WhatsApp</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Amazing Interactive Call to Action */}
      <section className="page-section pt-16">
        <div className="rounded-[2.5rem] border border-neutral-900 bg-neutral-900 p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff5400]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Briefcase className="w-3.5 h-3.5 text-[#ff5400]" /> Spontaneous Application
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Don&apos;t see your exact role listed above?
            </h2>
            <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              We always make room for world-class talent. Send us your GitHub, Figma portfolio, or past project links directly. If your work is exceptional, we will create a role for you.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-shrink-0">
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hi%20Voquarn%20Code,%20I%20want%20to%20submit%20a%20spontaneous%20application.%20Here%20is%20my%20work:`}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5400] px-8 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#e04800] shadow-xl transition-all hover:scale-105"
            >
              <span>Send Portfolio Directly</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
