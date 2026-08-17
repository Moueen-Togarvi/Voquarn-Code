import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.APP_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("APP_DATABASE_URL or DATABASE_URL must be configured");

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
