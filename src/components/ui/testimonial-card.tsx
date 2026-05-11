import type { Testimonial } from "@/lib/site-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="panel rounded-[1.75rem] p-6">
      <div className="text-[#fcd34d]">{Array.from({ length: testimonial.stars }, () => "★").join(" ")}</div>
      <p className="mt-5 text-lg leading-8 text-white">“{testimonial.review}”</p>
      <div className="mt-6">
        <p className="font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm text-[rgba(233,238,242,0.62)]">{testimonial.company}</p>
      </div>
    </article>
  );
}
