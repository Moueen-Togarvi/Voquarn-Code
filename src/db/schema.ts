import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─────────────────────────────────────────────
// Auth tables (compatible with next-auth DrizzleAdapter)
// ─────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    role: text("role").notNull().default("member"), // admin | member
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    check("users_role_check", sql`${table.role} in ('admin', 'member')`),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    uniqueIndex("accounts_provider_provider_account_id_key").on(
      table.provider,
      table.providerAccountId,
    ),
  ],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("verification_tokens_token_key").on(table.token),
  ],
);

// Short-lived challenges used by the admin password + email OTP flow. Codes
// and one-time login grants are HMAC hashes, so a database read cannot reveal
// a usable credential.
export const adminLoginChallenges = pgTable(
  "admin_login_challenges",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    codeHash: text("code_hash").notNull(),
    loginTokenHash: text("login_token_hash").unique(),
    attemptsRemaining: integer("attempts_remaining").notNull().default(5),
    sendCount: integer("send_count").notNull().default(1),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    resendAvailableAt: timestamp("resend_available_at", { mode: "date" }).notNull(),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    usedAt: timestamp("used_at", { mode: "date" }),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("admin_login_challenges_user_created_idx").on(table.userId, table.createdAt),
    index("admin_login_challenges_ip_created_idx").on(table.ipHash, table.createdAt),
  ],
);

// Failed password attempts are kept separately so brute-force protection also
// works across serverless instances without storing raw client IP addresses.
export const adminLoginAttempts = pgTable(
  "admin_login_attempts",
  {
    id: serial("id").primaryKey(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("admin_login_attempts_ip_created_idx").on(table.ipHash, table.createdAt)],
);

// Shared, database-backed rate-limit buckets. Keeping these in Postgres makes
// abuse protection consistent across serverless instances and deployments.
export const requestRateLimits = pgTable(
  "request_rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(1),
    windowEndsAt: timestamp("window_ends_at", { mode: "date", withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("request_rate_limits_window_ends_at_idx").on(table.windowEndsAt),
    check("request_rate_limits_count_check", sql`${table.count} > 0`),
  ],
);

// ─────────────────────────────────────────────
// CMS Content tables
// ─────────────────────────────────────────────

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    deliverables: jsonb("deliverables").$type<string[]>(),
    icon: text("icon"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("services_slug_idx").on(table.slug)],
);

export const subServices = pgTable(
  "sub_services",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
      .references(() => services.id, { onDelete: "cascade" })
      .notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    pricePkr: integer("price_pkr"),
    priceUsd: integer("price_usd"),
    features: jsonb("features").$type<string[]>(),
    order: integer("order").default(0),
  },
  (table) => [index("sub_services_service_id_idx").on(table.serviceId)],
);

export const portfolioItems = pgTable(
  "portfolio_items",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    summary: text("summary"),
    outcome: text("outcome"),
    stack: jsonb("stack").$type<string[]>(),
    liveUrl: text("live_url"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("portfolio_items_slug_idx").on(table.slug)],
);

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  email: text("email"),
  facebookUrl: text("facebook_url"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    review: text("review").notNull(),
    stars: integer("stars").default(5),
    mediaUrl: text("media_url"),
    mediaType: text("media_type"), // "image" | "video" | null
    order: integer("order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("testimonials_stars_check", sql`${table.stars} between 1 and 5`),
    check("testimonials_media_type_check", sql`${table.mediaType} is null or ${table.mediaType} in ('image', 'video')`),
  ],
);

export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pricePkr: integer("price_pkr"),
  priceUsd: integer("price_usd"),
  featured: boolean("featured").default(false),
  features: jsonb("features").$type<string[]>(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const jobOpenings = pgTable("job_openings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  salary: text("salary"),
  description: text("description").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    role: text("role").notNull(),
    githubUrl: text("github_url").notNull(),
    websiteUrl: text("website_url"),
    message: text("message"),
    cvFileName: text("cv_file_name").notNull(),
    cvMimeType: text("cv_mime_type").notNull(),
    cvData: text("cv_data").notNull(),
    status: text("status").notNull().default("new"),
    statusNote: text("status_note"),
    interviewAt: timestamp("interview_at", { mode: "date", withTimezone: true }),
    interviewTimezone: text("interview_timezone"),
    interviewLocation: text("interview_location"),
    interviewNotes: text("interview_notes"),
    statusUpdatedAt: timestamp("status_updated_at", { mode: "date" }),
    retentionExpiresAt: timestamp("retention_expires_at", { mode: "date", withTimezone: true })
      .default(sql`now() + interval '180 days'`)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("job_applications_status_idx").on(table.status),
    index("job_applications_created_at_idx").on(table.createdAt),
    index("job_applications_email_idx").on(table.email),
    index("job_applications_retention_expires_at_idx").on(table.retentionExpiresAt),
    check(
      "job_applications_status_check",
      sql`${table.status} in ('new', 'reviewing', 'shortlisted', 'interview', 'selected', 'rejected')`,
    ),
  ],
);

export const applicationStatusNotifications = pgTable(
  "application_status_notifications",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => jobApplications.id, { onDelete: "cascade" }),
    fingerprint: text("fingerprint").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("application_status_notifications_application_id_idx").on(table.applicationId)],
);

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: integer("value").notNull(),
  suffix: text("suffix"),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client logo marquee on the homepage ("Teams we've worked with").
export const clientLogos = pgTable("client_logos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Text category chips shown in the second row of the same homepage section
// (e.g. "Healthcare Clinics", "Retail Brands") — independent of client_logos.
export const clientCategories = pgTable("client_categories", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for db.query support
export const servicesRelations = {
  services,
  subServices,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  jobApplications,
  stats,
  clientLogos,
    clientCategories,
    requestRateLimits,
    applicationStatusNotifications,
  };
