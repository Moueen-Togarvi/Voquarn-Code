import type { BlogPost, Service } from "@/lib/site-data";
import { site } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

export type JsonLdData =
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

function organizationId() {
  return absoluteUrl("/#organization");
}

function websiteId() {
  return absoluteUrl("/#website");
}

export function siteIdentityJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId(),
        name: site.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/site-icon.png"),
        image: absoluteUrl("/bg-home.png"),
        description: site.description,
        email: site.email,
        telephone: site.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bahawalnagar",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        areaServed: ["Pakistan", "United States", "United Kingdom", "United Arab Emirates"],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: site.phone,
            contactType: "sales",
            email: site.email,
            availableLanguage: ["English", "Urdu"],
          },
        ],
        sameAs: Object.values(site.socials),
        knowsAbout: [
          "Web development",
          "Search engine optimization",
          "Mobile app development",
          "SaaS development",
          "AI workflow automation",
          "Brand and interface design",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId(),
        name: site.name,
        url: absoluteUrl("/"),
        description: site.description,
        publisher: { "@id": organizationId() },
        inLanguage: "en",
      },
    ],
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": websiteId() },
    publisher: { "@id": organizationId() },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(service: Service): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.id}`)}#service`,
    name: `${service.title} Services`,
    serviceType: service.title,
    description: service.description,
    url: absoluteUrl(`/services/${service.id}`),
    provider: { "@id": organizationId() },
    areaServed: ["Pakistan", "United States", "United Kingdom", "United Arab Emirates"],
    hasOfferCatalog: service.subServices?.length
      ? {
          "@type": "OfferCatalog",
          name: `${service.title} service options`,
          itemListElement: service.subServices.map((subService) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: subService.name,
              description: subService.description,
              provider: { "@id": organizationId() },
            },
          })),
        }
      : undefined,
  };
}

export function blogJsonLd(posts: BlogPost[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl("/blog")}#blog`,
    name: "Voquarn Code Blog",
    description: "SEO articles, digital growth notes, and practical AI workflow guidance.",
    url: absoluteUrl("/blog"),
    publisher: { "@id": organizationId() },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
    })),
  };
}

export function blogPostJsonLd(post: BlogPost): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${absoluteUrl(`/blog/${post.slug}`)}#webpage`,
    },
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl("/bg-home.png"),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Moueen Togarvi",
      url: absoluteUrl("/ceo"),
    },
    publisher: { "@id": organizationId() },
    inLanguage: "en",
  };
}

export function personJsonLd({
  name,
  jobTitle,
  description,
  path,
}: {
  name: string;
  jobTitle: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(path)}#person`,
    name,
    jobTitle,
    description,
    url: absoluteUrl(path),
    worksFor: { "@id": organizationId() },
  };
}
