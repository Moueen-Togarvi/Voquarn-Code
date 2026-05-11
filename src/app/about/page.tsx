import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { team, values } from "@/lib/site-data";

export const metadata = buildMetadata(
  "About Voquarn Code",
  "Learn the Voquarn Code story, meet the team, and see the mission, vision, and values behind our work.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <section className="page-section">
        <SectionHeading
          eyebrow="About"
          title="A studio built for businesses that need clearer digital momentum"
          description="Voquarn Code exists to close the gap between good ideas and disciplined execution. We partner with teams that want their digital presence to feel as credible as the service behind it."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel rounded-[2rem] p-8">
            <h3 className="font-display text-2xl text-white">Our story</h3>
            <div className="mt-5 space-y-4 text-[rgba(233,238,242,0.74)]">
              <p>Voquarn started from a simple frustration: too many businesses were buying websites and digital services that looked busy but did very little to support trust, clarity, or lead flow.</p>
              <p>We built the studio around tighter collaboration across design, development, SEO, and operations so each project could behave like a real business asset instead of a disconnected deliverable.</p>
              <p>That means fewer handoff problems, faster decision-making, and a stronger line between what we ship and the outcomes clients actually care about.</p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="panel rounded-[2rem] p-8">
              <h3 className="font-display text-2xl text-white">Mission</h3>
              <p className="mt-4 text-[rgba(233,238,242,0.74)]">
                Build digital systems that make businesses easier to trust, easier to buy from, and easier to scale.
              </p>
            </div>
            <div className="panel rounded-[2rem] p-8">
              <h3 className="font-display text-2xl text-white">Vision</h3>
              <p className="mt-4 text-[rgba(233,238,242,0.74)]">
                Become a go-to execution partner for growth-minded brands across Pakistan and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Team"
          title="A compact team with complementary strengths"
          description="We keep communication direct and the working team close to the project."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          {team.map((member) => (
            <article key={member.name} className="panel rounded-[1.75rem] p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f59e0b]/12 font-display text-xl font-semibold text-[#fde68a]">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h3 className="mt-5 font-display text-2xl text-white">{member.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#99f6e4]">{member.role}</p>
              <p className="mt-4 text-[rgba(233,238,242,0.72)]">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          eyebrow="Values"
          title="How we like to work"
          description="These principles shape the way we scope, communicate, and ship."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <div key={value} className="panel rounded-[1.5rem] p-6 text-lg text-white">
              {value}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
