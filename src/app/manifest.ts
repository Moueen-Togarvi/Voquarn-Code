import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteSettings();

  return {
    name: site.name,
    short_name: "Voquarn Code",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#ff5400",
    categories: ["business", "developer", "productivity"],
    icons: [
      {
        src: site.logoPath,
        sizes: "500x500",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Services",
        url: "/services",
      },
      {
        name: "Portfolio",
        url: "/portfolio",
      },
      {
        name: "Contact",
        url: "/contact",
      },
    ],
  };
}
