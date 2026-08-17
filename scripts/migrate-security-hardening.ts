import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

async function migrateSecurityHardening() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const sql = neon(databaseUrl);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS request_rate_limits (
      key text PRIMARY KEY,
      count integer NOT NULL DEFAULT 1,
      window_ends_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT request_rate_limits_count_check CHECK (count > 0)
    )
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS request_rate_limits_window_ends_at_idx ON request_rate_limits (window_ends_at)`);

  await sql.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS retention_expires_at timestamptz`);
  await sql.query(`UPDATE job_applications SET retention_expires_at = created_at + interval '180 days' WHERE retention_expires_at IS NULL`);
  await sql.query(`ALTER TABLE job_applications ALTER COLUMN retention_expires_at SET DEFAULT now() + interval '180 days'`);
  await sql.query(`ALTER TABLE job_applications ALTER COLUMN retention_expires_at SET NOT NULL`);
  await sql.query(`CREATE INDEX IF NOT EXISTS job_applications_retention_expires_at_idx ON job_applications (retention_expires_at)`);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS application_status_notifications (
      id serial PRIMARY KEY,
      application_id integer NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
      fingerprint text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await sql.query(`CREATE INDEX IF NOT EXISTS application_status_notifications_application_id_idx ON application_status_notifications (application_id)`);

  await sql.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'member'));
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_stars_check') THEN
        ALTER TABLE testimonials ADD CONSTRAINT testimonials_stars_check CHECK (stars BETWEEN 1 AND 5);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_media_type_check') THEN
        ALTER TABLE testimonials ADD CONSTRAINT testimonials_media_type_check CHECK (media_type IS NULL OR media_type IN ('image', 'video'));
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_applications_status_check') THEN
        ALTER TABLE job_applications ADD CONSTRAINT job_applications_status_check
          CHECK (status IN ('new', 'reviewing', 'shortlisted', 'interview', 'selected', 'rejected'));
      END IF;
    END $$
  `);

  // The old blog CMS was removed from the application. Drop its empty tables,
  // but abort safely if anything has appeared since the pre-migration review.
  const staleTables = await sql.query(`
    SELECT relname FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND relname IN ('blog_posts', 'blog_images') AND relkind = 'r'
  `);
  const staleNames = new Set(staleTables.map((row) => row.relname));
  if (staleNames.has("blog_posts")) {
    const [{ has_rows: hasRows }] = await sql.query(`SELECT EXISTS (SELECT 1 FROM blog_posts LIMIT 1) AS has_rows`);
    if (hasRows) throw new Error("blog_posts is not empty; refusing to drop it");
  }
  if (staleNames.has("blog_images")) {
    const [{ has_rows: hasRows }] = await sql.query(`SELECT EXISTS (SELECT 1 FROM blog_images LIMIT 1) AS has_rows`);
    if (hasRows) throw new Error("blog_images is not empty; refusing to drop it");
  }
  await sql.query(`DROP TABLE IF EXISTS blog_images`);
  await sql.query(`DROP TABLE IF EXISTS blog_posts`);

  console.log("Security hardening migration complete.");
}

migrateSecurityHardening().catch((error) => {
  console.error("Security hardening migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
