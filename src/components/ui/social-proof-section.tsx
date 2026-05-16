import { stats, testimonials } from "@/lib/site-data";

export function SocialProofSection() {
  const featuredTestimonials = testimonials.slice(0, 2);
  const featuredCompanies = testimonials.map((item) => item.company);

  return (
    <section className="page-section pt-4">
      <div className="overflow-hidden rounded-[3.25rem] border border-black/10 bg-[#f4ede3] shadow-[0_28px_90px_rgba(0,0,0,0.08)]">
        <div className="grid gap-10 p-8 sm:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-14 xl:p-14">
          <div>
            <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-black/55">
              Social Proof
            </span>
            <h2 className="mt-6 font-display text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-black sm:text-5xl xl:text-[4.25rem]">
              Trusted by teams that care about sharp delivery and real outcomes.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-black/60 sm:text-lg">
              We keep the process lean, the communication clear, and the final product strong enough to
              support growth after launch.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {featuredCompanies.map((company) => (
                <span
                  key={company}
                  className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-black/45"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]"
              >
                <p className="font-display text-5xl font-black uppercase tracking-[-0.05em] text-black sm:text-6xl">
                  {item.value}
                  {item.suffix ?? ""}
                </p>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-black/38">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="border-t border-black/10 bg-white/55 px-8 py-8 sm:px-10 xl:px-14 xl:py-10">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1fr_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-black px-6 py-7 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50">What clients feel</p>
              <p className="mt-4 font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                Calm process.
                <br />
                Confident launch.
              </p>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Our goal is simple: make the work look premium, feel smooth, and stay useful long after go-live.
              </p>
            </div>

            {featuredTestimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]"
              >
                <p className="text-sm tracking-[0.2em] text-[#ff5400]">
                  {Array.from({ length: testimonial.stars }, () => "★").join(" ")}
                </p>
                <p className="mt-5 text-base leading-7 text-black/72">“{testimonial.review}”</p>
                <div className="mt-6 border-t border-black/8 pt-4">
                  <p className="font-display text-xl font-black uppercase tracking-[-0.03em] text-black">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-black/38">
                    {testimonial.company}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
