const locationKeywords = [
  "Pakistan",
  "Bahawalnagar",
  "Punjab Pakistan",
  "remote agency",
];

const serviceClusters: Array<{ match: RegExp; keywords: string[] }> = [
  {
    match: /seo|search/i,
    keywords: [
      "technical SEO services",
      "local SEO agency Pakistan",
      "SEO audit services",
      "on-page SEO company",
      "ecommerce SEO Pakistan",
      "SEO content strategy",
    ],
  },
  {
    match: /ai|automation|agent|workflow/i,
    keywords: [
      "AI automation agency Pakistan",
      "AI agent development",
      "business process automation",
      "custom AI chatbot development",
      "AI workflow integration",
      "generative AI development company",
    ],
  },
  {
    match: /saas|software|portal/i,
    keywords: [
      "SaaS development company Pakistan",
      "SaaS MVP development",
      "custom client portal development",
      "multi-tenant SaaS application",
      "custom software development",
      "startup product development agency",
    ],
  },
  {
    match: /app|mobile|android|ios/i,
    keywords: [
      "mobile app development company Pakistan",
      "Android app development",
      "iOS app development",
      "cross-platform app development",
      "React Native app agency",
      "business mobile app development",
    ],
  },
  {
    match: /brand|design|ui|ux/i,
    keywords: [
      "UI UX design agency Pakistan",
      "website design company Pakistan",
      "brand identity design",
      "product design services",
      "conversion focused web design",
      "SaaS UI UX design",
    ],
  },
  {
    match: /web|ecommerce|next/i,
    keywords: [
      "web development company Pakistan",
      "Next.js development agency",
      "custom website development",
      "ecommerce website development Pakistan",
      "business website design",
      "fast SEO friendly website development",
    ],
  },
];

export function serviceKeywordCluster(title: string, id = "") {
  const subject = `${title} ${id}`;
  const matched = serviceClusters
    .filter((cluster) => cluster.match.test(subject))
    .flatMap((cluster) => cluster.keywords);

  return Array.from(
    new Set([
      `${title} services`,
      `${title} company Pakistan`,
      `${title} agency Pakistan`,
      `hire ${title.toLowerCase()} experts`,
      ...matched,
      ...locationKeywords.map((location) => `${title} ${location}`),
    ]),
  );
}

export function articleKeywordCluster(title: string, category: string) {
  // Article-specific research belongs in frontmatter; avoid unrelated generic
  // location and service phrases on every post.
  return Array.from(new Set([title, category])).filter(Boolean);
}
