import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

type ReviewsCollageProps = {
  reviews: Testimonial[];
};

type ReviewLayout = {
  className: string;
  cardClassName: string;
  shape: string;
};

const layouts: ReviewLayout[] = [
  {
    className: "lg:col-start-1 lg:row-start-1 lg:mt-8 lg:w-[280px] lg:-rotate-2 lg:justify-self-center",
    cardClassName: "min-h-[220px] px-7 py-7",
    shape: "1.4rem 4rem 1.4rem 1.4rem",
  },
  {
    className: "lg:col-start-2 lg:row-start-1 lg:mt-0 lg:w-[300px] lg:rotate-1 lg:justify-self-center",
    cardClassName: "min-h-[240px] px-8 py-8",
    shape: "1rem 1rem 3.8rem 1rem",
  },
  {
    className: "lg:col-start-3 lg:row-start-1 lg:mt-12 lg:w-[280px] lg:-rotate-1 lg:justify-self-center",
    cardClassName: "min-h-[220px] px-7 py-7",
    shape: "1.3rem 2.8rem 2.8rem 1.3rem",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[var(--foreground)]" aria-label={`${count} star review`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["bg-[#ff5400]", "bg-[#14b8a6]", "bg-[#f59e0b]"];

function ReviewBubble({
  review,
  layout,
  index,
}: {
  review: Testimonial;
  layout: ReviewLayout;
  index: number;
}) {
  return (
    <article className={`relative ${layout.className}`}>
      <div
        className={`relative flex flex-col overflow-visible border border-[var(--border)] bg-[var(--panel)] shadow-[0_18px_42px_rgba(0,0,0,0.08)] ${layout.cardClassName}`}
        style={{ borderRadius: layout.shape }}
      >
        <Quote
          className="absolute text-[var(--muted)] right-5 top-5 h-8 w-8 opacity-15"
          fill="currentColor"
          aria-hidden="true"
        />

        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[index % 3]} flex items-center justify-center text-white text-[13px] font-bold`}>
            {getInitials(review.name)}
          </div>
          <div>
            <h3 className="text-[14px] font-black uppercase leading-tight text-[var(--foreground)]">{review.name}</h3>
            {review.company ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                {review.company}
              </p>
            ) : (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)] opacity-60">
                via Google
              </span>
            )}
          </div>
        </div>

        <p className="text-[14px] font-medium leading-6 text-[var(--foreground)] opacity-70 mb-3">
          &ldquo;{review.review}&rdquo;
        </p>

        <div className="mt-auto pt-2">
          <Stars count={review.stars} />
        </div>
      </div>
    </article>
  );
}

export function ReviewsCollage({ reviews }: ReviewsCollageProps) {
  const visibleReviews = reviews.slice(0, layouts.length);

  if (visibleReviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative z-[45] scroll-mt-48 overflow-hidden bg-[var(--background)] px-4 pb-20 pt-32 text-[var(--foreground)] sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#ff5400]">
              Reviews
            </span>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal text-[var(--foreground)] sm:text-5xl">
              What clients say
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[var(--muted)] sm:text-base">
              Real feedback from teams that needed better websites, apps, automation, and clearer digital delivery.
            </p>
          </div>

          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-[var(--muted)] shadow-sm md:inline-flex">
            5-star client feedback
          </div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-[1000px] gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-x-8 lg:gap-y-14">
          {visibleReviews.map((review, index) => {
            const layout = layouts[index];
            if (!layout) return null;
            return (
              <ReviewBubble
                key={`${review.name}-${review.company}`}
                review={review}
                layout={layout}
                index={index}
              />
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#reviews"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all"
          >
            Read more reviews
          </a>
          <a
            href="https://g.page/r/your-google-review-link"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff5400] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:scale-105 transition-all shadow-md"
          >
            Leave a review
          </a>
        </div>
      </div>
    </section>
  );
}
