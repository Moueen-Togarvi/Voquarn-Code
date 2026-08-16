import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import {
  services as staticServices,
  portfolioItems as staticPortfolio,
  team as staticTeam,
  testimonials as staticTestimonials,
  faqItems as staticFaq,
  pricingPlans as staticPricing,
} from "../src/lib/site-data";
import {
  services,
  subServices,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  jobOpenings,
} from "../src/db/schema";

dotenv.config({ path: ".env" });

// The careers page had no CMS backing at all — its role list lived only as
// hardcoded JSX. Moving it here so it seeds into the new job_openings table.
const staticJobOpenings = [
  {
    title: "Senior Next.js & AI Engineer",
    department: "Engineering",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$80k - $120k",
    description:
      "Lead the architectural development of high-performance Next.js web applications and autonomous AI agent workflows for our global enterprise clients.",
    tags: ["Next.js 15", "React", "TypeScript", "Python", "AI LLMs"],
  },
  {
    title: "UI/UX Design Director",
    department: "Design",
    location: "Remote / Lahore",
    type: "Full-time",
    salary: "$70k - $100k",
    description:
      "Shape the visual direction, design systems, and conversion-optimized user experiences across all Voquarn Code products and marketing surfaces.",
    tags: ["Figma", "Design Systems", "Prototyping", "Tailwind CSS"],
  },
  {
    title: "Growth & Technical SEO Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $90k",
    description:
      "Drive organic acquisition strategies, technical site audits, schema architectures, and high-intent funnel optimizations for fast-growing brands.",
    tags: ["Technical SEO", "Ahrefs", "Google Analytics", "Conversion Rate"],
  },
  {
    title: "Full Stack Supabase Architect",
    department: "Engineering",
    location: "Remote",
    type: "Contract / Full-time",
    salary: "$75k - $110k",
    description:
      "Design secure multi-tenant database schemas, row-level security policies, and real-time backend integrations for our custom SaaS platforms.",
    tags: ["Supabase", "PostgreSQL", "Node.js", "Edge Functions"],
  },
];

async function seedContent() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Seeding services + sub-services...");
  for (const service of staticServices) {
    const [inserted] = await db
      .insert(services)
      .values({
        slug: service.id,
        title: service.title,
        description: service.description,
        deliverables: service.deliverables,
      })
      .returning();

    if (service.subServices?.length) {
      await db.insert(subServices).values(
        service.subServices.map((sub, index) => ({
          serviceId: inserted.id,
          slug: sub.id,
          name: sub.name,
          description: sub.description,
          pricePkr: sub.pricePkr,
          priceUsd: sub.priceUsd,
          features: sub.features,
          order: index,
        })),
      );
    }
  }

  console.log("Seeding portfolio items...");
  await db.insert(portfolioItems).values(
    staticPortfolio.map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      summary: item.summary,
      outcome: item.outcome,
      stack: item.stack,
      liveUrl: item.liveUrl,
      imageUrl: item.imageUrl,
    })),
  );

  console.log("Seeding team members...");
  await db.insert(teamMembers).values(
    staticTeam.map((member, index) => ({
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: index,
    })),
  );

  console.log("Seeding testimonials...");
  await db.insert(testimonials).values(
    staticTestimonials.map((t, index) => ({
      name: t.name,
      company: t.company,
      review: t.review,
      stars: t.stars,
      order: index,
    })),
  );

  console.log("Seeding FAQ items...");
  await db.insert(faqItems).values(
    staticFaq.map((item, index) => ({
      question: item.question,
      answer: item.answer,
      order: index,
    })),
  );

  console.log("Seeding pricing plans...");
  await db.insert(pricingPlans).values(
    staticPricing.map((plan, index) => ({
      name: plan.name,
      description: plan.description,
      pricePkr: plan.pricePkr,
      priceUsd: plan.priceUsd,
      featured: plan.featured ?? false,
      features: plan.features,
      order: index,
    })),
  );

  console.log("Seeding job openings...");
  await db.insert(jobOpenings).values(
    staticJobOpenings.map((job, index) => ({
      ...job,
      order: index,
    })),
  );

  console.log("✅ Content seed complete.");
  process.exit(0);
}

seedContent().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
