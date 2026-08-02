import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "Enterprise Suite Concept | Voquarn Code",
  "Internal Voquarn Code experimental suite concept page.",
  "/sample-suites",
  { noIndex: true },
);

export default function SampleSuitesLayout({ children }: { children: ReactNode }) {
  return children;
}
