/**
 * Replaces the "AI Workflows" service with "CRM & Management Systems".
 *
 * The live services page reads from the database (getServices in src/lib/data.ts
 * has no site-data fallback), so editing src/lib/site-data.ts alone changes
 * nothing on the site — this script pushes that definition into the DB.
 *
 *   npx tsx scripts/migrate-crm-service.ts --dry-run   # show the plan only
 *   npx tsx scripts/migrate-crm-service.ts             # apply it
 *
 * The removed service is written to backups/ first, so it can be restored.
 */
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { services, subServices } from "../src/db/schema";
import { services as seedServices } from "../src/lib/site-data";

dotenv.config({ path: ".env" });

const REMOVE_SLUG = "ai-workflows";
const ADD_SLUG = "crm-systems";
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in .env");

  const source = seedServices.find((s) => s.id === ADD_SLUG);
  if (!source) throw new Error(`${ADD_SLUG} is missing from src/lib/site-data.ts`);

  const db = drizzle(neon(url));
  console.log(dryRun ? "DRY RUN — no writes will happen\n" : "APPLYING CHANGES\n");

  const [old] = await db.select().from(services).where(eq(services.slug, REMOVE_SLUG)).limit(1);
  if (old) {
    const oldSubs = await db.select().from(subServices).where(eq(subServices.serviceId, old.id));
    console.log(`remove: [${old.slug}] ${old.title} (+${oldSubs.length} packages)`);
    for (const sub of oldSubs) console.log(`          - ${sub.name}`);

    if (!dryRun) {
      const dir = path.join(process.cwd(), "backups");
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `${REMOVE_SLUG}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
      fs.writeFileSync(file, JSON.stringify({ service: old, subServices: oldSubs }, null, 2));
      console.log(`          backed up -> ${path.relative(process.cwd(), file)}`);
      // sub_services cascades on service delete.
      await db.delete(services).where(eq(services.id, old.id));
    }
  } else {
    console.log(`remove: [${REMOVE_SLUG}] not present — nothing to remove`);
  }

  // Re-runnable: drop any half-applied CRM service before inserting a fresh one.
  const [existing] = await db.select().from(services).where(eq(services.slug, ADD_SLUG)).limit(1);
  if (existing) {
    console.log(`reset:  [${ADD_SLUG}] already exists — replacing it`);
    if (!dryRun) await db.delete(services).where(eq(services.id, existing.id));
  }

  const packages = source.subServices ?? [];
  console.log(`\nadd:    [${source.id}] ${source.title} (+${packages.length} packages)`);
  for (const sub of packages) {
    console.log(`          - ${sub.name} — PKR ${sub.pricePkr.toLocaleString()} / USD ${sub.priceUsd}`);
  }

  if (dryRun) {
    console.log("\nDry run complete. Re-run without --dry-run to apply.");
    return;
  }

  const [inserted] = await db
    .insert(services)
    .values({
      slug: source.id,
      title: source.title,
      description: source.description,
      deliverables: source.deliverables,
    })
    .returning();

  if (packages.length > 0) {
    await db.insert(subServices).values(
      packages.map((sub, index) => ({
        serviceId: inserted.id,
        slug: sub.id,
        name: sub.name,
        description: sub.description,
        pricePkr: sub.pricePkr,
        priceUsd: sub.priceUsd,
        features: sub.features,
        order: index,
      })),
    );
  }

  console.log("\nDone.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
