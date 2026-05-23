const DEFAULT_SITE_URL = "https://voquarn.com";

export function getSiteUrl(): URL {
  const siteUrl = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    return new URL(siteUrl);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}
