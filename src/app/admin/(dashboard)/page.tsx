"use client";

import Link from "next/link";
import {
  FileText,
  Globe,
  Briefcase,
  Users,
  MessageSquare,
  HelpCircle,
  DollarSign,
  UserPlus,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountData = {
  blog: number;
  services: number;
  portfolio: number;
  team: number;
  testimonials: number;
  faq: number;
  pricing: number;
  careers: number;
};

const statCards = [
  { key: "blog" as const, label: "Blog Posts", icon: FileText, color: "text-blue-600 bg-blue-50", href: "/admin/blog" },
  { key: "services" as const, label: "Services", icon: Globe, color: "text-green-600 bg-green-50", href: "/admin/services" },
  { key: "portfolio" as const, label: "Portfolio", icon: Briefcase, color: "text-purple-600 bg-purple-50", href: "/admin/portfolio" },
  { key: "team" as const, label: "Team Members", icon: Users, color: "text-orange-600 bg-orange-50", href: "/admin/team" },
  { key: "testimonials" as const, label: "Testimonials", icon: MessageSquare, color: "text-pink-600 bg-pink-50", href: "/admin/testimonials" },
  { key: "faq" as const, label: "FAQ Items", icon: HelpCircle, color: "text-teal-600 bg-teal-50", href: "/admin/faq" },
  { key: "pricing" as const, label: "Pricing Plans", icon: DollarSign, color: "text-amber-600 bg-amber-50", href: "/admin/pricing" },
  { key: "careers" as const, label: "Open Roles", icon: UserPlus, color: "text-cyan-600 bg-cyan-50", href: "/admin/careers" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<CountData>({
    blog: 0,
    services: 0,
    portfolio: 0,
    team: 0,
    testimonials: 0,
    faq: 0,
    pricing: 0,
    careers: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch {
        // Dashboard counts not available yet
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Welcome back! Here&apos;s an overview of your website content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    card.color,
                  )}
                >
                  <Icon size={20} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-[var(--muted)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {counts[card.key]}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Quick Actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff5400] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e04800] transition-colors"
          >
            <Plus size={16} />
            New Blog Post
          </Link>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <Plus size={16} />
            Add Service
          </Link>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <Plus size={16} />
            Add Portfolio Item
          </Link>
          <Link
            href="/admin/team"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          >
            <Plus size={16} />
            Add Team Member
          </Link>
        </div>
      </div>
    </div>
  );
}
