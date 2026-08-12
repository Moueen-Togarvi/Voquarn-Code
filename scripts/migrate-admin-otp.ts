import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function migrateAdminOtp() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const sql = neon(databaseUrl);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS "admin_login_challenges" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "email" text NOT NULL,
      "code_hash" text NOT NULL,
      "login_token_hash" text UNIQUE,
      "attempts_remaining" integer DEFAULT 5 NOT NULL,
      "send_count" integer DEFAULT 1 NOT NULL,
      "expires_at" timestamp NOT NULL,
      "resend_available_at" timestamp NOT NULL,
      "verified_at" timestamp,
      "used_at" timestamp,
      "ip_hash" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `);
  await sql.query(`
    CREATE INDEX IF NOT EXISTS "admin_login_challenges_user_created_idx"
    ON "admin_login_challenges" ("user_id", "created_at")
  `);
  await sql.query(`
    CREATE INDEX IF NOT EXISTS "admin_login_challenges_ip_created_idx"
    ON "admin_login_challenges" ("ip_hash", "created_at")
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "admin_login_attempts" (
      "id" serial PRIMARY KEY NOT NULL,
      "ip_hash" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `);
  await sql.query(`
    CREATE INDEX IF NOT EXISTS "admin_login_attempts_ip_created_idx"
    ON "admin_login_attempts" ("ip_hash", "created_at")
  `);
  await sql.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member'`);

  console.log("Admin OTP database schema is ready.");
}

migrateAdminOtp().catch((error) => {
  console.error("Admin OTP migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
