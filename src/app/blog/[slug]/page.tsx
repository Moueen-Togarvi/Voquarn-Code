import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { blogPosts, getBlogPost } from "@/lib/site-data";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return buildMetadata("Article not found", "The requested article could not be found.", "/blog");
  }

  return buildMetadata(post.title, post.excerpt, `/blog/${post.slug}`);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="page-section">
      <article className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.18em] text-[#99f6e4]">{post.category}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-[rgba(233,238,242,0.54)]">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          • {post.readTime}
        </p>

        <div className="mt-10 space-y-6 text-lg leading-8 text-[rgba(233,238,242,0.8)]">
          {post.sections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </div>
      </article>
    </section>
  );
}
