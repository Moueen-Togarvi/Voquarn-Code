import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, type BreadcrumbItem, webPageJsonLd } from "@/lib/schema";

type PageStructuredDataProps = {
  path: string;
  name: string;
  description: string;
  type?: string;
  breadcrumbs?: BreadcrumbItem[];
  keywords?: string[];
};

export function PageStructuredData({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumbs,
  keywords,
}: PageStructuredDataProps) {
  const items = breadcrumbs || [
    { name: "Home", path: "/" },
    { name, path },
  ];
  const data = [webPageJsonLd({ path, name, description, type, keywords })];

  if (items.length >= 2) {
    data.push(breadcrumbJsonLd(items));
  }

  return <JsonLd data={data} />;
}
