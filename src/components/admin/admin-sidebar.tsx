"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ExternalLink,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const sidebarGroups: Array<{ label: string; links: SidebarLink[] }> = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Website content",
    links: [
      { href: "/admin/services", label: "Services", icon: Globe2 },
      { href: "/admin/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/stats", label: "Stats", icon: BarChart3 },
      { href: "/admin/trusted-clients", label: "Trusted clients", icon: Building2 },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "Hiring",
    links: [{ href: "/admin/careers", label: "Careers", icon: UserPlus }],
  },
  {
    label: "System",
    links: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileOpenChange,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[#e4e4e7] bg-white transition-[width] duration-200 ease-out motion-reduce:transition-none md:flex",
          collapsed ? "w-20" : "w-[272px]",
        )}
      >
        <SidebarFrame collapsed={collapsed} onToggle={onToggle} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(19rem,88vw)] gap-0 border-[#e4e4e7] bg-white p-0 text-[#18181b] sm:max-w-[19rem]"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate between Voquarn administration sections.
          </SheetDescription>
          <SidebarFrame
            collapsed={false}
            mobile
            onToggle={() => onMobileOpenChange(false)}
            onNavigate={() => onMobileOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarFrame({
  collapsed,
  mobile = false,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  mobile?: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Administrator";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col bg-white text-[#18181b]">
      <div className={cn("flex h-[72px] shrink-0 items-center border-b border-[#ececef]", collapsed ? "justify-center px-3" : "justify-between px-4")}>
        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            "flex min-h-11 min-w-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-2",
            collapsed ? "justify-center" : "gap-3",
          )}
          aria-label={collapsed ? "Voquarn Admin dashboard" : undefined}
          title={collapsed ? "Voquarn Admin" : undefined}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#18181b] text-sm font-black text-white shadow-sm">
            V
          </span>
          {!collapsed && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold tracking-tight">Voquarn Admin</span>
              <span className="mt-0.5 block text-[11px] font-medium text-[#71717a]">Content workspace</span>
            </span>
          )}
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[#71717a] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] motion-reduce:transition-none"
            aria-label={mobile ? "Close navigation" : "Collapse sidebar"}
            title={mobile ? "Close navigation" : "Collapse sidebar (Ctrl+B)"}
          >
            {mobile ? <X size={19} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        {sidebarGroups.map((group, groupIndex) => (
          <div
            key={group.label}
            className={cn(
              groupIndex > 0 && "mt-4 border-t border-[#f0f0f2] pt-4",
              collapsed && groupIndex > 0 && "mt-3 pt-3",
            )}
          >
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.links.map((link) => {
                const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                const Icon = link.icon;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={collapsed ? link.label : undefined}
                      title={collapsed ? link.label : undefined}
                      className={cn(
                        "group relative flex min-h-11 items-center rounded-xl text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5400] focus-visible:ring-offset-1 motion-reduce:transition-none",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        isActive
                          ? "bg-[#fff1e9] font-semibold text-[#c2410c]"
                          : "text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#18181b]",
                      )}
                    >
                      {isActive && !collapsed && <span aria-hidden="true" className="absolute left-0 h-5 w-0.5 rounded-r-full bg-[#ff5400]" />}
                      <Icon size={18} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="truncate">{link.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-[#ececef] p-3">
        {!collapsed && (
          <div className="mb-2 flex min-w-0 items-center gap-3 rounded-xl bg-[#fafafa] px-3 py-2.5">
            <Avatar className="size-9 border border-[#e4e4e7]">
              <AvatarImage src={session?.user?.image || undefined} alt={userName} />
              <AvatarFallback className="bg-[#fff1e9] text-xs font-bold text-[#c2410c]">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#27272a]">{userName}</p>
              <p className="truncate text-xs text-[#71717a]">{session?.user?.email || "Admin account"}</p>
            </div>
          </div>
        )}

        <div className={cn("flex", collapsed ? "flex-col gap-1" : "gap-1")}>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            aria-label={collapsed ? "View website" : undefined}
            title={collapsed ? "View website" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-xl text-sm font-medium text-[#52525b] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] motion-reduce:transition-none",
              collapsed ? "justify-center px-2" : "flex-1 justify-center gap-2 px-3",
            )}
          >
            <ExternalLink size={17} aria-hidden="true" />
            {!collapsed && <span>View site</span>}
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            aria-label={collapsed ? "Sign out" : undefined}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-xl text-sm font-medium text-[#dc2626] outline-none transition-colors hover:bg-[#fef2f2] focus-visible:ring-2 focus-visible:ring-[#dc2626] motion-reduce:transition-none",
              collapsed ? "justify-center px-2" : "flex-1 justify-center gap-2 px-3",
            )}
          >
            <LogOut size={17} aria-hidden="true" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 flex size-11 w-full items-center justify-center rounded-xl border border-[#e4e4e7] text-[#71717a] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] motion-reduce:transition-none"
            aria-label="Expand sidebar"
            title="Expand sidebar (Ctrl+B)"
          >
            <ChevronLeft size={18} className="rotate-180" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
