export type NavItem = {
  href: string;
  label: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
};

export type PortfolioItem = {
  slug: string;
  title: string;
  category: "Web Development" | "App Development" | "SEO" | "AI Solutions" | "Graphic Design";
  summary: string;
  outcome: string;
  stack: string[];
  liveUrl: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

export type Testimonial = {
  name: string;
  company: string;
  review: string;
  stars: number;
};

export type PricingPlan = {
  name: string;
  description: string;
  pricePkr: number;
  priceUsd: number;
  featured?: boolean;
  features: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  sections: string[];
};

export const site = {
  name: "Voquarn Code",
  location: "Lahore, Pakistan",
  email: "hello@voquarn.com",
  phone: "+92 300 1234567",
  whatsapp: "923001234567",
  socials: {
    linkedin: "https://www.linkedin.com/company/voquarn-code",
    instagram: "https://www.instagram.com/voquarncode",
    facebook: "https://www.facebook.com/voquarncode",
  },
  description:
    "Voquarn Code designs growth-ready websites, apps, SEO systems, and AI workflows for businesses that want sharp execution and clear outcomes.",
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const services: Service[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description:
      "High-performance websites built with Next.js and React for maximum speed, security, and conversion.",
    deliverables: ["Custom Websites", "Landing Pages", "Performance Optimization", "E-commerce"],
  },
  {
    id: "app-dev",
    title: "App Development",
    description:
      "Native and cross-platform mobile applications that provide seamless user experiences and robust functionality.",
    deliverables: ["iOS & Android Apps", "React Native", "API Integration", "App Store Launch"],
  },
  {
    id: "saas-apps",
    title: "SaaS Applications",
    description:
      "End-to-end development of scalable Software as a Service products with secure multi-tenant architectures.",
    deliverables: ["SaaS Architecture", "Subscription Systems", "User Dashboards", "Cloud Scaling"],
  },
  {
    id: "ai-workflows",
    title: "AI Workflows",
    description:
      "Automated business processes, intelligent AI assistant integrations, and smart agent applications.",
    deliverables: ["AI Integration", "Process Automation", "Custom Agents", "Smart Workflows"],
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "atlas-health",
    title: "Atlas Health Booking Platform",
    category: "Web Development",
    summary: "A healthcare booking experience with service discovery, trust-building content, and appointment capture.",
    outcome: "32% increase in completed bookings within eight weeks of launch.",
    stack: ["Next.js", "Tailwind CSS", "Forms", "SEO"],
    liveUrl: "https://example.com/atlas-health",
  },
  {
    slug: "routewise-field-app",
    title: "RouteWise Field App",
    category: "App Development",
    summary: "A field operations app for scheduling technicians, tracking updates, and reducing dispatch confusion.",
    outcome: "Cut missed service windows by 41% for a regional operations team.",
    stack: ["TypeScript", "App flows", "Dashboards"],
    liveUrl: "https://example.com/routewise",
  },
  {
    slug: "nexa-search-growth",
    title: "Nexa Search Growth Sprint",
    category: "SEO",
    summary: "A technical SEO and content roadmap for a B2B services brand with weak organic visibility.",
    outcome: "Doubled top-10 keyword coverage across priority service pages.",
    stack: ["SEO audit", "Content strategy", "Schema"],
    liveUrl: "https://example.com/nexa-growth",
  },
  {
    slug: "signaldesk-ai",
    title: "SignalDesk AI Assistant",
    category: "AI Solutions",
    summary: "An internal AI assistant that summarized support issues and routed them to the right teams.",
    outcome: "Saved support managers roughly 11 hours per week in triage time.",
    stack: ["Automation", "Prompt design", "Internal tooling"],
    liveUrl: "https://example.com/signaldesk-ai",
  },
  {
    slug: "saffron-brand-kit",
    title: "Saffron Brand Kit",
    category: "Graphic Design",
    summary: "A full visual refresh for a premium catering brand rolling out a new online presence.",
    outcome: "Improved proposal close rate with a more cohesive pitch and digital presentation.",
    stack: ["Identity", "Marketing assets", "Web visuals"],
    liveUrl: "https://example.com/saffron-brand",
  },
];

export const stats = [
  { label: "Projects launched", value: 48 },
  { label: "Average response time", value: 12, suffix: "h" },
  { label: "Client retention", value: 93, suffix: "%" },
  { label: "Team disciplines", value: 5 },
];

export const testimonials: Testimonial[] = [
  {
    name: "Areeba Malik",
    company: "Nexa Advisory",
    review:
      "Voquarn gave us structure, speed, and clarity. The site finally feels aligned with the quality of our actual service.",
    stars: 5,
  },
  {
    name: "Hassan Javed",
    company: "Atlas Health",
    review:
      "They balanced design and delivery really well. Our team had a clear view of progress and the launch landed smoothly.",
    stars: 5,
  },
  {
    name: "Sana Riaz",
    company: "SignalDesk",
    review:
      "The AI workflow they mapped for us was practical from day one instead of being a flashy demo with no operational value.",
    stars: 5,
  },
];

export const team: TeamMember[] = [
  {
    name: "Moueen Togarvi",
    role: "Founder & Technical Lead",
    bio: "Builds the architecture, delivery system, and engineering direction behind every engagement.",
  },
  {
    name: "Aiman Tariq",
    role: "Design Director",
    bio: "Shapes the visual language, UX decisions, and consistency across product and marketing surfaces.",
  },
  {
    name: "Saad Ahmed",
    role: "Growth Strategist",
    bio: "Connects SEO, funnel design, and content strategy to measurable acquisition goals.",
  },
  {
    name: "Mahnoor Ali",
    role: "Client Success Manager",
    bio: "Keeps communication clear, timelines healthy, and launches coordinated with client teams.",
  },
];

export const values = [
  "Clarity before complexity",
  "Fast feedback loops",
  "Design that supports decisions",
  "Systems that can scale with the business",
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Launch",
    description: "For startups and small businesses that need a sharp first digital presence.",
    pricePkr: 180000,
    priceUsd: 650,
    features: ["5-page website", "Lead form setup", "Basic SEO structure", "2 weeks support"],
  },
  {
    name: "Growth",
    description: "For teams ready to invest in a stronger funnel, richer content, and better automation.",
    pricePkr: 420000,
    priceUsd: 1500,
    featured: true,
    features: ["10+ pages", "Portfolio or blog", "Advanced SEO", "CRM or WhatsApp workflow"],
  },
  {
    name: "Scale",
    description: "For brands that need custom workflows, AI support, and a more ambitious digital system.",
    pricePkr: 850000,
    priceUsd: 3000,
    features: ["Custom web app scope", "AI workflow discovery", "Priority support", "Growth reporting"],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "technical-seo-basics-for-service-sites",
    title: "Technical SEO Basics for Service Websites That Want Better Leads",
    excerpt: "A practical guide to fixing structure, speed, and metadata issues before scaling content production.",
    category: "SEO Articles",
    publishedAt: "2026-04-14",
    readTime: "6 min read",
    sections: [
      "Most service sites do not have a traffic problem first. They usually have a clarity problem. If your page structure, metadata, and internal linking are weak, content has less room to perform.",
      "Start with service pages that map closely to real buyer intent. Each page should explain the offer, proof, next step, and location relevance without stuffing keywords unnaturally.",
      "Then work through technical basics: page titles, headings, crawlable navigation, image compression, structured internal links, and a contact path that is easy to complete on mobile.",
    ],
  },
  {
    slug: "when-to-build-a-client-portal",
    title: "When a Client Portal Starts Paying for Itself",
    excerpt: "Signs that your business is ready to replace scattered updates and manual coordination with a shared product surface.",
    category: "Tech Tips",
    publishedAt: "2026-03-28",
    readTime: "5 min read",
    sections: [
      "Client portals make sense when your team repeatedly shares the same files, approval requests, progress notes, or service updates through fragmented channels.",
      "The return is not just time saved. A portal often improves trust because clients can see status, expectations, and documents in one predictable place.",
      "Before building one, identify the high-friction workflows first. Good product scope removes recurring confusion instead of digitizing a broken process.",
    ],
  },
  {
    slug: "using-ai-without-breaking-operations",
    title: "Using AI Without Breaking the Way Your Team Actually Works",
    excerpt: "A grounded approach to AI adoption that starts with operations, not hype.",
    category: "Tech Tips",
    publishedAt: "2026-02-19",
    readTime: "7 min read",
    sections: [
      "The strongest AI projects begin with repetitive work that already has rough structure: triage, summarization, drafting, categorization, or routing.",
      "Teams get into trouble when they try to replace judgment-heavy steps too early. Start by reducing friction around the humans who still own the final decision.",
      "Measure adoption in hours saved, turnaround time, and error reduction. If those numbers improve, the AI layer is helping. If not, the workflow likely needs redesign.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getService(id: string) {
  return services.find((service) => service.id === id);
}
