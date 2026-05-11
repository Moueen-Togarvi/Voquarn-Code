import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/metadata";
import { blogPosts } from "@/lib/site-data";

export const metadata = buildMetadata(
  "Voquarn Code Blog",
  "Read SEO articles and tech tips from Voquarn Code on digital growth, systems, and practical AI.",
  "/blog",
);

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <section className="page-section">
        <SectionHeading
          eyebrow="Blog"
          title="SEO articles and practical tech notes"
          description="Short reads on digital growth, product thinking, and how to use modern tooling without losing operational clarity."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(245,158,11,0.12))] p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">{featured.category}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">{featured.title}</h2>
            <p className="mt-4 text-[rgba(233,238,242,0.76)]">{featured.excerpt}</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#07111a] hover:bg-[#f8fafc]"
            >
              Read article
            </Link>
          </article>
          <div className="panel rounded-[2rem] p-8">
            <h3 className="font-display text-2xl text-white">Join the newsletter</h3>
            <p className="mt-4 text-[rgba(233,238,242,0.72)]">
              Get new articles, SEO notes, and workflow ideas without inbox spam.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="grid gap-6 xl:grid-cols-3">
          {rest.map((post) => (
            <article key={post.slug} className="panel rounded-[1.75rem] p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">{post.category}</p>
              <h2 className="mt-4 font-display text-2xl text-white">{post.title}</h2>
              <p className="mt-4 text-[rgba(233,238,242,0.72)]">{post.excerpt}</p>
              <p className="mt-5 text-sm text-[rgba(233,238,242,0.52)]">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                • {post.readTime}
              </p>
              <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[#fcd34d] hover:text-[#fde68a]">
                Open post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
