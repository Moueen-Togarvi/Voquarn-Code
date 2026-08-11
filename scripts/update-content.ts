import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { ilike } from "drizzle-orm";
import * as dotenv from "dotenv";
import { blogPosts, jobOpenings } from "../src/db/schema";

dotenv.config({ path: ".env" });

type Node = Record<string, unknown>;

const heading = (level: number, text: string): Node => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const paragraph = (text: string): Node => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});

const bulletList = (items: string[]): Node => ({
  type: "bulletList",
  content: items.map((item) => ({
    type: "listItem",
    content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
  })),
});

function readTimeFor(nodes: Node[]): string {
  const text = JSON.stringify(nodes);
  const words = text.split(/\s+/).length;
  const minutes = Math.max(3, Math.round(words / 900));
  return `${minutes} min read`;
}

const newJobOpening = {
  title: "Full Stack Developer",
  department: "Engineering",
  location: "Remote",
  type: "Full-time",
  salary: "PKR 30,000/month",
  description:
    "We're hiring a Full Stack Developer to join our remote engineering team. You'll build and ship features across the stack — from backend APIs and database design to polished, responsive frontends. This role requires at least 1 year of hands-on development experience and solid Git/GitHub workflow habits. You should be comfortable with either Node.js or Django on the backend, and either React/Next.js or Svelte/SvelteKit on the frontend. This is a fully remote, full-time position for someone who wants to work on real client projects with fast feedback loops and direct ownership.",
  tags: ["Node.js", "Django", "React", "Next.js", "Svelte", "SvelteKit", "Git", "GitHub", "Remote"],
  order: 0,
};

const newBlogPosts = [
  {
    slug: "web-development-company-pakistan-guide",
    title: "Web Development Company in Pakistan: What to Look for in 2026",
    excerpt:
      "A practical checklist for choosing a web development company in Pakistan — from technical stack to pricing transparency and post-launch support.",
    category: "Web Development",
    readTime: "",
    content: [
      paragraph(
        "Choosing a web development company in Pakistan can feel overwhelming — the market is full of freelancers, small studios, and full-service agencies, all claiming to build \"fast, modern, SEO-friendly\" websites. The difference between a website that drives business and one that quietly underperforms usually comes down to a handful of decisions made before a single line of code is written.",
      ),
      heading(2, "1. Ask what they actually build with"),
      paragraph(
        "Modern web development in Pakistan has largely moved past template-based WordPress builds toward frameworks like Next.js, which offer better performance, stronger SEO fundamentals, and more control over how a site scales. If a company can't explain why they chose a particular stack for your project, that's worth noticing.",
      ),
      heading(2, "2. Look for transparent, fixed pricing"),
      paragraph(
        "A trustworthy web development company in Pakistan will give you clear package pricing — in both PKR and USD if you're working with an international team — rather than vague hourly estimates that balloon mid-project. Fixed-scope packages make it easier to plan a budget and hold the vendor accountable to deliverables.",
      ),
      heading(2, "3. Check their approach to performance and SEO"),
      paragraph(
        "A beautiful website that loads slowly or ranks nowhere on Google isn't doing its job. Ask how the agency handles Core Web Vitals, image optimization, structured data (schema.org), and technical SEO basics like sitemaps and clean URL structures. These aren't extras — they should be part of every build.",
      ),
      heading(2, "4. What to expect from a good agency"),
      bulletList([
        "A discovery phase that maps your business goals to the site structure, not just a design mockup",
        "Mobile-first, responsive design tested across real devices",
        "Fast page loads — Next.js sites should score well on Lighthouse out of the box",
        "Clear post-launch support terms, not a one-time handoff",
        "A CMS or admin panel you can actually use without calling the developer every time",
      ]),
      heading(2, "5. Post-launch support matters more than the launch itself"),
      paragraph(
        "Websites need updates — new content, new services, seasonal promotions, bug fixes as browsers evolve. A web development company in Pakistan worth hiring will offer ongoing support packages or at minimum a documented, easy way for your team to make small changes without needing a developer for every edit.",
      ),
      paragraph(
        "The right partner treats your website as a growth asset, not a one-off project. If you're evaluating agencies right now, ask each one to walk you through a past project end-to-end — the questions they ask (or don't ask) will tell you most of what you need to know.",
      ),
    ],
  },
  {
    slug: "mobile-app-development-native-vs-cross-platform",
    title: "Mobile App Development: Native vs Cross-Platform for Startups",
    excerpt:
      "Native or cross-platform? A clear breakdown of when each approach makes sense for startups building their first mobile app.",
    category: "App Development",
    readTime: "",
    content: [
      paragraph(
        "One of the first real decisions in mobile app development is whether to build natively for each platform (Swift for iOS, Kotlin for Android) or use a cross-platform framework like React Native that ships to both from a single codebase. For most startups, this decision affects budget, timeline, and how fast you can iterate — so it's worth getting right early.",
      ),
      heading(2, "What native development gets you"),
      paragraph(
        "Native apps have direct access to platform APIs and typically deliver the smoothest possible performance and the most polished platform-specific feel. For apps that lean heavily on device hardware — camera-intensive apps, AR features, or apps requiring cutting-edge OS integrations — native is often the safer long-term choice.",
      ),
      heading(2, "What cross-platform development gets you"),
      paragraph(
        "Cross-platform app development, particularly with React Native, lets a single engineering team ship to iOS and Android from one codebase. For most business apps — booking platforms, marketplaces, service apps, internal tools — the performance difference is negligible to end users, while the development cost and time-to-market improve significantly.",
      ),
      heading(2, "How to decide"),
      bulletList([
        "Building an MVP to validate an idea fast? Cross-platform gets you to market sooner with a smaller budget.",
        "Building something hardware-intensive (AR, advanced camera work, background processing)? Lean native.",
        "Limited engineering budget? One cross-platform codebase beats maintaining two native codebases.",
        "Planning to scale to a large, well-funded product? Native may pay off long-term, but many successful apps launch cross-platform and stay that way.",
      ]),
      heading(2, "The real cost comparison"),
      paragraph(
        "Native development effectively means building and maintaining two separate apps — two codebases, two release cycles, often two specialized engineers. Cross-platform app development typically cuts both development cost and ongoing maintenance meaningfully, which is why most startups start there and only move to native if a specific technical need forces the decision later.",
      ),
      paragraph(
        "There's no universally correct answer — the right choice depends on what your app actually needs to do, not which approach sounds more advanced. A good app development partner will ask about your product goals and budget before recommending a stack, not the other way around.",
      ),
    ],
  },
  {
    slug: "saas-mvp-development-guide",
    title: "How to Build a SaaS MVP That Investors and Users Both Love",
    excerpt:
      "A practical guide to scoping, building, and launching a SaaS MVP that proves your idea without burning your entire runway.",
    category: "SaaS Development",
    readTime: "",
    content: [
      paragraph(
        "A SaaS MVP has one job: prove that real users will pay for the core value of your idea, with the smallest amount of engineering effort possible. Too many founders either overbuild — spending six months on features nobody asked for — or underbuild, shipping something so thin it can't actually demonstrate value. Getting the scope right is the entire game.",
      ),
      heading(2, "Start with the one problem, not the whole product"),
      paragraph(
        "Every successful SaaS product eventually becomes a suite of features. Your MVP should not try to be that suite. Identify the single core workflow that solves your target user's most painful problem, and build only what's needed to deliver that workflow end-to-end — including billing, since \"will they pay\" is the actual question you're testing.",
      ),
      heading(2, "The technical foundation that scales"),
      paragraph(
        "Even an MVP benefits from a foundation that won't need to be rebuilt after your first 50 customers. Secure authentication, a properly structured multi-tenant database, and a clean billing integration (Stripe or similar) are worth doing right from day one — retrofitting these later, once you have live customer data, is far more expensive than building them correctly up front.",
      ),
      heading(2, "What a lean, investor-ready MVP includes"),
      bulletList([
        "User authentication and account management — the basics, not a custom-built identity system",
        "The one core workflow that delivers your product's value proposition",
        "A working payment/subscription flow, even if pricing tiers are simple at launch",
        "Basic analytics so you can see what users actually do, not just what they say",
        "A simple onboarding flow — most early churn happens before a user reaches the \"aha\" moment",
      ]),
      heading(2, "Timeline and budget expectations"),
      paragraph(
        "A well-scoped SaaS MVP typically takes 4-8 weeks to build with an experienced team, not six months. If a proposal timeline looks much longer than that, the scope is probably too broad. The goal is to get real users interacting with a working product as fast as possible, then let their behavior — not your assumptions — drive the next round of features.",
      ),
      paragraph(
        "Investors don't fund polished feature lists; they fund evidence that people want what you're building. A tightly scoped MVP that gets real usage data beats a feature-complete product that took a year and never left the drawing board.",
      ),
    ],
  },
  {
    slug: "ai-automation-small-business-guide",
    title: "AI Automation for Small Businesses: Where to Start",
    excerpt:
      "AI automation doesn't have to mean building a custom model. Here's where small businesses actually see fast, measurable returns.",
    category: "AI Automation",
    readTime: "",
    content: [
      paragraph(
        "\"AI automation\" often sounds like it requires a data science team and a six-figure budget. In practice, most of the value small businesses get from AI automation today comes from much simpler wins: automating repetitive, rules-based work that's currently eating hours of staff time every week.",
      ),
      heading(2, "The highest-ROI starting points"),
      paragraph(
        "Before building anything custom, look at the workflows your team repeats manually every day — responding to common customer questions, qualifying inbound leads, summarizing support tickets, or moving data between disconnected tools. These are exactly the tasks AI automation handles well, and they're usually the fastest to implement.",
      ),
      heading(2, "Customer-facing automation: chatbots done right"),
      paragraph(
        "A well-built AI chatbot handles the 70-80% of customer questions that are genuinely repetitive — order status, business hours, pricing basics, how a service works — and routes the rest to a human. Done properly, this doesn't feel like a wall between the customer and your business; it feels like getting an instant, accurate answer at 2am when your team is offline.",
      ),
      heading(2, "Internal automation: where the time savings hide"),
      bulletList([
        "Auto-triaging and summarizing inbound support tickets or emails before a human reads them",
        "Lead scoring — flagging high-intent inquiries so sales follows up first, not last",
        "Automatically drafting responses to common inquiries for a human to review and send",
        "Syncing data between tools that don't natively talk to each other (CRM, invoicing, project management)",
        "Generating first-draft reports or summaries from raw data instead of manual compilation",
      ]),
      heading(2, "How to start without overcommitting"),
      paragraph(
        "Pick one workflow, automate it, measure the time saved, and only then decide whether to expand. AI automation agencies that push a large, all-in-one platform before understanding your actual workflows are optimizing for their own project size, not your outcome. A single well-implemented automation that saves 10 hours a week is worth more than five half-finished ones.",
      ),
      paragraph(
        "The businesses getting the most value from AI automation right now aren't necessarily the most technical ones — they're the ones that started with a clearly defined, high-friction task and automated it properly before moving to the next.",
      ),
    ],
  },
  {
    slug: "freelancer-vs-agency-comparison",
    title: "Freelancer vs Agency: Who Should Build Your Next Digital Product",
    excerpt:
      "Freelancers and agencies both build great products — for different situations. Here's how to know which fits your project.",
    category: "Agency Insights",
    readTime: "",
    content: [
      paragraph(
        "This is one of the most common decisions founders and business owners face before starting a website, app, or software project: hire an individual freelancer, or work with an agency. Both can produce excellent results — the right choice depends less on quality and more on the shape and risk profile of your project.",
      ),
      heading(2, "When a freelancer makes sense"),
      paragraph(
        "For small, well-defined tasks — a landing page, a specific feature addition, a design refresh — a skilled freelancer is often faster and cheaper than an agency, with less process overhead. If your project has a narrow, single-discipline scope and you're comfortable managing the work yourself, freelance is a reasonable fit.",
      ),
      heading(2, "When an agency makes more sense"),
      paragraph(
        "Once a project needs more than one discipline working together — design, frontend, backend, SEO, project management — coordination becomes a real cost. An agency brings a team that already works together, with built-in accountability if someone is unavailable, and a structured process for scoping, building, and supporting the product after launch.",
      ),
      heading(2, "The risk factor most people underweight"),
      bulletList([
        "A freelancer who gets sick, changes priorities, or disappears mid-project leaves you with no fallback",
        "An agency has redundancy — if one team member is out, the project doesn't stall",
        "Agencies typically carry post-launch support commitments; many freelance engagements end at handoff",
        "Multi-discipline projects (a real product, not a single page) usually need more than one skill set done well",
      ]),
      heading(2, "A practical way to decide"),
      paragraph(
        "Ask yourself three questions: Does this project need more than one specialized skill to do well? Do I need reliable support after launch, not just at delivery? Is the cost of the project failing or stalling high enough that redundancy is worth paying for? If you answered yes to any of these, an agency is usually the safer structural choice — not because freelancers aren't skilled, but because the project itself needs more coordination than one person managing multiple hats can reliably provide.",
      ),
      paragraph(
        "Neither option is universally \"better.\" The right call comes down to matching the structure of the work to the structure of who's building it.",
      ),
    ],
  },
];

async function updateContent() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Deleting all existing job openings...");
  await db.delete(jobOpenings);

  console.log("Inserting new job opening: Full Stack Developer...");
  await db.insert(jobOpenings).values(newJobOpening);

  console.log("Deleting SEO-category blog post(s)...");
  const deleted = await db
    .delete(blogPosts)
    .where(ilike(blogPosts.category, "SEO Articles"))
    .returning({ slug: blogPosts.slug });
  console.log(`Deleted ${deleted.length} post(s):`, deleted.map((d) => d.slug).join(", ") || "none");

  console.log("Inserting new blog posts...");
  const now = new Date();
  for (const post of newBlogPosts) {
    const readTime = readTimeFor(post.content);
    await db.insert(blogPosts).values({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      content: post.content,
      published: true,
      publishedAt: now,
      readTime,
    });
    console.log(`  Inserted "${post.title}" (${readTime})`);
  }

  console.log("✅ Content update complete.");
  process.exit(0);
}

updateContent().catch((error) => {
  console.error("Update failed:", error);
  process.exit(1);
});
