import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "Rocket Concept | Voquarn Code",
  "Internal Voquarn Code experimental concept page.",
  "/sample-rocket",
  { noIndex: true },
);

export default function SampleRocketLayout({ children }: { children: ReactNode }) {
  return children;
}
