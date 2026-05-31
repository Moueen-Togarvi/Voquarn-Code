import Image from "next/image";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { values } from "@/lib/site-data";
import { Sparkles, Target, Zap, Rocket } from "lucide-react";
import { GSAPReveal, GSAPStagger } from "@/components/ui/gsap-reveal";

const pageTitle = "About Voquarn Code | Web Development, SEO & AI Studio";
const pageDescription =
  "Learn how Voquarn Code combines web development, SEO, AI automation, product thinking, and design to build stronger digital systems for businesses.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/about",
);

const avatarUrls = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
];

export default function AboutPage() {
  return (
    <>
      <PageStructuredData path="/about" name={pageTitle} description={pageDescription} type="AboutPage" />
      {/* Hero Section */}
      <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <GSAPReveal direction="left">
            <div className="flex flex-col justify-center">
              <SectionHeading
                eyebrow="About Us"
                title="A studio built for businesses that need clearer digital momentum"
                description="Voquarn Code exists to close the gap between good ideas and disciplined execution. We partner with teams that want their digital presence to feel as credible as the service behind it."
                headingLevel="h1"
              />
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {avatarUrls.map((url, i) => (
                    <div key={i} className="w-11 h-11 rounded-full border-2 border-white bg-panel overflow-hidden relative shadow-sm">
                      <Image src={url} alt="Team member" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-black/60 font-medium">
                  Backed by a team of <span className="text-black font-bold">creative experts</span>
                </p>
              </div>
            </div>
          </GSAPReveal>

          {/* Pinterest-style Staggered Image Grid */}
          <GSAPReveal direction="right" delay={0.15}>
            <div className="grid grid-cols-2 gap-3 h-[400px] lg:h-[480px]">
              <div className="flex flex-col gap-3 pt-6">
                <div className="relative h-[60%] rounded-3xl overflow-hidden shadow-md group">
                  <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Team collaborating" fill className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative h-[40%] rounded-3xl overflow-hidden shadow-md group">
                  <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Data dashboard" fill className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <div className="flex flex-col gap-3 pb-6">
                <div className="relative h-[40%] rounded-3xl overflow-hidden shadow-md group bg-gradient-to-br from-[#ff5400] to-[#ff7a33] p-6 flex flex-col justify-end">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-white font-display text-2xl font-extrabold uppercase tracking-tight leading-tight relative z-10">Crafting<br/>Digital<br/>Excellence</h3>
                </div>
                <div className="relative h-[60%] rounded-3xl overflow-hidden shadow-md group">
                  <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" alt="Strategy planning" fill className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </GSAPReveal>
        </div>
      </section>

      {/* Story & Mission (Bento Grid) */}
      <section className="page-section py-4">
        <GSAPStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[240px]">
          <div className="md:col-span-2 md:row-span-2 panel rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group border border-black/5 hover:shadow-xl transition-all duration-500 shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
              <Zap className="w-48 h-48 text-[#ff5400]" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5400]/10 border border-[#ff5400]/20 w-fit mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#ff5400]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff5400]">Origin</span>
                </div>
                <h3 className="font-display text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-black mb-4">Our Story</h3>
              </div>
              <div className="space-y-3 text-sm lg:text-base text-black/60 max-w-2xl font-medium leading-relaxed">
                <p>Voquarn started from a simple frustration: too many businesses were buying websites and digital services that looked busy but did very little to support trust, clarity, or lead flow.</p>
                <p>We built the studio around tighter collaboration across design, development, SEO, and operations so each project could behave like a real business asset instead of a disconnected deliverable.</p>
                <p>That means fewer handoff problems, faster decision-making, and a stronger line between what we ship and the outcomes clients actually care about.</p>
              </div>
            </div>
          </div>

          <div className="panel rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center text-[#14b8a6] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-black mb-2">Mission</h3>
              <p className="text-black/60 text-sm font-medium leading-relaxed">Build digital systems that make businesses easier to trust, easier to buy from, and easier to scale.</p>
            </div>
          </div>

          <div className="panel rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5400]/10 border border-[#ff5400]/20 flex items-center justify-center text-[#ff5400] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-black mb-2">Vision</h3>
              <p className="text-black/60 text-sm font-medium leading-relaxed">Become a go-to execution partner for growth-minded brands across Pakistan and beyond.</p>
            </div>
          </div>
        </GSAPStagger>
      </section>

      {/* Values Section */}
      <section className="page-section pb-20 pt-6">
        <GSAPReveal direction="up">
          <SectionHeading
            eyebrow="Core Values"
            title="How we like to work"
            description="These principles shape the way we scope, communicate, and ship."
          />
        </GSAPReveal>
        <GSAPStagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <div key={value} className="panel rounded-[2.5rem] p-8 group hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:border-[#ff5400]/30 cursor-default flex flex-col justify-between aspect-square border border-black/5 shadow-sm">
              <div className="text-5xl font-display font-black text-black/10 group-hover:text-[#ff5400]/20 transition-colors duration-500">
                0{i + 1}
              </div>
              <h4 className="text-xl font-display font-extrabold uppercase tracking-tight text-black leading-tight group-hover:text-[#ff5400] transition-colors duration-500">
                {value}
              </h4>
            </div>
          ))}
        </GSAPStagger>
      </section>
    </>
  );
}
