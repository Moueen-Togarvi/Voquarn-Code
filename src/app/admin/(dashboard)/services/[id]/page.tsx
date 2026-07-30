import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <AdminPageHeader
        title="Edit Service"
        description="Update service details and pricing"
        backHref="/admin/services"
      />
      <ServiceForm serviceId={parseInt(id)} />
    </div>
  );
}
