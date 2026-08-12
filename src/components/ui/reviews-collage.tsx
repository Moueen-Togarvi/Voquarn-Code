import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

type ReviewsCollageProps = {
  reviews: Testimonial[];
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#ff5400]" aria-label={`${count} star review`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Testimonial }) {
  const firstName = review.name.split(" ")[0];

  return (
    <article className="relative w-full max-w-[300px] shrink-0 rounded-[1.6rem] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.08)] sm:max-w-none">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-[12px] italic text-[var(--muted)]">Customer Review</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5400]/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#ff5400]">
          Verified
        </span>
      </div>

      {/* Chat-mockup media frame */}
      {review.mediaUrl ? (
        <div className="relative mt-2.5 overflow-hidden rounded-[0.85rem] border border-[var(--border)] bg-[#0b141a]">
          <div className="flex items-center gap-2 bg-[#1f2c34] px-2.5 py-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5400] text-[9px] font-bold text-white">
              {firstName.charAt(0)}
            </div>
            <span className="text-[10px] font-semibold text-white">{firstName}</span>
          </div>
          <div className="relative aspect-[16/9] w-full">
            {review.mediaType === "video" ? (
              <video
                src={review.mediaUrl}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                aria-label={`Video testimonial from ${review.name}`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.mediaUrl}
                alt={`Photo from ${review.name}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2.5 flex items-center gap-3 rounded-[0.85rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff5400] text-sm font-black text-white">
            {firstName.charAt(0)}
          </div>
          <p className="line-clamp-2 text-[12px] font-semibold leading-5 text-[var(--foreground)] opacity-80">
            &ldquo;{review.review}&rdquo;
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-display text-[11px] font-black uppercase leading-tight text-[var(--foreground)]">
          Real Words. Real Happiness.
        </p>
        <Stars count={review.stars} />
      </div>

      {review.mediaUrl && (
        <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-4 text-[var(--muted)]">
          &ldquo;{review.review}&rdquo;
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 rounded-[0.85rem] bg-[#ff5400]/10 px-3 py-2">
        <p className="font-display text-[12px] italic text-[#ff5400]">Thank You! ♥</p>
        <p className="text-[10px] font-black uppercase tracking-wide text-[var(--foreground)] opacity-80">
          {review.name}
        </p>
      </div>
    </article>
  );
}

export function ReviewsCollage({ reviews }: ReviewsCollageProps) {
  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative z-[45] scroll-mt-48 overflow-hidden bg-[var(--surface)] px-4 py-20 text-[var(--foreground)] sm:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-[#ff5400]">
            Customer Love
          </span>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-normal text-[var(--foreground)] sm:text-5xl">
            Reviews
          </h2>
        </div>

        <div className="mx-auto mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div key={`${review.name}-${review.company}-${index}`} className="snap-center sm:contents">
              <ReviewCard review={review} />
            </div>
          ))}
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
