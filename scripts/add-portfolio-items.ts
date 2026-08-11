import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { portfolioItems } from "../src/db/schema";

dotenv.config({ path: ".env" });

const newPortfolioItems = [
  {
    slug: "zylowalls",
    title: "ZyloWalls",
    category: "Ecommerce",
    summary: "A premium wall decor ecommerce store selling handcrafted acrylic calligraphy, wooden panels, and wall art with nationwide delivery and cash-on-delivery checkout.",
    outcome: "Launched a full product catalog, collections browsing, and cart-to-checkout flow for a growing home decor brand.",
    stack: ["Ecommerce", "Product catalog", "Checkout"],
    liveUrl: "https://zylowalls.com",
    imageUrl: "/uploads/zylowalls-portfolio.png",
  },
  {
    slug: "abayiza",
    title: "Abayiza",
    category: "Ecommerce",
    summary: "A modest fashion atelier ecommerce site for abayas, built around lookbook-style storytelling, collections, and a full size guide.",
    outcome: "Delivered a polished, editorial-style storefront with collection browsing and size-guide support to reduce return-driving sizing confusion.",
    stack: ["Ecommerce", "Collections", "Size guide"],
    liveUrl: "https://abayiza.com",
    imageUrl: "/uploads/abayiza-portfolio.png",
  },
  {
    slug: "shahzad-abayas",
    title: "Shahzad Abaya's",
    category: "Ecommerce",
    summary: "A wholesale-focused abaya ecommerce store with bulk order and reseller pricing support alongside standard retail checkout.",
    outcome: "Built a dual retail/wholesale storefront with WhatsApp-driven bulk order inquiries and a full product and collections catalog.",
    stack: ["Ecommerce", "Wholesale pricing", "WhatsApp integration"],
    liveUrl: "https://shahzadabayas.com",
    imageUrl: "/uploads/shahzad-abayas-portfolio.png",
  },
];

async function addPortfolioItems() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Inserting new portfolio items...");
  for (const item of newPortfolioItems) {
    const [inserted] = await db.insert(portfolioItems).values(item).returning({ slug: portfolioItems.slug });
    console.log(`  Inserted "${item.title}" (${inserted.slug})`);
  }

  console.log("✅ Portfolio items added.");
  process.exit(0);
}

addPortfolioItems().catch((error) => {
  console.error("Insert failed:", error);
  process.exit(1);
});
