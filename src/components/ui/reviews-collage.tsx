import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

type ReviewsCollageProps = {
  reviews: Testimonial[];
};

type ReviewLayout = {
  className: string;
  cardClassName: string;
  shape: string;
  compact?: boolean;
};

const layouts: ReviewLayout[] = [
  {
    className: "lg:col-start-1 lg:row-start-1 lg:mt-12 lg:w-[230px] lg:-rotate-2 lg:justify-self-start",
    cardClassName: "min-h-[170px] px-6 py-6",
    shape: "1.4rem 4rem 1.4rem 1.4rem",
  },
  {
    className: "lg:col-start-2 lg:row-start-1 lg:mt-0 lg:w-[260px] lg:rotate-1 lg:justify-self-center",
    cardClassName: "min-h-[185px] px-7 py-7",
    shape: "1rem 1rem 3.8rem 1rem",
  },
  {
    className: "lg:col-start-3 lg:row-start-1 lg:mt-16 lg:w-[230px] lg:-rotate-1 lg:justify-self-end",
    cardClassName: "min-h-[170px] px-6 py-6",
    shape: "1.3rem 2.8rem 2.8rem 1.3rem",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-black" aria-label={`${count} star review`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-3 w-3 fill-current" aria-hidden="true" />
      ))}
    </div>
  );
}

function ReviewBubble({
  review,
  layout,
}: {
  review: Testimonial;
  layout: ReviewLayout;
}) {
  const starClassName = layout.compact ? "mt-3" : "mt-auto pt-3";

  return (
    <article className={`relative ${layout.className}`}>
      <div
        className={`relative flex flex-col overflow-visible border border-black/5 bg-white shadow-[0_18px_42px_rgba(0,0,0,0.08)] ${layout.cardClassName}`}
        style={{ borderRadius: layout.shape }}
      >
        <Quote
          className={`absolute text-black ${
            layout.compact ? "right-5 top-4 h-7 w-7" : "right-5 top-5 h-8 w-8"
          }`}
          fill="currentColor"
          aria-hidden="true"
        />
        <div className={layout.compact ? "max-w-[122px]" : "max-w-[170px]"}>
          <h3 className="text-[13px] font-black uppercase leading-tight text-black">{review.name}</h3>
          {review.company ? (
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-black/40">
              {review.company}
            </p>
          ) : null}
          <p
            className={`mt-3 font-medium text-black/55 ${
              layout.compact ? "text-[9px] leading-4" : "text-[10px] leading-5"
            }`}
          >
            {review.review}
          </p>
        </div>

        <div className={starClassName}>
          <Stars count={review.stars} />
        </div>
      </div>
    </article>
  );
}

export function ReviewsCollage({ reviews }: ReviewsCollageProps) {
  const visibleReviews = reviews.slice(0, layouts.length);

  if (visibleReviews.length === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      className="relative z-[45] scroll-mt-48 overflow-hidden bg-white px-4 pb-20 pt-32 text-black sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff5400]">
              Reviews
            </span>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal text-black sm:text-5xl">
              What clients say
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-black/50 sm:text-base">
              Real feedback from teams that needed better websites, apps, automation, and clearer digital delivery.
            </p>
          </div>

          <div className="hidden rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black/55 shadow-sm md:inline-flex">
            5-star client feedback
          </div>
        </div>

        <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-x-24 lg:gap-y-14">
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/65 lg:block" />
          {visibleReviews.map((review, index) => {
            const layout = layouts[index];

            if (!layout) {
              return null;
            }

            return (
              <ReviewBubble
                key={`${review.name}-${review.company}`}
                review={review}
                layout={layout}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
