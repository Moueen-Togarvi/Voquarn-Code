import { cache } from "react";
import { db } from "@/db";
import {
  blogPosts,
  services,
  subServices,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  siteSettings,
  jobOpenings,
} from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { site as staticSite } from "@/lib/site-data";
import type { BlogPost, Service, PortfolioItem, TeamMember, Testimonial, FaqItem, PricingPlan, JobOpening } from "@/lib/site-data";

// The database is the single source of truth for all content below: if a row
// isn't in the admin panel, it doesn't render on the site. There is no
// fallback to static demo content — an empty table means an empty section.
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

// Every getter below is wrapped in React's cache() so multiple calls to the
// same function within one request (e.g. the root layout and the page it
// wraps both needing site settings) hit the database once, not twice. Without
// this, every page load paid for duplicate round-trips on top of each other
// — the exact kind of overhead that hurts most on high-latency connections.

// ── Blog Posts ──
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    return await withRetry(async () => {
      const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
      return posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        category: p.category || "",
        publishedAt: p.publishedAt ? p.publishedAt.toISOString().split("T")[0] : new Date(p.createdAt).toISOString().split("T")[0],
        readTime: p.readTime || "",
        sections: [], // Rich content rendered separately
        content: p.content,
        coverImage: p.coverImage,
      }));
    });
  } catch (error) {
    console.error("getBlogPosts DB error:", error);
    return [];
  }
});

export const getBlogPost = cache(async (slug: string) => {
  try {
    return await withRetry(async () => {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (!post) return undefined;
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category || "",
        publishedAt: post.publishedAt ? post.publishedAt.toISOString().split("T")[0] : new Date(post.createdAt).toISOString().split("T")[0],
        readTime: post.readTime || "",
        sections: [],
        content: post.content,
        coverImage: post.coverImage,
      };
    });
  } catch (error) {
    console.error("getBlogPost DB error:", error);
    return undefined;
  }
});

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
      }));
    });
  } catch (error) {
    console.error("getTeamMembers DB error:", error);
    return [];
  }
});

// ── Testimonials ──
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    return await withRetry(async () => {
      const items = await db.select().from(testimonials).orderBy(asc(testimonials.order));
      return items.map((t) => ({
        name: t.name,
        company: t.company || "",
        review: t.review,
        stars: t.stars ?? 5,
      }));
    });
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

// ── Site Settings ──
// Settings are per-field overrides on top of static defaults (not a content
// list), so an unset field falling back to its default is correct here —
// unlike the content getters above, this isn't "fake data standing in for an
// empty admin table."
export type SiteSettings = typeof staticSite;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings: SiteSettings = {
    ...staticSite,
    socials: { ...staticSite.socials },
  };

  try {
    const rows = await withRetry(() => db.select().from(siteSettings));
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
