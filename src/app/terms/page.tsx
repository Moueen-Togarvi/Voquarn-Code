import { SectionHeading } from "@/components/ui/section-heading";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { buildMetadata } from "@/lib/metadata";

const pageTitle = "Terms of Service | Voquarn Code";
const pageDescription =
  "Read the terms for using Voquarn Code services, including project scope, payments, deliverables, and client responsibilities.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/terms",
);

export default function TermsPage() {
  return (
    <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56 max-w-4xl mx-auto">
      <PageStructuredData path="/terms" name={pageTitle} description={pageDescription} />
      <SectionHeading
        eyebrow="Legal"
        title="Terms of Service"
        description="Please read these terms carefully before using our platform."
        headingLevel="h1"
      />
      
      <div className="mt-16 prose prose-neutral dark:prose-invert max-w-none pb-32 space-y-8 text-neutral-600 dark:text-neutral-300">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Voquarn Code (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">2. Services Description</h2>
          <p>
            Voquarn provides web development, app development, SEO optimization, AI integrations, and design services. The specific scope, deliverables, and timeline for any project will be agreed upon in a separate statement of work or contract.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">3. Client Responsibilities</h2>
          <p>
            To ensure timely delivery, clients are expected to provide necessary materials, feedback, and approvals promptly. Delays in client responses may result in adjusted project timelines.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">4. Payment Terms</h2>
          <p>
            Payments are due as outlined in the specific project agreement. Typically, this involves an upfront deposit before work begins, with subsequent milestones tied to project progress.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">5. Intellectual Property</h2>
          <p>
            Upon full and final payment, the client owns the rights to the final deliverables as described in the contract. We reserve the right to display the completed work in our portfolio and marketing materials unless a non-disclosure agreement (NDA) is explicitly signed.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">6. Limitation of Liability</h2>
          <p>
            Voquarn shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">7. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at hello@voquarn.com.
          </p>
        </div>
      </div>
    </section>
  );
}
