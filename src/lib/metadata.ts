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
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
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
