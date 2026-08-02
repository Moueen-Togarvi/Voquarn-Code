"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Download, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type Subscriber = {
  id: number;
  email: string;
  subscribedAt: string;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  function exportCsv() {
    const rows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.subscribedAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description={`${subscribers.length} subscriber${subscribers.length !== 1 ? "s" : ""} total`}
        backHref="/admin"
        action={
          <button
            onClick={exportCsv}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
        }
      />

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[var(--muted)]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Mail size={40} className="text-[var(--muted)] mb-3" />
            <p className="text-[var(--foreground)] font-medium">
              {search ? "No subscribers found" : "No newsletter subscribers yet"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[var(--border)] bg-[var(--surface)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Subscribed
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-[var(--surface)]">
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{subscriber.email}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)]">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <DeleteDialog
                        itemName="Subscriber"
                        apiPath={`/api/admin/newsletter/${subscriber.id}`}
                        onSuccess={fetchSubscribers}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
