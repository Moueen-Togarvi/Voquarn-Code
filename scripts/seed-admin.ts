import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function seedAdmin() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password === "admin123456" || password.length < 12) {
    console.error(
      "Set ADMIN_EMAIL and a unique ADMIN_PASSWORD with at least 12 characters before seeding.",
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await db.insert(users).values({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`✅ Admin user created:`);
    console.log(`   Email: ${email}`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("unique")) {
      console.log(`⚠️  Admin user already exists with email: ${email}`);
    } else {
      console.error("Error creating admin:", msg);
    }
  }

  process.exit(0);
}

seedAdmin();
