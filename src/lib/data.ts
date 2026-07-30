import { db } from "@/db";
import { blogPosts, services, subServices, portfolioItems, teamMembers, testimonials, faqItems, pricingPlans, siteSettings } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { blogPosts as staticBlogPosts, services as staticServices, portfolioItems as staticPortfolio, team as staticTeam, testimonials as staticTestimonials, faqItems as staticFaq, pricingPlans as staticPricing, site as staticSite } from "@/lib/site-data";
import type { BlogPost, Service, PortfolioItem, TeamMember, Testimonial, FaqItem, PricingPlan } from "@/lib/site-data";

// ── Blog Posts ──
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
    if (posts.length > 0) {
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
    }
  } catch (error) {
    console.error("getBlogPosts DB error, using fallback:", error);
  }
  return staticBlogPosts;
}

export async function getBlogPost(slug: string) {
  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (post) {
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
    }
  } catch {
    // fallback
  }
  return staticBlogPosts.find((p) => p.slug === slug);
}

// ── Services ──
export async function getServices(): Promise<Service[]> {
  try {
    const allServices = await db.select().from(services).orderBy(desc(services.createdAt));
    if (allServices.length > 0) {
      const allSubs = await db.select().from(subServices);
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
    }
  } catch {
    // fallback
  }
  return staticServices;
}

export async function getService(slug: string): Promise<Service | undefined> {
  try {
    const [s] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    if (s) {
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
    }
  } catch {
    // fallback
  }
  return staticServices.find((service) => service.id === slug);
}

// ── Portfolio ──
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
    if (items.length > 0) {
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
    }
  } catch {
    // fallback
  }
  return staticPortfolio;
}

// ── Team ──
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.order));
    if (members.length > 0) {
      return members.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio || "",
      }));
    }
  } catch {
    // fallback
  }
  return staticTeam;
}

// ── Testimonials ──
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items = await db.select().from(testimonials).orderBy(asc(testimonials.order));
    if (items.length > 0) {
      return items.map((t) => ({
        name: t.name,
        company: t.company || "",
        review: t.review,
        stars: t.stars ?? 5,
      }));
    }
  } catch {
    // fallback
  }
  return staticTestimonials;
}

// ── FAQ ──
export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const items = await db.select().from(faqItems).orderBy(asc(faqItems.order));
    if (items.length > 0) {
      return items.map((f) => ({
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch {
    // fallback
  }
  return staticFaq;
}

// ── Pricing ──
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const items = await db.select().from(pricingPlans).orderBy(asc(pricingPlans.order));
    if (items.length > 0) {
      return items.map((p) => ({
        name: p.name,
        description: p.description || "",
        pricePkr: p.pricePkr ?? 0,
        priceUsd: p.priceUsd ?? 0,
        featured: p.featured ?? false,
        features: (p.features as string[]) || [],
      }));
    }
  } catch {
    // fallback
  }
  return staticPricing;
}

// ── Site Settings ──
export type SiteSettings = typeof staticSite;

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings: SiteSettings = {
    ...staticSite,
    socials: { ...staticSite.socials },
  };

  try {
    const rows = await db.select().from(siteSettings);
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
  } catch {
    // fallback to static defaults
  }

  return settings;
}
