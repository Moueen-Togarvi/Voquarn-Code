import "server-only";
import { getSiteUrl } from "@/lib/site-url";

// Google does not participate in IndexNow (confirmed as of 2026 — Search
// Console remains the only way to prompt Google directly, and that needs an
// interactive OAuth grant this codebase doesn't have). Bing, Yandex, Naver,
// Seznam, and Yep all do, and api.indexnow.org fans a single submission out
// to every participating engine, so this covers all of them in one call.
//
// The verification key below is not a secret — it's published in this file's
// response and re-published in every submission's keyLocation, so IndexNow
// can prove the submitter owns the domain. It's hardcoded (not in .env) so
// the key and the route folder name (src/app/<key>.txt) can never drift out
// of sync with each other. If you rotate it, rename the route folder to
// match in the same commit.
export const INDEXNOW_KEY = "145ca6d737253b343dc7d7f936100b4d";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10_000;

export async function submitToIndexNow(urls: string[]): Promise<{ submitted: number; batches: number }> {
  if (urls.length === 0) return { submitted: 0, batches: 0 };

  const siteUrl = getSiteUrl();
  const keyLocation = new URL(`/${INDEXNOW_KEY}.txt`, siteUrl).toString();
  let batches = 0;

  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_URLS_PER_REQUEST);
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: siteUrl.host,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: batch,
      }),
    });

    // 200 = accepted, 202 = accepted, key not yet verified by the crawler.
    if (response.status !== 200 && response.status !== 202) {
      const body = await response.text().catch(() => "");
      throw new Error(`IndexNow submission failed: ${response.status} ${body}`.trim());
    }
    batches += 1;
  }

  return { submitted: urls.length, batches };
}
