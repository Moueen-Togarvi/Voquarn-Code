import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "Careers | Voquarn Code",
  "Explore open roles at Voquarn Code across engineering, design, and client delivery.",
  "/careers",
);

type CareersLayoutProps = {
  children: ReactNode;
};

export default function CareersLayout({ children }: CareersLayoutProps) {
  return children;
}
