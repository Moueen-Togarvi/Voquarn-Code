import type { NextConfig } from "next";

const imageHosts = (process.env.IMAGE_REMOTE_HOSTS || "images.unsplash.com,api.dicebear.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter((host) => /^[a-z0-9.-]+$/.test(host));

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://connect.facebook.net https://analytics.tiktok.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imageHosts.map((host) => `https://${host}`).join(" ")} https://www.facebook.com https://www.googletagmanager.com https://*.google-analytics.com https://*.public.blob.vercel-storage.com`,
  "font-src 'self' data:",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "connect-src 'self' https://www.facebook.com https://analytics.tiktok.com https://*.ingest.sentry.io https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://vercel.com https://*.public.blob.vercel-storage.com",
  "frame-src 'self' https://www.google.com https://www.openstreetmap.org",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    // Article bodies are read from the Markdown files; every other blog
    // consumer (listing, sitemap, llms.txt, static params) reads the prebuilt
    // index instead, so both have to ship with the deployment.
    "/*": ["./content/blogs/**/*.md", "./content/blog-index.json"],
  },
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@tabler/icons-react"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "voquarn.com" }],
        destination: "https://www.voquarn.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
