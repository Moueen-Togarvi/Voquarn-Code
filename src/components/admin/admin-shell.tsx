"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        const target = event.target as HTMLElement | null;
        if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
        event.preventDefault();
        setCollapsed((current) => !current);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="admin-light min-h-dvh overflow-x-hidden bg-[#f7f7f8] text-[#18181b]">
      <a
        href="#admin-main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-[#18181b] px-4 py-2 text-sm font-semibold text-white outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-[#ff5400]"
      >
        Skip to content
      </a>
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <div
        className={cn(
          "min-h-dvh transition-[margin] duration-200 ease-out motion-reduce:transition-none",
          collapsed ? "md:ml-20" : "md:ml-[272px]",
        )}
      >
        <AdminHeader
          collapsed={collapsed}
          onDesktopSidebarToggle={() => setCollapsed((current) => !current)}
          onMobileSidebarOpen={() => setMobileOpen(true)}
        />
        <main id="admin-main-content" tabIndex={-1} className="p-4 outline-none sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
