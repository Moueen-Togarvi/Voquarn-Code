import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function migrateJobApplications() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in .env");
  }

  const sql = neon(databaseUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS job_applications (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      role text NOT NULL,
      github_url text NOT NULL,
      website_url text,
      message text,
      cv_file_name text NOT NULL,
      cv_mime_type text NOT NULL,
      cv_data text NOT NULL,
      status text NOT NULL DEFAULT 'new',
      status_note text,
      interview_at timestamptz,
      interview_timezone text,
      interview_location text,
      interview_notes text,
      status_updated_at timestamp,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications (status)`;
  await sql`CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON job_applications (created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS job_applications_email_idx ON job_applications (email)`;

  console.log("Job applications migration complete.");
}

migrateJobApplications().catch((error) => {
  console.error("Job applications migration failed:", error);
  process.exit(1);
});
