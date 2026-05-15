import type { Testimonial } from "@/lib/site-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="panel rounded-[1.75rem] p-6">
      <div className="text-[#f59e0b]">{Array.from({ length: testimonial.stars }, () => "★").join(" ")}</div>
      <p className="mt-5 text-lg leading-8 text-foreground">“{testimonial.review}”</p>
      <div className="mt-6">
        <p className="font-semibold text-foreground">{testimonial.name}</p>
        <p className="text-sm text-muted">{testimonial.company}</p>
      </div>
    </article>
  );
}
