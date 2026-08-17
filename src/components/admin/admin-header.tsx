"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User, LogOut, PanelLeft } from "lucide-react";

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
  const { data: session } = useSession();
  const pathname = usePathname();
  const pageTitle = pageTitles.find((page) => pathname.startsWith(page.path))?.label || "Dashboard";

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e4e4e7] bg-white/95 px-3 backdrop-blur sm:px-5 lg:px-6">
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex min-h-11 items-center gap-3 rounded-xl px-2 outline-none transition-colors hover:bg-[#f4f4f5] focus-visible:ring-2 focus-visible:ring-[#ff5400] sm:px-3">
            <Avatar className="size-9 border border-[#e4e4e7]">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "Admin"}
              />
              <AvatarFallback className="bg-[#fff1e9] text-[11px] font-bold text-[#c2410c]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-[#27272a]">
                {session?.user?.name || "Admin"}
              </p>
              <p className="max-w-40 truncate text-xs text-[#71717a]">
                {session?.user?.email || ""}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 border-[#e4e4e7] bg-white p-1.5 text-[#18181b] shadow-xl">
          <DropdownMenuItem disabled className="min-h-10 rounded-lg text-[#71717a]">
            <User size={14} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="min-h-10 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut size={14} />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
