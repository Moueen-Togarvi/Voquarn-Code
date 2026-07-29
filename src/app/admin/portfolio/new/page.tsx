import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div>
      <AdminPageHeader title="New Portfolio Item" description="Add a new project to your portfolio" backHref="/admin/portfolio" />
      <PortfolioForm />
    </div>
  );
}
