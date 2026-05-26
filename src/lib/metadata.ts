import type { Metadata } from "next";
import { site } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

export function buildMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    metadataBase: siteUrl,
    alternates: {
      canonical: path,
    },
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", sizes: "any" },
        { url: "/icon.png?v=2", type: "image/png", sizes: "500x500" },
      ],
      shortcut: "/favicon.ico?v=2",
      apple: [{ url: "/apple-icon.png?v=2", sizes: "500x500", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      siteName: site.name,
      type: "website",
      url: new URL(path, siteUrl).toString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
