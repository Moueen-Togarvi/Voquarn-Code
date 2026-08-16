import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { jobOpenings } from "../src/db/schema";

dotenv.config({ path: ".env" });

const newJobOpening = {
  title: "Full Stack Developer",
  department: "Engineering",
  location: "Remote",
  type: "Full-time",
  salary: "PKR 30,000/month",
  description:
    "We're hiring a Full Stack Developer to join our remote engineering team. You'll build and ship features across the stack — from backend APIs and database design to polished, responsive frontends. This role requires at least 1 year of hands-on development experience and solid Git/GitHub workflow habits. You should be comfortable with either Node.js or Django on the backend, and either React/Next.js or Svelte/SvelteKit on the frontend. This is a fully remote, full-time position for someone who wants to work on real client projects with fast feedback loops and direct ownership.",
  tags: ["Node.js", "Django", "React", "Next.js", "Svelte", "SvelteKit", "Git", "GitHub", "Remote"],
  order: 0,
};

async function updateContent() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Deleting all existing job openings...");
  await db.delete(jobOpenings);

  console.log("Inserting new job opening: Full Stack Developer...");
  await db.insert(jobOpenings).values(newJobOpening);

  console.log("✅ Content update complete.");
  process.exit(0);
}

updateContent().catch((error) => {
  console.error("Update failed:", error);
  process.exit(1);
});
