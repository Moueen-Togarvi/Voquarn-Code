import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
  (table) => [uniqueIndex("users_email_key").on(table.email)],
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

// ─────────────────────────────────────────────
// CMS Content tables
// ─────────────────────────────────────────────

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: jsonb("content").$type<Record<string, unknown>[]>(), // TipTap JSON
    coverImage: text("cover_image"),
    category: text("category"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { mode: "date" }),
    readTime: text("read_time"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("blog_posts_slug_idx").on(table.slug)],
);

export const blogImages = pgTable("blog_images", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id")
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
});

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

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  review: text("review").notNull(),
  stars: integer("stars").default(5),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"), // "image" | "video" | null
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
  blogPosts,
  services,
  subServices,
  portfolioItems,
  teamMembers,
  testimonials,
  faqItems,
  pricingPlans,
  stats,
  clientLogos,
  clientCategories,
};
