import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

async function cleanupExpiredApplications() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const sql = neon(databaseUrl);
  const deleted = await sql.query(
    `DELETE FROM job_applications WHERE retention_expires_at <= now() RETURNING id`,
  );
  console.log(`Deleted ${deleted.length} expired job application(s).`);
}

cleanupExpiredApplications().catch((error) => {
  console.error("Application retention cleanup failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
