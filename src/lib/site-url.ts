// This is the single public origin that search engines should index. Keep it
// independent from deployment environment variables: a stale SITE_URL value
// previously caused canonical tags and sitemap entries to point at the apex
// domain even though production permanently serves the www host.
export const CANONICAL_SITE_URL = "https://www.voquarn.com";

export function getSiteUrl(): URL {
  return new URL(CANONICAL_SITE_URL);
}
