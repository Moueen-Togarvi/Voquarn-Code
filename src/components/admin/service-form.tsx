"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/image-upload";

type SubService = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  pricePkr: number | string;
  priceUsd: number | string;
  features: string[];
};

type ServiceFormData = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  icon: string;
  subServices: SubService[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptySubService: SubService = {
  name: "",
  slug: "",
  description: "",
  pricePkr: "",
  priceUsd: "",
  features: [],
};

export function ServiceForm({ serviceId }: { serviceId?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!serviceId);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    slug: "",
    description: "",
    deliverables: [],
    icon: "",
    subServices: [],
  });

  const fetchService = useCallback(async () => {
    if (!serviceId) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setForm({
        id: data.id,
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        deliverables: data.deliverables || [],
        icon: data.icon || "",
        subServices: (data.subServices || []).map((ss: SubService) => ({
          ...ss,
          pricePkr: ss.pricePkr ?? "",
          priceUsd: ss.priceUsd ?? "",
          features: ss.features || [],
        })),
      });
      if (data.slug) setSlugEdited(true);
    } catch {
      toast.error("Failed to load service");
    } finally {
      setFetching(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  useEffect(() => {
    if (!slugEdited) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [slugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title.trim()) {
      toast.error("Title is required");
      setLoading(false);
      return;
    }

    try {
      const url = serviceId
        ? `/api/admin/services/${serviceId}`
        : "/api/admin/services";
      const method = serviceId ? "PUT" : "POST";

      const payload = {
        ...form,
        subServices: form.subServices.map((ss) => ({
          ...ss,
          slug: ss.slug || slugify(ss.name),
          pricePkr: ss.pricePkr ? Number(ss.pricePkr) : null,
          priceUsd: ss.priceUsd ? Number(ss.priceUsd) : null,
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Failed to save");
      }

      toast.success(serviceId ? "Service updated!" : "Service created!");
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  const addSubService = () =>
    setForm((f) => ({ ...f, subServices: [...f.subServices, { ...emptySubService }] }));

  const updateSubService = (index: number, field: keyof SubService, value: unknown) => {
    setForm((f) => ({
      ...f,
      subServices: f.subServices.map((ss, i) =>
        i === index ? { ...ss, [field]: value } : ss,
      ),
    }));
  };

  const removeSubService = (index: number) => {
    setForm((f) => ({
      ...f,
      subServices: f.subServices.filter((_, i) => i !== index),
    }));
  };

  const moveSubService = (index: number, direction: "up" | "down") => {
    setForm((f) => {
      const subs = [...f.subServices];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= subs.length) return f;
      [subs[index], subs[swapWith]] = [subs[swapWith], subs[index]];
      return { ...f, subServices: subs };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Web Development"
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-base font-medium text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Service description..."
              rows={3}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none focus:ring-2 focus:ring-[#ff5400]/20 resize-none"
            />
          </div>

          {/* Sub-Services */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Sub-Services & Pricing
              </label>
              <button
                type="button"
                onClick={addSubService}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff5400]/10 px-3 py-1.5 text-xs font-medium text-[#ff5400] hover:bg-[#ff5400]/20 transition-colors"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {form.subServices.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
                No sub-services yet. Click &quot;Add&quot; to create one.
              </p>
            ) : (
              <div className="space-y-4">
                {form.subServices.map((ss, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-[var(--muted)]">
                        Sub-Service #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveSubService(index, "up")}
                          disabled={index === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--panel)] disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSubService(index, "down")}
                          disabled={index === form.subServices.length - 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--panel)] disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSubService(index)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={ss.name}
                      onChange={(e) =>
                        updateSubService(index, "name", e.target.value)
                      }
                      placeholder="Sub-service name (e.g. Basic Website)"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                    />
                    <textarea
                      value={ss.description}
                      onChange={(e) =>
                        updateSubService(index, "description", e.target.value)
                      }
                      placeholder="Description..."
                      rows={2}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--muted)]">Price (PKR)</label>
                        <input
                          type="number"
                          value={ss.pricePkr}
                          onChange={(e) =>
                            updateSubService(index, "pricePkr", e.target.value)
                          }
                          placeholder="10000"
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--muted)]">Price (USD)</label>
                        <input
                          type="number"
                          value={ss.priceUsd}
                          onChange={(e) =>
                            updateSubService(index, "priceUsd", e.target.value)
                          }
                          placeholder="35"
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted)]">
                        Features (one per line)
                      </label>
                      <textarea
                        value={ss.features.join("\n")}
                        onChange={(e) =>
                          updateSubService(index, "features", e.target.value.split("\n").filter(Boolean))
                        }
                        placeholder={"Up to 5 Pages\nSimple animations\nMobile responsive"}
                        rows={3}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Save
            </h3>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {serviceId ? "Update Service" : "Save Service"}
                </>
              )}
            </button>
            <Link
              href="/admin/services"
              className="block rounded-xl border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            >
              Cancel
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Details
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">URL Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setForm({ ...form, slug: e.target.value });
                  setSlugEdited(true);
                }}
                placeholder="web-dev"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--muted)]">Icon (optional)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="globe"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Deliverables
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={deliverableInput}
                onChange={(e) => setDeliverableInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (deliverableInput.trim()) {
                      setForm((f) => ({
                        ...f,
                        deliverables: [...f.deliverables, deliverableInput.trim()],
                      }));
                      setDeliverableInput("");
                    }
                  }
                }}
                placeholder="Add deliverable..."
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (deliverableInput.trim()) {
                    setForm((f) => ({
                      ...f,
                      deliverables: [...f.deliverables, deliverableInput.trim()],
                    }));
                    setDeliverableInput("");
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff5400]/10 text-[#ff5400] hover:bg-[#ff5400]/20"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.deliverables.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--foreground)]"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        deliverables: f.deliverables.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-[var(--muted)] hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
