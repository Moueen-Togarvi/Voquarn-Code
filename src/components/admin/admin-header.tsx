"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export function AdminHeader() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-6">
      <div />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[var(--surface)] transition-colors cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "Admin"}
              />
              <AvatarFallback className="bg-[#ff5400] text-[11px] font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {session?.user?.email || ""}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem disabled>
            <User size={14} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut size={14} />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
