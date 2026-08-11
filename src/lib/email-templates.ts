import { getSiteUrl } from "@/lib/site-url";
import type { SiteSettings } from "@/lib/data";

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

/** Small monochrome line-icon as an inline SVG data URI — renders reliably as an <img> across Gmail, Apple Mail, and Outlook, unlike emoji glyphs which vary by OS font. */
function iconDataUri(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23999999" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  return `data:image/svg+xml,${svg}`;
}

const ICONS = {
  mail: iconDataUri(
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
  ),
  whatsapp: iconDataUri(
    '<path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Z"/><path d="M8.5 8.3c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.6 1 1.3 1.7 2.3 2.2.3.1.4.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1.9.4 1.8.9 2.6 1.3.1.1.2.1.2.3 0 .5 0 1-.3 1.4-.4.6-1.4 1-2 1-1.5 0-3.5-1-4.9-2.4-1.5-1.5-2.5-3.4-2.5-4.9 0-.4.1-.9.2-1.2Z" fill="%23999999" stroke="none"/>',
  ),
  globe: iconDataUri(
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  ),
};

function contactLine(iconSrc: string, href: string, label: string) {
  return `
    <tr>
      <td style="padding:6px 0;">
        <a href="${href}" style="text-decoration:none;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;vertical-align:middle;">
                <img src="${iconSrc}" width="14" height="14" alt="" style="display:block;" />
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
              <td style="background-color:${BRAND_DARK};padding:32px 40px;text-align:center;">
                <img src="${logoUrl}" alt="${escapeHtml(site.name)}" width="40" height="40" style="display:inline-block;border-radius:10px;" />
                <p style="margin:12px 0 0;font-size:13px;font-weight:700;letter-spacing:0.04em;color:#ffffff;">
                  ${escapeHtml(site.name)}
                </p>
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
    budget: string;
    message: string;
  },
) {
  const rows = [
    detailRow("Name", escapeHtml(input.name)),
    detailRow("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND_COLOR};text-decoration:none;">${escapeHtml(input.email)}</a>`),
    detailRow("Service", escapeHtml(input.service)),
    detailRow("Budget", escapeHtml(input.budget)),
    detailRow("Message", escapeHtml(input.message).replace(/\n/g, "<br />")),
  ].join("");

  return emailShell({
    site,
    preheader: `New inquiry from ${input.name} — ${input.service}`,
    eyebrow: "New Inquiry",
    heading: "You've got a new project inquiry",
    intro: `${escapeHtml(input.name)} just submitted the contact form on the website. Reply directly to this email to reach them.`,
    detailRows: rows,
    ctaLabel: "Reply now",
    ctaUrl: `mailto:${input.email}`,
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

// ── Job application: notifies the agency ──
export function applyAdminEmail(
  site: SiteSettings,
  input: {
    name: string;
    email: string;
    phone: string;
    role: string;
    github: string;
    website?: string;
    fileName?: string;
  },
) {
  const rows = [
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
