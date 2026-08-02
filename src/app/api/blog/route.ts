import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      publishedAt: p.publishedAt,
      readTime: p.readTime,
      coverImage: p.coverImage,
    })),
  );
}
