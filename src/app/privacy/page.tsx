import { SectionHeading } from "@/components/ui/section-heading";
import { PageStructuredData } from "@/components/seo/page-structured-data";
import { buildMetadata } from "@/lib/metadata";

const pageTitle = "Privacy Policy | Voquarn Code";
const pageDescription =
  "Read how Voquarn Code handles project inquiries, contact details, website analytics, and personal information.";

export const metadata = buildMetadata(
  pageTitle,
  pageDescription,
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <section className="page-section mt-24 lg:mt-32 pt-40 lg:pt-56 max-w-4xl mx-auto">
      <PageStructuredData path="/privacy" name={pageTitle} description={pageDescription} />
      <SectionHeading
        eyebrow="Legal"
        title="Privacy Policy"
        description="We respect your privacy and are committed to protecting it."
        headingLevel="h1"
      />
      
      <div className="mt-16 prose prose-neutral dark:prose-invert max-w-none pb-32 space-y-8 text-neutral-600 dark:text-neutral-300">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us via email or WhatsApp. This may include your name, email address, phone number, and project details.
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you project updates, proposals, and invoices</li>
            <li>Improve our website and services</li>
            <li>Send occasional marketing communications (if you have opted in)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">3. Data Sharing and Security</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our business (such as hosting providers or payment processors), under strict confidentiality agreements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">4. Cookies and Tracking</h2>
          <p>
            Our website may use cookies and similar tracking technologies to analyze traffic and improve user experience. You can control cookies through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">5. Your Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data. Please contact us if you wish to exercise these rights.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about our privacy practices, please contact us at hello@voquarn.com.
          </p>
        </div>
      </div>
    </section>
  );
}
