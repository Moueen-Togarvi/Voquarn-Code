import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div>
      <AdminPageHeader
        title="New Service"
        description="Add a new service with pricing tiers"
        backHref="/admin/services"
      />
      <ServiceForm />
    </div>
  );
}
