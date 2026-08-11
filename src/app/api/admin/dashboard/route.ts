import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  blogPosts,
  services,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  jobOpenings,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [blogCount] = await db.select({ value: count() }).from(blogPosts);
    const [serviceCount] = await db.select({ value: count() }).from(services);
    const [portfolioCount] = await db.select({ value: count() }).from(portfolioItems);
    const [teamCount] = await db.select({ value: count() }).from(teamMembers);
    const [testimonialCount] = await db.select({ value: count() }).from(testimonials);
    const [faqCount] = await db.select({ value: count() }).from(faqItems);
    const [pricingCount] = await db.select({ value: count() }).from(pricingPlans);
    const [careersCount] = await db.select({ value: count() }).from(jobOpenings);

    return NextResponse.json({
      blog: Number(blogCount?.value || 0),
      services: Number(serviceCount?.value || 0),
      portfolio: Number(portfolioCount?.value || 0),
      team: Number(teamCount?.value || 0),
      testimonials: Number(testimonialCount?.value || 0),
      faq: Number(faqCount?.value || 0),
      pricing: Number(pricingCount?.value || 0),
      careers: Number(careersCount?.value || 0),
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    return NextResponse.json(
      {
        blog: 0,
        services: 0,
        portfolio: 0,
        team: 0,
        testimonials: 0,
        faq: 0,
        pricing: 0,
        careers: 0,
      },
      { status: 200 },
    );
  }
}
