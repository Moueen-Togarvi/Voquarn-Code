"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Briefcase, Search, Pencil, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Badge } from "@/components/ui/badge";

type Item = {
  id: number;
  title: string;
  slug: string;
  category: string;
  imageUrl: string | null;
  liveUrl: string | null;
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Portfolio"
        description={`${items.length} item${items.length !== 1 ? "s" : ""} total`}
        backHref="/admin"
        action={
          <Link href="/admin/portfolio/new" className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors">
            <Plus size={16} /> Add Item
          </Link>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input type="text" placeholder="Search portfolio..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-20 text-center">
          <Briefcase size={40} className="text-[var(--muted)] mb-3" />
          <p className="text-[var(--foreground)] font-medium">{search ? "No items found" : "No portfolio items yet"}</p>
          {!search && <Link href="/admin/portfolio/new" className="mt-3 text-sm text-[#ff5400] hover:underline">Add your first item</Link>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
              <div className="relative aspect-[16/10] bg-[var(--surface)]">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--muted)]"><Briefcase size={24} /></div>
                )}
                <Badge className="absolute left-2 top-2 bg-black/60 text-white hover:bg-black/60">{item.category}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-[var(--foreground)] line-clamp-1">{item.title}</h3>
                <div className="mt-3 flex items-center justify-end gap-1">
                  {item.liveUrl && (
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors" title="Visit">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <Link href={`/admin/portfolio/${item.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors" title="Edit">
                    <Pencil size={15} />
                  </Link>
                  <DeleteDialog itemName="Portfolio Item" apiPath={`/api/admin/portfolio/${item.id}`} onSuccess={fetchItems} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
