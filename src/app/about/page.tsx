import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { team, values } from "@/lib/site-data";
import { ArrowUpRight, Sparkles, Target, Zap, Rocket } from "lucide-react";

export const metadata = buildMetadata(
  "About Voquarn Code",
  "Learn the Voquarn Code story, meet the team, and see the mission, vision, and values behind our work.",
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
      {/* Hero Section */}
      <section className="page-section pt-36 lg:pt-40 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col justify-center">
            <SectionHeading
              eyebrow="About Us"
              title="A studio built for businesses that need clearer digital momentum"
              description="Voquarn Code exists to close the gap between good ideas and disciplined execution. We partner with teams that want their digital presence to feel as credible as the service behind it."
            />
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-4">
                {avatarUrls.map((url, i) => (
                  <div key={i} className="w-11 h-11 rounded-full border-2 border-white bg-panel overflow-hidden relative shadow-sm">
                    <Image 
                      src={url} 
                      alt="Team member" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-black/60 font-medium">
                Backed by a team of <span className="text-black font-bold">creative experts</span>
              </p>
            </div>
          </div>
          
          {/* Pinterest-style Staggered Image Grid */}
          <div className="grid grid-cols-2 gap-3 h-[400px] lg:h-[480px]">
             <div className="flex flex-col gap-3 pt-6">
                <div className="relative h-[60%] rounded-3xl overflow-hidden shadow-md group">
                   <Image 
                     src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                     alt="Team collaborating" 
                     fill 
                     className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative h-[40%] rounded-3xl overflow-hidden shadow-md group">
                   <Image 
                     src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                     alt="Data dashboard" 
                     fill 
                     className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
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
                   <Image 
                     src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                     alt="Strategy planning" 
                     fill 
                     className="object-cover hover:scale-110 transition-transform duration-1000 ease-out" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Story & Mission (Bento Grid) */}
      <section className="page-section py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[240px]">
          {/* Story Card (Spans 2 cols, 2 rows) */}
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

          {/* Mission Card */}
          <div className="panel rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center text-[#14b8a6] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xs">
               <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-black mb-2">Mission</h3>
              <p className="text-black/60 text-sm font-medium leading-relaxed">
                Build digital systems that make businesses easier to trust, easier to buy from, and easier to scale.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="panel rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5400]/10 border border-[#ff5400]/20 flex items-center justify-center text-[#ff5400] mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xs">
               <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-black mb-2">Vision</h3>
              <p className="text-black/60 text-sm font-medium leading-relaxed">
                Become a go-to execution partner for growth-minded brands across Pakistan and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Pinterest Masonry Style) */}
      <section className="page-section py-10">
        <SectionHeading
          eyebrow="Our People"
          title="A compact team with complementary strengths"
          description="We keep communication direct and the working team close to the project. No bloated management layers."
        />
        <div className="mt-10 columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {team.map((member, i) => {
             const images = [
                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2000&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop"  
             ];
             const heightClass = i % 2 === 0 ? "h-[380px]" : "h-[320px]"; 
             
             return (
               <article key={member.name} className="break-inside-avoid relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500 border border-black/5">
                 <div className={`w-full ${heightClass} relative`}>
                    <Image 
                      src={images[i % images.length]} 
                      alt={member.name} 
                      fill 
                      className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                 </div>
                 
                 <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 border border-white/30">
                   <ArrowUpRight className="w-5 h-5 text-white" />
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="inline-block px-3 py-1 rounded-full bg-[#ff5400]/20 border border-[#ff5400]/30 backdrop-blur-md mb-3">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffbd99]">{member.role}</p>
                   </div>
                   <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white mb-2">{member.name}</h3>
                   <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">{member.bio}</p>
                 </div>
               </article>
             );
          })}
        </div>
      </section>

      {/* Values Section */}
      <section className="page-section pb-20 pt-6">
        <SectionHeading
          eyebrow="Core Values"
          title="How we like to work"
          description="These principles shape the way we scope, communicate, and ship."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>
    </>
  );
}

