import type { BlogPost, FaqItem, Service, SubService, TeamMember } from "@/lib/site-data";
import type { SiteSettings } from "@/lib/data";
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

export function siteIdentityJsonLd(site: SiteSettings): JsonLdData {
  const socialProfiles = Object.values(site.socials).filter((url) => /^https?:\/\//.test(url));
  const serviceAreas = [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United Arab Emirates" },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": organizationId(),
        name: site.name,
        alternateName: "Voquarn",
        slogan: "From idea to launch, without the messy middle.",
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(site.logoPath),
          contentUrl: absoluteUrl(site.logoPath),
          width: 500,
          height: 500,
        },
        image: absoluteUrl("/og-default.jpg"),
        description: site.description,
        email: site.email,
        telephone: site.phone,
        priceRange: "$$",
        currenciesAccepted: "PKR, USD",
        paymentAccepted: "Cash, Credit Card, Bank Transfer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bahawalnagar",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 29.9955,
          longitude: 73.2713,
        },
        areaServed: serviceAreas,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "14:00",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: site.phone,
            contactType: "sales",
            email: site.email,
            availableLanguage: ["English", "Urdu"],
          },
        ],
        ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
        knowsAbout: [
          "Web development",
          "Next.js development",
          "Search engine optimization",
          "Technical SEO",
          "Local SEO",
          "Mobile app development",
          "SaaS development",
          "AI workflow automation",
          "AI agent development",
          "Business process automation",
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
        about: { "@id": organizationId() },
      },
    ],
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  keywords = [],
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
  keywords?: string[];
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
    ...(keywords.length > 0 ? { keywords } : {}),
    // Tells voice assistants and answer engines which text on the page is the
    // canonical summary worth reading aloud or quoting.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
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
  const subServices = service.subServices ?? [];
  const url = absoluteUrl(`/services/${service.id}`);

  // Publishing real prices is what lets answer engines respond to
  // "how much does X cost" with our numbers instead of a competitor's.
  const offer = (subService: SubService) => {
    const priceSpecification: Record<string, unknown>[] = [];
    if (subService.pricePkr > 0) {
      priceSpecification.push({
        "@type": "UnitPriceSpecification",
        price: subService.pricePkr,
        priceCurrency: "PKR",
      });
    }
    if (subService.priceUsd > 0) {
      priceSpecification.push({
        "@type": "UnitPriceSpecification",
        price: subService.priceUsd,
        priceCurrency: "USD",
      });
    }

    return {
      "@type": "Offer",
      name: subService.name,
      description: subService.description,
      url,
      availability: "https://schema.org/InStock",
      ...(priceSpecification.length > 0 ? { priceSpecification } : {}),
      itemOffered: {
        "@type": "Service",
        name: subService.name,
        description: subService.description,
        provider: { "@id": organizationId() },
      },
    };
  };

  const pkrPrices = subServices.map((s) => s.pricePkr).filter((p) => p > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${service.title} Services`,
    serviceType: service.title,
    description: service.description,
    url,
    provider: { "@id": organizationId() },
    areaServed: ["Pakistan", "United States", "United Kingdom", "United Arab Emirates"],
    ...(pkrPrices.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "PKR",
            lowPrice: Math.min(...pkrPrices),
            highPrice: Math.max(...pkrPrices),
            offerCount: subServices.length,
          },
        }
      : {}),
    hasOfferCatalog: subServices.length
      ? {
          "@type": "OfferCatalog",
          name: `${service.title} service options`,
          itemListElement: subServices.map(offer),
        }
      : undefined,
  };
}

/** Collection pages (services, portfolio, blog) rank better with an explicit item list. */
export function itemListJsonLd(
  items: { name: string; path: string; description?: string }[],
  listName: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      url: absoluteUrl(item.path),
    })),
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
      dateModified: post.modifiedAt || post.publishedAt,
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
    image: absoluteUrl(post.coverImage || "/og-default.jpg"),
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt || post.publishedAt,
    author: {
      "@type": "Person",
      "@id": `${absoluteUrl("/ceo")}#person`,
      name: "Moueen Togarvi",
      url: absoluteUrl("/ceo"),
    },
    publisher: { "@id": organizationId() },
    inLanguage: "en",
    ...(post.seoKeywords && post.seoKeywords.length > 0
      ? { keywords: post.seoKeywords.join(", ") }
      : {}),
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

/** Team members without a dedicated profile page still get a Person entity, anchored on /team. */
export function teamMemberJsonLd(member: TeamMember): Record<string, unknown> {
  const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl("/team")}#${slug}`,
    name: member.name,
    jobTitle: member.role,
    description: member.bio || undefined,
    url: absoluteUrl("/team"),
    worksFor: { "@id": organizationId() },
    sameAs: member.linkedinUrl ? [member.linkedinUrl] : undefined,
  };
}

export function faqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
