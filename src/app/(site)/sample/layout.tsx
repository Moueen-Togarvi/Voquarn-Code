import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "Sample Concepts | Voquarn Code",
  "Internal Voquarn Code concept page.",
  "/sample",
  { noIndex: true },
);

export default function SampleLayout({ children }: { children: ReactNode }) {
  return children;
}
