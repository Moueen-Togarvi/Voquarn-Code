export type NavItem = {
  href: string;
  label: string;
};

export type SubService = {
  id: string;
  name: string;
  description: string;
  pricePkr: number;
  priceUsd: number;
  features: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  subServices?: SubService[];
};

export type PortfolioItem = {
  slug: string;
  title: string;
  category: "Web Development" | "App Development" | "SEO" | "AI Solutions" | "Graphic Design";
  summary: string;
  outcome: string;
  stack: string[];
  liveUrl: string;
  imageUrl: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
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
  location: "Bahawalnagar, Punjab, Pakistan",
  email: "hello@voquarn.com",
  phone: "+92 324 1940988",
  whatsapp: "923241940988",
  logoPath: "/finalvoquarn-logo.png",
  iconPath: "/finalvoquarn-logo.png",
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
  { href: "/pricing", label: "Pricing" },
  { href: "/team", label: "Our Team" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const services: Service[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description:
      "Beautiful, fast websites that help your business get more clients, phone calls, and sales.",
    deliverables: ["Custom Websites", "Simple landing pages", "Fast page loading", "Online store systems"],
    subServices: [
      {
        id: "basic-web",
        name: "Basic Website",
        description: "A clean, modern page to display your work, location, and phone number. Perfect for shops, doctors, or individuals.",
        pricePkr: 10000,
        priceUsd: 35,
        features: ["Up to 5 Pages", "Simple animations", "Works perfectly on mobile phones", "Direct WhatsApp contact link", "Free website setup help"],
      },
      {
        id: "tools-web",
        name: "Tools Website",
        description: "A website designed to show listings (like properties, cars, or jobs) or calculate prices automatically.",
        pricePkr: 20000,
        priceUsd: 70,
        features: ["Automatic price calculation", "Easy search & filter tools", "Simple input fields", "Extremely fast and reliable", "Easy to find on Google"],
      },
      {
        id: "ecommerce-web",
        name: "E-commerce Website",
        description: "A complete online shop where customers can view products, add them to a cart, and pay directly online.",
        pricePkr: 30000,
        priceUsd: 105,
        features: ["Accept cards & bank transfers", "Add unlimited products easily", "Shopping cart & checkout pages", "Order alerts on email/SMS", "Simple shop owner dashboard"],
      },
      {
        id: "saas-web",
        name: "SaaS Website",
        description: "A high-end marketing website designed specifically to showcase and sell software or mobile applications.",
        pricePkr: 40000,
        priceUsd: 140,
        features: ["Modern layout grid style", "Clear monthly pricing tables", "Customer sign-up forms", "Direct payments setup", "Visitor traffic reports"],
      },
      {
        id: "ai-web",
        name: "AI Website",
        description: "A website with a built-in smart assistant or chatbot that answers customer questions automatically.",
        pricePkr: 50000,
        priceUsd: 175,
        features: ["Smart chatbot included", "Answers questions 24/7", "Search products by description", "Super fast response time", "Saves staff time on support"],
      },
    ],
  },
  {
    id: "app-dev",
    title: "App Development",
    description:
      "Mobile phone apps built for iPhone and Android devices that your customers can download from app stores.",
    deliverables: ["Android & iPhone Apps", "App Store Publishing", "Push notifications", "Phone feature integration"],
    subServices: [
      {
        id: "custom-mobile",
        name: "Custom Mobile App",
        description: "An app built to run smoothly on both Android and iPhone devices, utilizing mobile phone features.",
        pricePkr: 50000,
        priceUsd: 175,
        features: ["Works on Android & iPhone", "Publishes to Play Store & App Store", "Sends pop-up notifications", "Uses phone camera or GPS", "Works even without internet"],
      },
      {
        id: "saas-app",
        name: "SaaS App",
        description: "A web-based software platform where users can log in, manage data, and pay monthly subscriptions.",
        pricePkr: 60000,
        priceUsd: 215,
        features: ["Secure login for users", "Monthly subscription payments", "Main control board for admins", "Share access with team members", "Strong database backup system"],
      },
      {
        id: "ai-app",
        name: "AI Apps",
        description: "A mobile application with smart features like voice assistance, automatic tasks, and smart filters.",
        pricePkr: 65000,
        priceUsd: 230,
        features: ["Built-in voice helper", "Automates boring daily tasks", "Creates text or pictures", "Highly secure data lock", "Scales as you get more users"],
      },
    ],
  },
  {
    id: "saas-apps",
    title: "SaaS Applications",
    description:
      "Custom web applications where your users can sign up, create profiles, and pay for services monthly.",
    deliverables: ["Software architecture", "Monthly subscription billing", "Client portals", "Secure user databases"],
    subServices: [
      {
        id: "mvp-saas",
        name: "MVP SaaS Build",
        description: "A basic, working version of your software to test your business idea with real users quickly.",
        pricePkr: 70000,
        priceUsd: 250,
        features: ["Core features only", "User login & sign up", "Simple bank/card payments", "Basic control dashboard", "Ready in 4 weeks"],
      },
      {
        id: "full-saas",
        name: "Scale-Ready SaaS",
        description: "A complete, heavy-duty software system built for thousands of customers without slowing down.",
        pricePkr: 80000,
        priceUsd: 285,
        features: ["Advanced billing options", "Team member account invites", "Connects to other software tools", "Detailed sales & usage charts", "Highest level security shields"],
      },
    ],
  },
  {
    id: "ai-workflows",
    title: "AI Workflows",
    description:
      "Automate your daily manual work with smart AI bots that can read documents, chat, and fill forms.",
    deliverables: ["AI integration", "Automatic data entry", "Custom support chatbots", "Smart workflow agents"],
    subServices: [
      {
        id: "ai-chatbot",
        name: "AI Chatbots & Assistants",
        description: "A chatbot that talks to your customers like a real human and answers questions based on your files.",
        pricePkr: 25000,
        priceUsd: 90,
        features: ["Learns from your business files", "Works on website or WhatsApp", "Saves all chat histories", "Works 24 hours non-stop", "Quick 2-week setup"],
      },
      {
        id: "ai-agents",
        name: "Intelligent Agents & RAG",
        description: "Advanced AI bots that do real work for you, like sending emails, reading reports, and updates.",
        pricePkr: 80000,
        priceUsd: 285,
        features: ["Searches your database files", "Sends emails automatically", "Takes logical steps on its own", "Saves history of what it did", "Easy to monitor and adjust"],
      },
    ],
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
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "routewise-field-app",
    title: "RouteWise Field App",
    category: "App Development",
    summary: "A field operations app for scheduling technicians, tracking updates, and reducing dispatch confusion.",
    outcome: "Cut missed service windows by 41% for a regional operations team.",
    stack: ["TypeScript", "App flows", "Dashboards"],
    liveUrl: "https://example.com/routewise",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "nexa-search-growth",
    title: "Nexa Search Growth Sprint",
    category: "SEO",
    summary: "A technical SEO and content roadmap for a B2B services brand with weak organic visibility.",
    outcome: "Doubled top-10 keyword coverage across priority service pages.",
    stack: ["SEO audit", "Content strategy", "Schema"],
    liveUrl: "https://example.com/nexa-growth",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "signaldesk-ai",
    title: "SignalDesk AI Assistant",
    category: "AI Solutions",
    summary: "An internal AI assistant that summarized support issues and routed them to the right teams.",
    outcome: "Saved support managers roughly 11 hours per week in triage time.",
    stack: ["Automation", "Prompt design", "Internal tooling"],
    liveUrl: "https://example.com/signaldesk-ai",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=85&w=1200",
  },
  {
    slug: "saffron-brand-kit",
    title: "Saffron Brand Kit",
    category: "Graphic Design",
    summary: "A full visual refresh for a premium catering brand rolling out a new online presence.",
    outcome: "Improved proposal close rate with a more cohesive pitch and digital presentation.",
    stack: ["Identity", "Marketing assets", "Web visuals"],
    liveUrl: "https://example.com/saffron-brand",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=85&w=1200",
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
    name: "ABAYIZA",
    company: "",
    review:
      "Voquarn Code delivered a clean, modern website with clear communication and fast turnaround.",
    stars: 5,
  },
  {
    name: "BABA FARID PUBLIC SCHOOL",
    company: "",
    review:
      "The school website became easier to understand, update, and share with parents and students.",
    stars: 5,
  },
  {
    name: "AL FAROOQ",
    company: "",
    review:
      "They handled the project professionally and gave us a simple digital presence that feels trustworthy.",
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
    pricePkr: 10000,
    priceUsd: 35,
    features: ["5-page website", "Lead form setup", "Basic SEO structure", "2 weeks support"],
  },
  {
    name: "Growth",
    description: "For teams ready to invest in a stronger funnel, richer content, and better automation.",
    pricePkr: 45000,
    priceUsd: 160,
    featured: true,
    features: ["10+ pages", "Portfolio or blog", "Advanced SEO", "CRM or WhatsApp workflow"],
  },
  {
    name: "Scale",
    description: "For brands that need custom workflows, AI support, and a more ambitious digital system.",
    pricePkr: 80000,
    priceUsd: 285,
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
