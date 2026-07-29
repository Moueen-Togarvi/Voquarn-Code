import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <AdminPageHeader title="Edit Portfolio Item" description="Update project details" backHref="/admin/portfolio" />
      <PortfolioForm itemId={parseInt(id)} />
    </div>
  );
}
