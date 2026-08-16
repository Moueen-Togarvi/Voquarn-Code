import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div>
      <AdminPageHeader
        title="File-Managed Blog"
        description="Blog posts are maintained as Markdown files"
        backHref="/admin/blog"
      />
      <p className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-[var(--muted)]">
        Edit the matching file in <code>content/blogs</code>. The database editor is disabled for blog content.
      </p>
    </div>
  );
}
