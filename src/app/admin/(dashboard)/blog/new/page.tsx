import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader
        title="File-Managed Blog"
        description="Blog posts are maintained as Markdown files"
        backHref="/admin/blog"
      />
      <p className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-[var(--muted)]">
        Add new posts manually in <code>content/blogs</code>. The database editor is disabled for blog content.
      </p>
    </div>
  );
}
