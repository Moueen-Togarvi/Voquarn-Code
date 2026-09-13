import type { Metadata } from "next";
import { site } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

// Brand + head terms that belong on every page. Page-specific long-tail and
// question-style keywords are passed per page via `options.keywords`, so no
// single page ends up diluted across every term the agency targets.
const defaultKeywords = [
  "Voquarn Code",
  "web development agency",
  "SEO services",
  "app development",
  "AI automation",
  "Next.js development",
  "digital agency Pakistan",
  "website design Pakistan",
  "software house Pakistan",
  "web development Bahawalnagar",
  "web design company Punjab",
  "hire Next.js developers",
  "custom software development agency",
  "AI chatbot development",
  "SaaS development company",
  "ecommerce website development Pakistan",
];

type BuildMetadataOptions = {
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Google treats `/foo` and `/foo/` as separate canonicals when both respond,
 * so every non-root canonical is normalised to no trailing slash. Query
 * strings and fragments are dropped because a canonical URL should be the
 * shareable, parameter-free version of the page.
 */
function canonicalPath(path: string): string {
  if (!path) return "/";
  const withoutQuery = path.split(/[?#]/)[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.endsWith("/") ? withoutQuery.slice(0, -1) : withoutQuery;
}

export function buildMetadata(
  title: string,
  description: string,
  path = "/",
  options: BuildMetadataOptions = {},
): Metadata {
  const siteUrl = getSiteUrl();
  const normalisedPath = canonicalPath(path);
  const url = new URL(normalisedPath, siteUrl).toString();
  const imageUrl = new URL(options.image || "/og-default.jpg", siteUrl).toString();
  const images = [
    {
      url: imageUrl,
      width: 1200,
      height: 675,
      alt: `${title} — ${site.name}`,
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
          locale: "en_PK",
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
          locale: "en_PK",
          images,
        };

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const verification: Metadata["verification"] = {};
  if (googleVerification) verification.google = googleVerification;
  if (bingVerification) {
    verification.other = { "msvalidate.01": bingVerification };
  }

  return {
    title,
    description,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl.toString() }],
    creator: site.name,
    publisher: site.name,
    keywords: Array.from(new Set([...defaultKeywords, ...(options.keywords || [])])),
    metadataBase: siteUrl,
    alternates: {
      canonical: normalisedPath,
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    category: "Technology",
    classification: "Web development, SEO, mobile apps, SaaS, and AI automation",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    other: {
      "geo.region": "PK-PB",
      "geo.placename": "Bahawalnagar, Punjab, Pakistan",
      ICBM: "29.9955, 73.2713",
    },
    // `src/app/icon.png` and `src/app/apple-icon.png` are auto-injected by
    // Next.js at the correct sizes, so only the ICO fallback needs an explicit
    // declaration. Previously the same 500×500 logo was emitted twice, once as
    // "icon" and once as "apple", which prevented browsers from choosing a
    // properly sized tab icon.
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }],
      shortcut: "/favicon.ico",
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
