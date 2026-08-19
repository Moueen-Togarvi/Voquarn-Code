import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { testimonials } from "../src/db/schema";

dotenv.config({ path: ".env" });

// Source review text transcribed from the client-supplied review graphics
// (Ayesha Khan / Mubashir Mukhtar for the ABAYIZA build, Abdullah Sheikh for
// ZyloWalls) so the aggregate rating / Review schema on the site carries real
// reviewBody text, not a caption written after the fact.
const newTestimonials = [
  {
    name: "Ayesha Khan",
    company: "ABAYIZA",
    review:
      "I'm extremely satisfied with the website developed by Moin Togharvi for our brand, ABAYIZA. He understood our requirements perfectly and created a modern, elegant, professional, and user-friendly website. The overall design, functionality, and attention to detail are outstanding. He was very cooperative, responsive, and professional throughout the entire process. We are genuinely happy with the final result and would highly recommend Moin Togharvi to anyone looking for quality website development.",
    stars: 5,
    mediaUrl: "/uploads/review-ayesha-khan-abayiza.jpg",
    mediaType: "image",
    order: 1,
  },
  {
    name: "Mubashir Mukhtar",
    company: "ABAYIZA",
    review:
      "From start to finish, the entire process of building my Abaya brand's website was smooth, professional, and honestly beyond what I expected. They truly understood my vision and translated it into a website that reflects the elegance and identity of my brand perfectly. What stood out most was how patient and attentive they were throughout, always ready to explain things clearly, take feedback, and make revisions until everything felt just right. The final website is beautiful, fast, easy to navigate, and works flawlessly on both mobile and desktop.",
    stars: 5,
    mediaUrl: "/uploads/review-mubashir-mukhtar-abayiza.jpg",
    mediaType: "image",
    order: 2,
  },
  {
    name: "Abdullah Sheikh",
    company: "ZyloWalls",
    review:
      "Good experience! And honestly I feel easy and calm after converting my store on google. Really appreciated, I really love it. Great experience, smooth process, and outstanding results.",
    stars: 5,
    mediaUrl: "/uploads/review-abdullah-sheikh-zylowalls.jpg",
    mediaType: "image",
    order: 3,
  },
];

// Idempotent on mediaUrl so a retry after a transient network failure
// (Neon's HTTP driver has none) never double-inserts a row.
async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  for (const t of newTestimonials) {
    const [existing] = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(eq(testimonials.mediaUrl, t.mediaUrl))
      .limit(1);

    if (existing) {
      console.log(`Skipped (already present) #${existing.id}: ${t.name}`);
      continue;
    }

    const [row] = await db.insert(testimonials).values(t).returning({ id: testimonials.id, name: testimonials.name });
    console.log(`Inserted testimonial #${row.id}: ${row.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
