"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronsUpDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
];

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onMobileOpenChange,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[#e4e4e7] bg-white transition-[width] duration-200 ease-out motion-reduce:transition-none md:flex",
          collapsed ? "w-[72px]" : "w-[236px]",
        )}
      >
        <SidebarFrame collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(15rem,84vw)] gap-0 border-[#e4e4e7] bg-white p-0 text-[#18181b] sm:max-w-[15rem]"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate between Voquarn administration sections.
          </SheetDescription>
          <SidebarFrame
            collapsed={false}
            mobile
            onClose={() => onMobileOpenChange(false)}
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
  onClose,
  onNavigate,
}: {
  collapsed: boolean;
  mobile?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "Admin account";
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

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[#71717a] outline-none transition-colors hover:bg-[#f4f4f5] hover:text-[#18181b] focus-visible:ring-2 focus-visible:ring-[#ff5400] motion-reduce:transition-none"
            aria-label="Close navigation"
            title="Close navigation"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-hidden px-2 py-2">
        {sidebarGroups.map((group, groupIndex) => (
          <div
            key={group.label}
            className={cn(
              groupIndex > 0 && "mt-2 border-t border-[#f0f0f2] pt-2",
            )}
          >
            {!collapsed && groupIndex > 0 && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a1a1aa]">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
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
                        collapsed ? "justify-center px-2" : "gap-3 px-2.5",
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

      <div className="shrink-0 border-t border-[#ececef] p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex min-h-14 w-full items-center rounded-xl text-left outline-none transition-colors hover:bg-[#f4f4f5] focus-visible:ring-2 focus-visible:ring-[#ff5400] motion-reduce:transition-none",
                collapsed ? "justify-center px-1" : "gap-2.5 px-2",
                pathname.startsWith("/admin/settings") && "bg-[#fff1e9]",
              )}
              aria-label={collapsed ? "Open profile menu" : undefined}
              title={collapsed ? "Profile" : undefined}
            >
              <Avatar className="size-9 border border-[#e4e4e7]">
                <AvatarImage src={session?.user?.image || undefined} alt={userName} />
                <AvatarFallback className="bg-[#fff1e9] text-xs font-bold text-[#c2410c]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#27272a]">{userName}</span>
                    <span className="block truncate text-xs text-[#71717a]">{userEmail}</span>
                  </span>
                  <ChevronsUpDown size={15} className="shrink-0 text-[#71717a]" aria-hidden="true" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={mobile ? "top" : "right"}
            align="end"
            sideOffset={8}
            className="w-56 border-[#e4e4e7] bg-white p-1.5 text-[#18181b] shadow-xl"
          >
            <DropdownMenuLabel className="flex min-w-0 items-center gap-2.5 px-2 py-2 font-normal">
              <Avatar className="size-9 border border-[#e4e4e7]">
                <AvatarImage src={session?.user?.image || undefined} alt={userName} />
                <AvatarFallback className="bg-[#fff1e9] text-xs font-bold text-[#c2410c]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#27272a]">{userName}</span>
                <span className="block truncate text-xs text-[#71717a]">{userEmail}</span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#ececef]" />
            <DropdownMenuItem asChild className="min-h-11 rounded-lg focus:bg-[#f4f4f5] focus:text-[#18181b]">
              <Link href="/admin/settings" onClick={onNavigate}>
                <Settings size={16} aria-hidden="true" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#ececef]" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="min-h-11 rounded-lg text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
