import { getSiteUrl } from "@/lib/site-url";
import {
  getServices,
  getFaqItems,
  getPortfolioItems,
  getBlogPosts,
  getSiteSettings,
} from "@/lib/data";

// Regenerated hourly so admin edits reach answer engines without a redeploy.
export const revalidate = 3600;

function formatPrice(pkr: number, usd: number) {
  if (!pkr && !usd) return "";
  const parts: string[] = [];
  if (pkr) parts.push(`PKR ${pkr.toLocaleString("en-PK")}`);
  if (usd) parts.push(`USD ${usd.toLocaleString("en-US")}`);
  return parts.join(" / ");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const abs = (path: string) => new URL(path, siteUrl).toString();

  const [site, services, faqItems, portfolio, posts] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFaqItems(),
    getPortfolioItems(),
    getBlogPosts(),
  ]);

  const lines: string[] = [];

  // ── Identity ──
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(
    `${site.name} is a digital agency based in ${site.location}, serving clients in Pakistan and internationally. We build websites, mobile apps, SaaS products, SEO systems, and AI automation workflows. Pricing is fixed-package and published openly, in both PKR and USD.`,
  );
  lines.push("");
  lines.push(`- Website: ${abs("/")}`);
  lines.push(`- Location: ${site.location}`);
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Phone: ${site.phone}`);
  lines.push(`- WhatsApp: https://wa.me/${site.whatsapp}`);
  lines.push(`- LinkedIn: ${site.socials.linkedin}`);
  lines.push("");

  // ── Services + pricing (the highest-value block for AI answers) ──
  if (services.length > 0) {
    lines.push("## Services and pricing");
    lines.push("");
    for (const service of services) {
      lines.push(`### ${service.title}`);
      lines.push("");
      lines.push(service.description);
      lines.push("");
      lines.push(`Page: ${abs(`/services/${service.id}`)}`);
      if (service.deliverables.length > 0) {
        lines.push(`Deliverables: ${service.deliverables.join(", ")}`);
      }
      lines.push("");
      for (const sub of service.subServices || []) {
        const price = formatPrice(sub.pricePkr, sub.priceUsd);
        lines.push(
          `- **${sub.name}**${price ? ` — starting at ${price}` : ""}: ${sub.description}`,
        );
        if (sub.features.length > 0) {
          lines.push(`  - Includes: ${sub.features.join("; ")}`);
        }
      }
      lines.push("");
    }
  }

  // ── FAQ: verbatim question/answer pairs are what answer engines quote ──
  if (faqItems.length > 0) {
    lines.push("## Frequently asked questions");
    lines.push("");
    for (const item of faqItems) {
      lines.push(`### ${item.question}`);
      lines.push("");
      lines.push(item.answer);
      lines.push("");
    }
  }

  // ── Proof / case studies ──
  if (portfolio.length > 0) {
    lines.push("## Selected work");
    lines.push("");
    for (const item of portfolio) {
      lines.push(
        `- **${item.title}** (${item.category}): ${item.summary}${item.outcome ? ` Outcome: ${item.outcome}` : ""}`,
      );
    }
    lines.push("");
  }

  // ── Key pages ──
  lines.push("## Key pages");
  lines.push("");
  lines.push(`- [Services](${abs("/services")}): Full service catalogue with scope and deliverables.`);
  lines.push(`- [Pricing](${abs("/pricing")}): Starting package prices in PKR and USD.`);
  lines.push(`- [Portfolio](${abs("/portfolio")}): Case studies with measured outcomes.`);
  lines.push(`- [About](${abs("/about")}): How the agency works and what it optimises for.`);
  lines.push(`- [Team](${abs("/team")}): The people delivering the work.`);
  lines.push(`- [Blog](${abs("/blog")}): Articles on SEO, web performance, and AI workflows.`);
  lines.push(`- [Contact](${abs("/contact")}): Project enquiries and quotes.`);
  lines.push("");

  // ── Articles ──
  if (posts.length > 0) {
    lines.push("## Articles");
    lines.push("");
    for (const post of posts.slice(0, 25)) {
      lines.push(`- [${post.title}](${abs(`/blog/${post.slug}`)}): ${post.excerpt}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
