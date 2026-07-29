import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <AdminPageHeader
        title="Edit Blog Post"
        description="Update your article"
        backHref="/admin/blog"
      />
      <BlogForm postId={parseInt(id)} />
    </div>
  );
}
