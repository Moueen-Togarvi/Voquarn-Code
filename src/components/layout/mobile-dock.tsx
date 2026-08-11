"use client";

import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  Home,
  Info,
  Mail,
  Newspaper,
  UsersRound,
} from "lucide-react";
import { FloatingDock, type FloatingDockItem } from "@/components/ui/floating-dock";

const mobileRoutes = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Services", href: "/services", icon: BriefcaseBusiness },
  { title: "Teams", href: "/team", icon: UsersRound },
  { title: "Blog", href: "/blog", icon: Newspaper },
  { title: "Contact", href: "/contact", icon: Mail },
] as const;

export function MobileDock() {
  const pathname = usePathname();

  const items: FloatingDockItem[] = mobileRoutes.map(({ title, href, icon: Icon }) => ({
    title,
    href,
    active: href === "/" ? pathname === href : pathname.startsWith(href),
    icon: <Icon className="h-full w-full" strokeWidth={2.2} aria-hidden="true" />,
  }));

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[70] -translate-x-1/2 md:hidden">
      <FloatingDock items={items} desktopClassName="!hidden" />
    </div>
  );
}
