import type { Metadata } from "next";
import { site } from "@/lib/site-data";

export function buildMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  return {
    title,
    description,
    metadataBase: new URL("https://voquarn.com"),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
