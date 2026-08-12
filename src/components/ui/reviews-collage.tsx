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
    <article className="relative w-full max-w-[300px] shrink-0 rounded-[1.6rem] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.08)] sm:max-w-none">
      <p className="text-center font-display text-[13px] italic text-[var(--muted)]">Customer Review</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5400]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#ff5400]">
          Verified Client
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          {review.company || "Voquarn Code Client"}
        </span>
      </div>

      {/* Chat-mockup media frame */}
      {review.mediaUrl ? (
        <div className="relative mt-3 overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[#0b141a]">
          <div className="flex items-center gap-2 bg-[#1f2c34] px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff5400] text-[10px] font-bold text-white">
              {firstName.charAt(0)}
            </div>
            <span className="text-[11px] font-semibold text-white">{firstName}</span>
          </div>
          <div className="relative aspect-[4/5] w-full">
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
        <div className="mt-3 flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-[1rem] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5400] text-lg font-black text-white">
            {firstName.charAt(0)}
          </div>
          <p className="text-[13px] font-semibold leading-6 text-[var(--foreground)] opacity-80">
            &ldquo;{review.review}&rdquo;
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2 text-center">
        <p className="font-display text-[13px] font-black uppercase leading-tight text-[var(--foreground)]">
          Real Words.
          <br />
          Real Happiness.
        </p>
        <div className="flex justify-center">
          <Stars count={review.stars} />
        </div>
      </div>

      {review.mediaUrl && (
        <p className="mt-3 line-clamp-3 text-center text-[12px] font-medium leading-5 text-[var(--muted)]">
          &ldquo;{review.review}&rdquo;
        </p>
      )}

      <div className="mt-4 rounded-[1rem] bg-[#ff5400]/10 p-4 text-center">
        <p className="text-[11px] font-semibold leading-5 text-[var(--foreground)] opacity-80">
          Your kind words motivate us to keep delivering the best quality with care and attention to detail.
        </p>
        <p className="mt-2 font-display text-[13px] italic text-[#ff5400]">Thank You! ♥</p>
      </div>

      <p className="mt-3 text-center text-[11px] font-black uppercase tracking-wide text-[var(--foreground)]">
        {review.name}
      </p>
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
