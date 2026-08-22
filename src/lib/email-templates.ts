import { getSiteUrl } from "@/lib/site-url";
import type { SiteSettings } from "@/lib/data";
import type { LoginRequestInfo } from "@/lib/login-request-info";

const BRAND_COLOR = "#ff5400";
const BRAND_DARK = "#151516";

function absoluteAsset(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function whatsappLink(whatsapp: string) {
  return `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;
}

// Real hosted PNGs, not inline SVG data URIs — Gmail's HTML sanitizer strips
// `data:` image sources from incoming mail, which left broken <img> tags with
// only their attributes visible. A normal https:// image URL (same pattern
// as the logo) renders reliably everywhere.
const ICONS = {
  mail: "/email-icons/mail.png",
  whatsapp: "/email-icons/whatsapp.png",
  globe: "/email-icons/globe.png",
};

function contactLine(iconPath: string, href: string, label: string) {
  const iconSrc = absoluteAsset(iconPath);
  return `
    <tr>
      <td style="padding:6px 0;">
        <a href="${href}" style="text-decoration:none;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;vertical-align:middle;">
                <img src="${iconSrc}" width="16" height="16" alt="" style="display:block;" />
              </td>
              <td style="vertical-align:middle;font-size:12.5px;color:#6b6b6b;">
                ${label}
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>
  `;
}

/** Renders a single label/value row inside the details card. */
function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #efefef;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#9a9a9a;white-space:nowrap;vertical-align:top;width:150px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #efefef;font-size:14px;color:#1a1a1a;vertical-align:top;">
        ${value}
      </td>
    </tr>
  `;
}

function loginRequestRows(info: LoginRequestInfo, attemptedEmail?: string) {
  return [
    attemptedEmail ? detailRow("Email entered", escapeHtml(attemptedEmail)) : "",
    detailRow("Time (PKT)", escapeHtml(info.occurredAt)),
    detailRow("IP address", escapeHtml(info.ipAddress)),
    detailRow("Approx. location", escapeHtml(info.location)),
    detailRow("Coordinates", escapeHtml(info.coordinates)),
    detailRow("Location timezone", escapeHtml(info.timezone)),
    detailRow("Device", escapeHtml(info.device)),
    detailRow("Device type", escapeHtml(info.deviceType)),
    detailRow("Operating system", escapeHtml(info.operatingSystem)),
    detailRow("Browser", escapeHtml(info.browser)),
    detailRow("Language", escapeHtml(info.language)),
    detailRow("User agent", escapeHtml(info.userAgent)),
  ].join("");
}

type EmailShellOptions = {
  site: SiteSettings;
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  detailRows?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
};

/**
 * One shared branded shell for every transactional email. Table-based layout
 * with inline styles is intentional — most email clients (Outlook, Gmail
 * inbox) strip <style> blocks and ignore modern CSS, so inline + tables is
 * the only reliable way to get consistent rendering everywhere.
 */
function emailShell({
  site,
  preheader,
  eyebrow,
  heading,
  intro,
  detailRows,
  ctaLabel,
  ctaUrl,
  footerNote,
}: EmailShellOptions) {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");
  const siteHost = siteUrl.replace(/^https?:\/\//, "");
  const logoUrl = absoluteAsset("/email-logo.png");
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">

            <!-- Header -->
            <tr>
              <td style="background-color:${BRAND_DARK};padding:36px 40px;text-align:center;">
                <img src="${logoUrl}" alt="${escapeHtml(site.name)}" width="72" height="72" style="display:inline-block;border-radius:16px;" />
              </td>
            </tr>

            <!-- Accent bar -->
            <tr>
              <td style="height:3px;background-color:${BRAND_COLOR};line-height:0;font-size:0;">&nbsp;</td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_COLOR};">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:800;color:#101010;">
                  ${escapeHtml(heading)}
                </h1>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#525252;">
                  ${intro}
                </p>

                ${
                  detailRows
                    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:16px;padding:4px 20px;margin-bottom:${ctaLabel ? "28px" : "4px"};">
                        ${detailRows}
                      </table>`
                    : ""
                }

                ${
                  ctaLabel && ctaUrl
                    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                        <tr>
                          <td style="border-radius:999px;background-color:${BRAND_COLOR};">
                            <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                              ${escapeHtml(ctaLabel)}
                            </a>
                          </td>
                        </tr>
                      </table>`
                    : ""
                }
              </td>
            </tr>

            <!-- Contact strip -->
            <tr>
              <td style="padding:0 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0f0f0;">
                  <tr>
                    <td style="padding:22px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                        ${contactLine(ICONS.mail, `mailto:${escapeHtml(site.email)}`, escapeHtml(site.email))}
                        ${contactLine(ICONS.whatsapp, whatsappLink(site.whatsapp), `WhatsApp: ${escapeHtml(site.phone)}`)}
                        ${contactLine(ICONS.globe, siteUrl, siteHost)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px 32px;border-top:1px solid #f0f0f0;">
                ${footerNote ? `<p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:#a0a0a0;">${footerNote}</p>` : ""}
                <p style="margin:0;font-size:11px;color:#c2c2c2;">
                  &copy; ${year} ${escapeHtml(site.name)}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ── Contact inquiry: notifies the agency ──
export function contactAdminEmail(
  site: SiteSettings,
  input: {
    name: string;
    email: string;
    service: string;
    priority: string;
    subject: string;
    message: string;
  },
) {
  const rows = [
    detailRow("Name", escapeHtml(input.name)),
    detailRow("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.email)}</a>`),
    detailRow("Subject", escapeHtml(input.subject)),
    detailRow("Service", escapeHtml(input.service)),
    detailRow("Priority", escapeHtml(input.priority)),
    detailRow("Message", escapeHtml(input.message).replace(/\n/g, "<br />")),
  ].join("");

  return emailShell({
    site,
    preheader: `New inquiry from ${input.name} — ${input.subject}`,
    eyebrow: "New Inquiry",
    heading: "You've got a new project inquiry",
    intro: `${escapeHtml(input.name)} just submitted the contact form on the website. Reply directly to this email to reach them.`,
    detailRows: rows,
    ctaLabel: "Reply now",
    ctaUrl: `mailto:${escapeHtml(input.email)}`,
  });
}

// ── Contact inquiry: confirms receipt to the person who submitted it ──
export function contactUserEmail(site: SiteSettings, input: { name: string }) {
  return emailShell({
    site,
    preheader: `Thanks for reaching out to ${site.name} — we'll be in touch within 24 hours.`,
    eyebrow: "Message Received",
    heading: `Thanks for reaching out, ${input.name.split(" ")[0]}`,
    intro:
      "We've received your project inquiry and a member of our team will review it shortly. Expect a reply within 24 hours — for anything urgent, feel free to message us directly on WhatsApp.",
    footerNote: "This is an automated confirmation. No need to reply to this email.",
  });
}

type MeetingEmailInput = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  date: string;
  time: string;
  timezone: string;
  duration: string;
  meetingType: string;
  agenda: string;
};

// ── Meeting request: notifies the agency ──
export function meetingAdminEmail(site: SiteSettings, input: MeetingEmailInput) {
  const rows = [
    detailRow("Name", escapeHtml(input.name)),
    detailRow("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.email)}</a>`),
    detailRow("Phone / WhatsApp", escapeHtml(input.phone || "Not provided")),
    detailRow("Topic", escapeHtml(input.topic)),
    detailRow("Preferred date", escapeHtml(input.date)),
    detailRow("Preferred time", `${escapeHtml(input.time)} (${escapeHtml(input.timezone)})`),
    detailRow("Duration", escapeHtml(input.duration)),
    detailRow("Meeting format", escapeHtml(input.meetingType)),
    detailRow("Agenda", escapeHtml(input.agenda).replace(/\n/g, "<br />")),
  ].join("");

  return emailShell({
    site,
    preheader: `Meeting request from ${input.name} for ${input.date}`,
    eyebrow: "Meeting Request",
    heading: "A new meeting has been requested",
    intro: `${escapeHtml(input.name)} selected a preferred slot. Check availability before confirming the meeting by replying directly to this email.`,
    detailRows: rows,
    ctaLabel: "Reply and confirm",
    ctaUrl: `mailto:${escapeHtml(input.email)}`,
  });
}

// ── Meeting request: acknowledges the preferred slot ──
export function meetingUserEmail(site: SiteSettings, input: MeetingEmailInput) {
  const rows = [
    detailRow("Topic", escapeHtml(input.topic)),
    detailRow("Preferred date", escapeHtml(input.date)),
    detailRow("Preferred time", `${escapeHtml(input.time)} (${escapeHtml(input.timezone)})`),
    detailRow("Duration", escapeHtml(input.duration)),
    detailRow("Meeting format", escapeHtml(input.meetingType)),
  ].join("");

  return emailShell({
    site,
    preheader: `We received your preferred meeting slot for ${input.date}.`,
    eyebrow: "Request Received",
    heading: `Thanks, ${input.name.split(" ")[0]}`,
    intro:
      "We've received your meeting request. This is not a final booking yet — our team will check availability and send you a separate confirmation with the meeting details.",
    detailRows: rows,
    footerNote: "Please reply to this email if you need to change your preferred date or time.",
  });
}

// ── Job application: notifies the agency ──
export function applyAdminEmail(
  site: SiteSettings,
  input: {
    applicationId: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    github: string;
    website?: string;
    message?: string;
    fileName?: string;
  },
) {
  const rows = [
    detailRow("Application ID", `#${input.applicationId}`),
    detailRow("Role", escapeHtml(input.role)),
    detailRow("Name", escapeHtml(input.name)),
    detailRow("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.email)}</a>`),
    detailRow("Phone", escapeHtml(input.phone || "Not provided")),
    detailRow(
      "GitHub",
      `<a href="${escapeHtml(input.github)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.github)}</a>`,
    ),
    detailRow(
      "Portfolio",
      input.website ? `<a href="${escapeHtml(input.website)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.website)}</a>` : "Not provided",
    ),
    detailRow("CV attached", escapeHtml(input.fileName || "cv.pdf")),
    input.message
      ? detailRow("Applicant message", escapeHtml(input.message).replaceAll("\n", "<br />"))
      : "",
  ].join("");

  return emailShell({
    site,
    preheader: `New application for ${input.role} from ${input.name}`,
    eyebrow: "New Application",
    heading: `New application: ${input.role}`,
    intro: `${escapeHtml(input.name)} applied for the ${escapeHtml(input.role)} role. Their CV is attached to this email.`,
    detailRows: rows,
    ctaLabel: "Reply now",
    ctaUrl: `mailto:${input.email}`,
  });
}

// ── Job application: confirms receipt to the applicant ──
export function applyUserEmail(site: SiteSettings, input: { name: string; role: string }) {
  return emailShell({
    site,
    preheader: `We received your application for ${input.role} — our team reviews every submission.`,
    eyebrow: "Application Received",
    heading: `Thanks for applying, ${input.name.split(" ")[0]}`,
    intro: `We've received your application for the <strong style="color:#1a1a1a;">${escapeHtml(input.role)}</strong> role along with your CV. Our team reviews every submission personally — if there's a fit, we'll reach out to schedule a conversation.`,
    footerNote: "This is an automated confirmation. No need to reply to this email.",
  });
}

export function applicationStatusEmail(
  site: SiteSettings,
  input: {
    name: string;
    role: string;
    status: "shortlisted" | "interview" | "selected" | "rejected";
    note?: string;
    interviewDate?: string;
    interviewTimezone?: string;
    interviewLocation?: string;
  },
) {
  const firstName = escapeHtml(input.name.split(" ")[0] || input.name);
  const role = escapeHtml(input.role);
  const note = input.note
    ? `<br /><br /><strong>Additional note:</strong><br />${escapeHtml(input.note).replaceAll("\n", "<br />")}`
    : "";

  if (input.status === "shortlisted") {
    return emailShell({
      site,
      preheader: `Your ${input.role} application has been shortlisted.`,
      eyebrow: "Application Shortlisted",
      heading: `Great news, ${firstName}`,
      intro: `Your application for the <strong style="color:#1a1a1a;">${role}</strong> role has been shortlisted. Our hiring team was impressed by your profile and will contact you about the next step.${note}`,
      footerNote: "You can reply directly to this email if your contact details or availability change.",
    });
  }

  if (input.status === "interview") {
    const rows = [
      detailRow("Role", role),
      detailRow("Interview", escapeHtml(input.interviewDate || "To be confirmed")),
      detailRow("Timezone", escapeHtml(input.interviewTimezone || "Not specified")),
      detailRow("Location / link", escapeHtml(input.interviewLocation || "To be confirmed")),
    ].join("");

    return emailShell({
      site,
      preheader: `Interview scheduled for your ${input.role} application.`,
      eyebrow: "Interview Scheduled",
      heading: `Your interview is scheduled, ${firstName}`,
      intro: `We would like to interview you for the <strong style="color:#1a1a1a;">${role}</strong> role. Please review the schedule below and reply to this email if you need to request a change.${note}`,
      detailRows: rows,
      ctaLabel: "Confirm availability",
      ctaUrl: `mailto:${site.email}?subject=${encodeURIComponent(`Interview confirmation — ${input.role}`)}`,
      footerNote: "Please join a few minutes early and keep any relevant portfolio links ready.",
    });
  }

  if (input.status === "selected") {
    return emailShell({
      site,
      preheader: `You have been selected for the ${input.role} role.`,
      eyebrow: "Application Successful",
      heading: `Congratulations, ${firstName}!`,
      intro: `We are pleased to let you know that you have been selected for the <strong style="color:#1a1a1a;">${role}</strong> role. Our team will contact you with the offer and onboarding details.${note}`,
      ctaLabel: "Reply to our team",
      ctaUrl: `mailto:${site.email}?subject=${encodeURIComponent(`Selected — ${input.role}`)}`,
      footerNote: `Welcome to the next chapter with ${site.name}.`,
    });
  }

  return emailShell({
    site,
    preheader: `An update about your ${input.role} application.`,
    eyebrow: "Application Update",
    heading: `Thank you for your time, ${firstName}`,
    intro: `After careful review, we will not be moving forward with your application for the <strong style="color:#1a1a1a;">${role}</strong> role at this time. We appreciate the effort you put into applying and wish you success in your search.${note}`,
    footerNote: "We will keep your details only as required by our recruitment and data-retention process.",
  });
}

// ── Admin authentication: one-time verification code ──
export function adminLoginCodeEmail(
  site: SiteSettings,
  code: string,
  requestInfo: LoginRequestInfo,
) {
  return emailShell({
    site,
    preheader: `${code} is your ${site.name} admin verification code.`,
    eyebrow: "Admin Security",
    heading: "Verify your admin login",
    intro:
      "Use the verification code below to finish signing in. It expires in 5 minutes and can only be used once.",
    detailRows: [
      detailRow("Verification code", `<strong style="font-size:24px;letter-spacing:0.22em;color:${BRAND_DARK};">${escapeHtml(code)}</strong>`),
      loginRequestRows(requestInfo),
    ].join(""),
    footerNote:
      "Location is approximate and depends on hosting-provider headers. If this was not you, change the admin password immediately.",
  });
}

export function adminLoginSecurityAlertEmail(
  site: SiteSettings,
  input: {
    status: "failed" | "successful";
    attemptedEmail: string;
    requestInfo: LoginRequestInfo;
  },
) {
  const isFailed = input.status === "failed";

  return emailShell({
    site,
    preheader: isFailed
      ? `A failed ${site.name} admin login was detected.`
      : `A successful ${site.name} admin login was detected.`,
    eyebrow: isFailed ? "Security Alert" : "Security Notice",
    heading: isFailed ? "Failed admin login attempt" : "Successful admin login",
    intro: isFailed
      ? "Someone entered an incorrect admin email or password. Review the request details below. The password itself is never recorded or emailed."
      : "An admin session was created after successful password and email-code verification. Confirm that the device and location below belong to you.",
    detailRows: loginRequestRows(input.requestInfo, input.attemptedEmail),
    footerNote: isFailed
      ? "Login attempts are rate-limited. If you do not recognize this activity, use a new unique admin password. Location is approximate."
      : "If this was not you, change the admin password and rotate AUTH_SECRET immediately. Location is approximate.",
  });
}
