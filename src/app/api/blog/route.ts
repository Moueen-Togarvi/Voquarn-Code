import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { blogPosts as staticPosts } from "@/lib/site-data";

export async function GET() {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));

    if (posts.length > 0) {
      return NextResponse.json(
        posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt || "",
          category: p.category || "",
          publishedAt: p.publishedAt
            ? p.publishedAt.toISOString().split("T")[0]
            : new Date(p.createdAt).toISOString().split("T")[0],
          readTime: p.readTime || "",
          coverImage: p.coverImage,
        })),
      );
    }
  } catch (error) {
    console.error("Public blog API error:", error);
  }

  // Fallback to static data
  return NextResponse.json(staticPosts);
}
