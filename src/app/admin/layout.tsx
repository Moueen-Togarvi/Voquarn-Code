import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("Admin | Voquarn Code", "Private site administration.", "/admin", { noIndex: true });

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
