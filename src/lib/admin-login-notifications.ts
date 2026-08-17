import { getSiteSettings } from "@/lib/data";
import { adminLoginSecurityAlertEmail } from "@/lib/email-templates";
import type { LoginRequestInfo } from "@/lib/login-request-info";
import { sendResendEmail } from "@/lib/resend";

type LoginAlertInput = {
  to: string;
  status: "failed" | "successful";
  attemptedEmail: string;
  requestInfo: LoginRequestInfo;
};

export async function sendAdminLoginSecurityAlert(input: LoginAlertInput) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("Cannot send admin login security alert: RESEND_API_KEY is missing");
    return false;
  }

  try {
    const site = await getSiteSettings();
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL || `${site.name} Security <hello@voquarn.com>`;
    const isFailed = input.status === "failed";
    const result = await sendResendEmail(resendApiKey, {
      from: fromAddress,
      to: input.to,
      subject: isFailed
        ? `[Security alert] Failed ${site.name} admin login`
        : `[Security notice] Successful ${site.name} admin login`,
      html: adminLoginSecurityAlertEmail(site, input),
    });

    if (!result.ok) {
      console.error("Admin login security alert email error:", result.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Admin login security alert error:", error);
    return false;
  }
}
