import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader
        title="New Blog Post"
        description="Create a new article for your blog"
        backHref="/admin/blog"
      />
      <BlogForm />
    </div>
  );
}
