"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

const defaultSettings: Record<string, string> = {
  site_name: "Voquarn Code",
  site_description: "Voquarn Code designs growth-ready websites, apps, SEO systems, and AI workflows for businesses.",
  site_email: "hello@voquarn.com",
  site_phone: "+92 324 1940988",
  site_whatsapp: "923241940988",
  site_location: "Bahawalnagar, Punjab, Pakistan",
  social_linkedin: "https://www.linkedin.com/company/voquarn-code",
  social_instagram: "https://www.instagram.com/voquarncode",
  social_facebook: "https://www.facebook.com/voquarncode",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  const fields = [
    { key: "site_name", label: "Site Name" },
    { key: "site_description", label: "Site Description", type: "textarea" },
    { key: "site_email", label: "Contact Email" },
    { key: "site_phone", label: "Phone Number" },
    { key: "site_whatsapp", label: "WhatsApp Number" },
    { key: "site_location", label: "Location" },
  ];

  const socialFields = [
    { key: "social_linkedin", label: "LinkedIn" },
    { key: "social_instagram", label: "Instagram" },
    { key: "social_facebook", label: "Facebook" },
  ];

  return (
    <div>
      <AdminPageHeader title="Settings" description="Manage your site information and social links" backHref="/admin" action={
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] disabled:opacity-50 transition-colors">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      } />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Info */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Site Information</h2>
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Social Links</h2>
          {socialFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">{field.label}</label>
              <input
                type="url"
                value={settings[field.key] || ""}
                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[#ff5400] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
