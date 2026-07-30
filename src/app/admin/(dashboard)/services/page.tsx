"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Globe, Search, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type Service = {
  id: number;
  title: string;
  slug: string;
  description: string;
  subServices?: { id: number; name: string }[];
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description={`${services.length} service${services.length !== 1 ? "s" : ""} total`}
        backHref="/admin"
        action={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors"
          >
            <Plus size={16} />
            Add Service
          </Link>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <Globe size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">
            {search ? "No services found" : "No services yet"}
          </p>
          {!search && (
            <Link href="/admin/services/new" className="mt-3 text-sm text-[#ff5400] hover:underline">
              Add your first service
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5400]/10 text-[#ff5400]">
                  <Globe size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <DeleteDialog
                    itemName="Service"
                    apiPath={`/api/admin/services/${service.id}`}
                    onSuccess={fetchServices}
                  />
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-[var(--foreground)]">{service.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{service.description}</p>
              <p className="mt-3 text-xs text-[var(--muted)]">
                {service.subServices?.length || 0} sub-service{(service.subServices?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
