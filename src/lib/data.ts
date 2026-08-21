import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  services,
  subServices,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  siteSettings,
  jobOpenings,
  stats,
  clientLogos,
  clientCategories,
} from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { site as staticSite } from "@/lib/site-data";
import type { Service, PortfolioItem, TeamMember, Testimonial, FaqItem, PricingPlan, JobOpening, Stat, ClientLogo, ClientCategory } from "@/lib/site-data";
import { getMarkdownBlogPost, getMarkdownBlogPosts } from "@/lib/markdown-blogs";

// Markdown files are the source of truth for blog content. The remaining CMS
// content below stays database-backed; there is no fallback to demo content.
//
// Neon's free-tier compute suspends after a few minutes of inactivity, so the
// first query after idle has to wait for it to wake up — this has measured
// 4+ seconds on this project, not a quick blip. withRetry backs off
// exponentially (500ms, 1s, 2s) so a cold start survives instead of failing
// three times in under a second. Only after retries are exhausted do we log
// and return an empty result — still no fake data, just resilience against
// cold starts and genuine network noise.
async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelayMs = 500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

// Cache tags for the two layout-level reads below. Admin writes call
// revalidateTag with these so an edit shows up right away instead of waiting
// out the hourly window.
export const SITE_SETTINGS_CACHE_TAG = "site-settings";
export const TESTIMONIALS_CACHE_TAG = "testimonials";

// Every database getter below is wrapped in React's cache() so multiple calls to the
// same function within one request (e.g. the root layout and the page it
// wraps both needing site settings) hit the database once, not twice. Without
// this, every page load paid for duplicate round-trips on top of each other
// — the exact kind of overhead that hurts most on high-latency connections.

// ── Blog Posts (content/blogs/*.md) ──
export const getBlogPosts = getMarkdownBlogPosts;
export const getBlogPost = getMarkdownBlogPost;

// ── Services ──
export const getServices = cache(async (): Promise<Service[]> => {
  try {
    return await withRetry(async () => {
      const allServices = await db.select().from(services).orderBy(desc(services.createdAt));
      if (allServices.length === 0) return [];
      const allSubs = await db.select().from(subServices).orderBy(asc(subServices.order));
      return allServices.map((s) => ({
        id: s.slug,
        title: s.title,
        description: s.description,
        deliverables: (s.deliverables as string[]) || [],
        subServices: allSubs.filter((ss) => ss.serviceId === s.id).map((ss) => ({
          id: ss.slug || ss.name.toLowerCase().replace(/\s+/g, "-"),
          name: ss.name,
          description: ss.description || "",
          pricePkr: ss.pricePkr ?? 0,
          priceUsd: ss.priceUsd ?? 0,
          features: (ss.features as string[]) || [],
        })),
      }));
    });
  } catch (error) {
    console.error("getServices DB error:", error);
    return [];
  }
});

export const getService = cache(async (slug: string): Promise<Service | undefined> => {
  try {
    return await withRetry(async () => {
      const [s] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
      if (!s) return undefined;
      const subs = await db.select().from(subServices).where(eq(subServices.serviceId, s.id)).orderBy(asc(subServices.order));
      return {
        id: s.slug,
        title: s.title,
        description: s.description,
        deliverables: (s.deliverables as string[]) || [],
        subServices: subs.map((ss) => ({
          id: ss.slug || ss.name.toLowerCase().replace(/\s+/g, "-"),
          name: ss.name,
          description: ss.description || "",
          pricePkr: ss.pricePkr ?? 0,
          priceUsd: ss.priceUsd ?? 0,
          features: (ss.features as string[]) || [],
        })),
      };
    });
  } catch (error) {
    console.error("getService DB error:", error);
    return undefined;
  }
});

// ── Portfolio ──
export const getPortfolioItems = cache(async (): Promise<PortfolioItem[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
      return items.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category as PortfolioItem["category"],
        summary: p.summary || "",
        outcome: p.outcome || "",
        stack: (p.stack as string[]) || [],
        liveUrl: p.liveUrl || "",
        imageUrl: p.imageUrl || "",
      }));
    });
  } catch (error) {
    console.error("getPortfolioItems DB error:", error);
    return [];
  }
});

// ── Team ──
export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  try {
    return await withRetry(async () => {
      const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
      return members.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio || "",
        linkedinUrl: m.linkedinUrl || null,
        email: m.email || null,
        facebookUrl: m.facebookUrl || null,
      }));
    });
  } catch (error) {
    console.error("getTeamMembers DB error:", error);
    return [];
  }
});

// ── Testimonials ──
// Read by the site layout, so every dynamically rendered page (and every ISR
// regeneration) used to pay a Neon round-trip for it — a slow one whenever the
// free-tier compute had suspended. unstable_cache keeps the rows in the Next
// data cache instead; admin writes push through immediately via revalidateTag.
// The fetch throws rather than swallowing errors so a failed query is never
// what gets cached for the next hour.
const loadTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> =>
    withRetry(async () => {
      const items = await db.select().from(testimonials).orderBy(asc(testimonials.order));
      return items.map((t) => ({
        name: t.name,
        company: t.company || "",
        review: t.review,
        stars: t.stars ?? 5,
        mediaUrl: t.mediaUrl || null,
        mediaType: (t.mediaType as "image" | "video" | null) || null,
      }));
    }),
  ["testimonials"],
  { tags: [TESTIMONIALS_CACHE_TAG], revalidate: 3600 },
);

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    return await loadTestimonials();
  } catch (error) {
    console.error("getTestimonials DB error:", error);
    return [];
  }
});

// ── FAQ ──
export const getFaqItems = cache(async (): Promise<FaqItem[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(faqItems).orderBy(asc(faqItems.order));
      return items.map((f) => ({
        question: f.question,
        answer: f.answer,
      }));
    });
  } catch (error) {
    console.error("getFaqItems DB error:", error);
    return [];
  }
});

// ── Pricing ──
export const getPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(pricingPlans).orderBy(asc(pricingPlans.order));
      return items.map((p) => ({
        name: p.name,
        description: p.description || "",
        pricePkr: p.pricePkr ?? 0,
        priceUsd: p.priceUsd ?? 0,
        featured: p.featured ?? false,
        features: (p.features as string[]) || [],
      }));
    });
  } catch (error) {
    console.error("getPricingPlans DB error:", error);
    return [];
  }
});

// ── Careers ──
export const getJobOpenings = cache(async (): Promise<JobOpening[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(jobOpenings).orderBy(asc(jobOpenings.order));
      return items.map((j) => ({
        id: j.id,
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type,
        salary: j.salary || "",
        description: j.description,
        tags: (j.tags as string[]) || [],
      }));
    });
  } catch (error) {
    console.error("getJobOpenings DB error:", error);
    return [];
  }
});

// ── Stats ──
export const getStats = cache(async (): Promise<Stat[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(stats).orderBy(asc(stats.order));
      return items.map((s) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix || undefined,
      }));
    });
  } catch (error) {
    console.error("getStats DB error:", error);
    return [];
  }
});

// ── Trusted client logos ──
export const getClientLogos = cache(async (): Promise<ClientLogo[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(clientLogos).orderBy(asc(clientLogos.order));
      return items.map((c) => ({
        name: c.name,
        logoUrl: c.logoUrl,
      }));
    });
  } catch (error) {
    console.error("getClientLogos DB error:", error);
    return [];
  }
});

// ── Trusted client category chips ──
export const getClientCategories = cache(async (): Promise<ClientCategory[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(clientCategories).orderBy(asc(clientCategories.order));
      return items.map((c) => ({
        label: c.label,
      }));
    });
  } catch (error) {
    console.error("getClientCategories DB error:", error);
    return [];
  }
});

// ── Site Settings ──
// Settings are per-field overrides on top of static defaults (not a content
// list), so an unset field falling back to its default is correct here —
// unlike the content getters above, this isn't "fake data standing in for an
// empty admin table."
export type SiteSettings = typeof staticSite;

// Cached for the same reason as testimonials above: the layout reads it on
// every request, and the raw rows are tiny and identical for every visitor.
const loadSiteSettingRows = unstable_cache(
  () => withRetry(() => db.select().from(siteSettings)),
  ["site-settings"],
  { tags: [SITE_SETTINGS_CACHE_TAG], revalidate: 3600 },
);

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings: SiteSettings = {
    ...staticSite,
    socials: { ...staticSite.socials },
  };

  try {
    const rows = await loadSiteSettingRows();
    for (const row of rows) {
      switch (row.key) {
        case "site_name": settings.name = row.value; break;
        case "site_description": settings.description = row.value; break;
        case "site_email": settings.email = row.value; break;
        case "site_phone": settings.phone = row.value; break;
        case "site_whatsapp": settings.whatsapp = row.value; break;
        case "site_location": settings.location = row.value; break;
        case "social_linkedin": settings.socials.linkedin = row.value; break;
        case "social_instagram": settings.socials.instagram = row.value; break;
        case "social_facebook": settings.socials.facebook = row.value; break;
      }
    }
  } catch (error) {
    console.error("getSiteSettings DB error:", error);
  }

  return settings;
});
