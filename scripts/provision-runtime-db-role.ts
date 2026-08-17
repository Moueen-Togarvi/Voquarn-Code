import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

async function provisionRuntimeRole() {
  const ownerUrl = process.env.DATABASE_URL;
  const password = process.env.APP_DATABASE_PASSWORD;
  if (!ownerUrl) throw new Error("DATABASE_URL is not configured");
  if (!password || password.length < 32) {
    throw new Error("APP_DATABASE_PASSWORD must contain at least 32 characters");
  }

  const sql = neon(ownerUrl);
  await sql.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'voquarn_app') THEN
        CREATE ROLE voquarn_app LOGIN;
      END IF;
    END $$
  `);
  const [{ statement: passwordStatement }] = await sql.query(
    `SELECT format('ALTER ROLE voquarn_app PASSWORD %L', $1) AS statement`,
    [password],
  );
  await sql.query(passwordStatement);
  const [{ statement: connectStatement }] = await sql.query(
    `SELECT format('GRANT CONNECT ON DATABASE %I TO voquarn_app', current_database()) AS statement`,
  );
  await sql.query(connectStatement);
  await sql.query(`GRANT USAGE ON SCHEMA public TO voquarn_app`);
  await sql.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO voquarn_app`);
  await sql.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO voquarn_app`);
  await sql.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO voquarn_app`);
  await sql.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO voquarn_app`);

  const url = new URL(ownerUrl);
  console.log("Restricted runtime role created. Set APP_DATABASE_URL in your deployment environment.");
  console.log(`Host: ${url.host}; database: ${url.pathname.slice(1)}; user: voquarn_app; sslmode: ${url.searchParams.get("sslmode") || "unspecified"}`);
}

provisionRuntimeRole().catch((error) => {
  console.error("Runtime role provisioning failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
