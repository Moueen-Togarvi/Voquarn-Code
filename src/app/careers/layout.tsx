import type { ReactNode } from "react";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { buildMetadata } from "@/lib/metadata";

const pageTitle = "Careers at Voquarn Code | Engineering, Design & SEO Roles";
const pageDescription =
  "Explore open roles at Voquarn Code across engineering, UI/UX design, technical SEO, growth, and client delivery.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/careers",
);

type CareersLayoutProps = {
  children: ReactNode;
};

export default function CareersLayout({ children }: CareersLayoutProps) {
  return (
    <>
      <PageStructuredData path="/careers" name={pageTitle} description={pageDescription} type="CollectionPage" />
      {children}
    </>
  );
}
