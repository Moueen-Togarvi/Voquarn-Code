import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { stats, clientLogos, clientCategories } from "../src/db/schema";

dotenv.config({ path: ".env" });

const seedStats = [
  { label: "Projects launched", value: 48, suffix: null, order: 0 },
  { label: "Average response time", value: 12, suffix: "h", order: 1 },
  { label: "Client retention", value: 93, suffix: "%", order: 2 },
  { label: "Team disciplines", value: 5, suffix: null, order: 3 },
];

const seedLogos = [
  { name: "Cents", logoUrl: "/cents-marquee.png", order: 0 },
  { name: "Abayiza", logoUrl: "/client-logo.png", order: 1 },
  { name: "Al Farooq", logoUrl: "/client-logo-3.png", order: 2 },
  { name: "Partner", logoUrl: "/client-logo-4.png", order: 3 },
];

const seedCategories = [
  { label: "Healthcare Clinics", order: 0 },
  { label: "Retail Brands", order: 1 },
  { label: "Educational Institutions", order: 2 },
  { label: "Local Businesses", order: 3 },
  { label: "Startups", order: 4 },
  { label: "E-commerce Stores", order: 5 },
  { label: "Service Providers", order: 6 },
];

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Seeding stats...");
  await db.insert(stats).values(seedStats);
  console.log(`  Inserted ${seedStats.length} stats.`);

  console.log("Seeding client logos...");
  await db.insert(clientLogos).values(seedLogos);
  console.log(`  Inserted ${seedLogos.length} client logos.`);

  console.log("Seeding client categories...");
  await db.insert(clientCategories).values(seedCategories);
  console.log(`  Inserted ${seedCategories.length} client categories.`);

  console.log("✅ Stats and trusted clients seeded.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
