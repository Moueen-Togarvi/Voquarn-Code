import type { Metadata } from "next";
import { site } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

const defaultKeywords = [
  "Voquarn Code",
  "web development agency",
  "SEO services",
  "app development",
  "AI automation",
  "Next.js development",
  "digital agency Pakistan",
  "website design Pakistan",
];

type BuildMetadataOptions = {
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata(
  title: string,
  description: string,
  path = "/",
  options: BuildMetadataOptions = {},
): Metadata {
  const siteUrl = getSiteUrl();
  const url = new URL(path, siteUrl).toString();
  const imageUrl = new URL(options.image || "/bg-home.png", siteUrl).toString();
  const images = [
    {
      url: imageUrl,
      width: 1200,
      height: 675,
      alt: `${site.name} digital agency preview`,
    },
  ];

  const openGraph: NonNullable<Metadata["openGraph"]> =
    options.type === "article"
      ? {
          title,
          description,
          siteName: site.name,
          type: "article",
          url,
          locale: "en_US",
          images,
          publishedTime: options.publishedTime,
          modifiedTime: options.modifiedTime || options.publishedTime,
        }
      : {
          title,
          description,
          siteName: site.name,
          type: "website",
          url,
          locale: "en_US",
          images,
        };

  return {
    title,
    description,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl.toString() }],
    creator: site.name,
    publisher: site.name,
    keywords: [...defaultKeywords, ...(options.keywords || [])],
    metadataBase: siteUrl,
    alternates: {
      canonical: path,
    },
    icons: {
      icon: [
        { url: site.logoPath, type: "image/png", sizes: "500x500" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: site.iconPath, sizes: "500x500", type: "image/png" }],
    },
    robots: {
      index: !options.noIndex,
      follow: !options.noIndex,
      googleBot: {
        index: !options.noIndex,
        follow: !options.noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
