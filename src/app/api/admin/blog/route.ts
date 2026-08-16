import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMarkdownBlogPosts } from "@/lib/markdown-blogs";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getMarkdownBlogPosts();
  return NextResponse.json(
    posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      category: post.category,
      published: true,
      publishedAt: post.publishedAt,
    })),
  );
}

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Blog posts are file-managed. Add a Markdown file in content/blogs." },
    { status: 405, headers: { Allow: "GET" } },
  );
}
