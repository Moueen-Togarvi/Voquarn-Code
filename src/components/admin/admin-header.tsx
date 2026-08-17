"use client";

import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

const pageTitles = [
  { path: "/admin/services", label: "Services" },
  { path: "/admin/portfolio", label: "Portfolio" },
  { path: "/admin/team", label: "Team" },
  { path: "/admin/testimonials", label: "Testimonials" },
  { path: "/admin/stats", label: "Stats" },
  { path: "/admin/trusted-clients", label: "Trusted clients" },
  { path: "/admin/faq", label: "FAQ" },
  { path: "/admin/careers", label: "Careers" },
  { path: "/admin/settings", label: "Settings" },
];

export function AdminHeader({
  collapsed,
  onDesktopSidebarToggle,
  onMobileSidebarOpen,
}: {
  collapsed: boolean;
  onDesktopSidebarToggle: () => void;
  onMobileSidebarOpen: () => void;
}) {
  const pathname = usePathname();
  const pageTitle = pageTitles.find((page) => pathname.startsWith(page.path))?.label || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-[#e4e4e7] bg-white/95 px-3 backdrop-blur sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMobileSidebarOpen}
          className="flex size-11 items-center justify-center rounded-xl text-[#52525b] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] md:hidden"
          aria-label="Open navigation"
          title="Open navigation"
        >
          <PanelLeft size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDesktopSidebarToggle}
          className="hidden size-11 items-center justify-center rounded-xl text-[#52525b] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] md:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={`${collapsed ? "Expand" : "Collapse"} sidebar (Ctrl+B)`}
        >
          <PanelLeft size={19} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">Admin</p>
          <p className="truncate text-sm font-semibold text-[#27272a] sm:text-base">{pageTitle}</p>
        </div>
      </div>
    </header>
  );
}
