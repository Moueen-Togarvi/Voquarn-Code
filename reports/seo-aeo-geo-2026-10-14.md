# SEO, AEO and GEO findings — 14 October 2026

## What the evidence says about lost impressions

The available records show a short visibility spike in August followed by a sharp decline. They do **not** establish a Google penalty, an algorithm update, or a particular deployment as the cause. A successful live crawl confirms technical eligibility, not Google's indexed state or rankings.

| Period | Clicks | Impressions | Evidence |
| --- | ---: | ---: | --- |
| 29 May–17 August | 1 | 93 | Repository's 31 August Search Console workbook, independently reread |
| 19–28 August | 7 | 2,620 | Same workbook; 262 impressions/day, 0.267% CTR |
| 19–29 August | 7 | 2,733 | Previously analysed October export, recorded in 9 October report |
| 30 August–6 October | 0 | 120 | Previously analysed October export, recorded in 9 October report |

The last two periods imply an approximately 98.7% decline in daily impressions. The original October ZIP is no longer present at its supplied Downloads path, so those figures currently rely on the committed [9 October report](seo-aeo-geo-2026-10-09.md), rather than a new reading of that archive. There is no fresh Search Console export through 14 October in this audit.

Bulk article publication preceded the spike. The August audit found extensive repeated content: 4,287 of 4,397 articles had at least half their substantial paragraphs repeated across ten or more pages. This is a concrete quality concern and a plausible contributor to poor sustained visibility; it is not proof of Google's reason for the decline.

No repository commits appear between 23 and 30 August. This does not rule out changes made in hosting, Cloudflare, a database or a deployment outside Git. The 31 August redirect/content changes, 13 September non-cornerstone `noindex` restriction and October publication changes happened after the recorded 30 August decline began. The September restriction explains later limited sitemap coverage, not that initial onset.

## Problem and action list

| Priority | Finding | Action / current status |
| --- | --- | --- |
| High | Current Google indexing, selected canonicals, manual actions and security status unknown | Search Console is signed out. Needs authenticated reports; no penalty diagnosis is claimed. |
| High | Apex redirects temporarily to www | Live `https://voquarn.com/` returns 307. App already declares 308, but hosting runs first. Vercel is signed out; owner chose to finish available fixes first. |
| High | Generic repeated paragraphs in retained content | Rewrote all 16 affected articles. No exact normalized paragraph of at least 25 words remains repeated across three or more published articles. |
| High | Evidence and accuracy gaps | Updated 31 articles overall. The 25 articles previously without external references now include relevant primary sources and substantive guidance. Source counts are an editorial signal, not a Google rule. |
| High | Unsupported health/compliance/performance promises | Removed blanket HIPAA compliance, 99.99% uptime, 12ms checkout, 100% traceability and zero-wait claims from suite marketing; described capabilities instead. |
| Medium | Two AWS articles answered substantially the same intent | Kept both URLs: one now compares an actual container deployment; the other covers a startup's provider decision, credits and operating costs. |
| Medium | Incorrect or stale guidance | Corrected AI Act provider/deployer roles and dated sources; refreshed the old August security announcement; removed unsupported migration and Shopify speed percentages; qualified claims about spam enforcement. |
| Medium | Monthly CRM prices lacked a unit in machine-readable answers | Added monthly billing duration and unit to CRM offers and per-month wording to `llms.txt`; removed the unitless CRM aggregate price. |
| Medium | `/blog?page=999` returned the final archive page with 200 | Out-of-range archive and search pages now use not-found handling. Metadata and visible cards use the same filtered page calculation. |
| Medium | A formerly clicked migration guide returned 404 without an equivalent mapping | Added a permanent redirect to the maintained Next.js architecture guide and included explicit migration checks in the destination. Other unrelated retired URLs remain proper 404s. |
| Low | CEO's company LinkedIn URL labelled as a personal profile | Label now identifies Voquarn's LinkedIn page. |
| Verified | Full publication sitemap and blog discovery | 82 canonical public URLs: 67 blogs, 4 service pages and 11 static pages. All 67 blogs are reachable across the six archive pages. No additional articles removed in this pass. |
| Verified | Public indexing controls | All 82 pre-deployment sitemap URLs return 200, have a description and one H1, expose parseable JSON-LD and lack noindex. Canonicals match, treating the root URL with/without its trailing slash as equivalent. |
| Unverified | Current real-user Core Web Vitals | Public PageSpeed API returned quota error 429; no fresh score or field pass is claimed. Request Search Console CWV data when signed in. |

The full before/after content inventory is in [the content review data](seo-content-review-2026-10-14.json). It measures exact paragraph reuse and reference coverage, not semantic uniqueness, expertise, originality or ranking quality. Examples and test scenarios in revised articles are identified as proposals or illustrative cases, not invented client results.

## Why AEO/GEO changes do not guarantee impressions

Useful direct answers, clear entities, accurate prices, relevant internal links and source-backed content help people and machines understand the site. Google states that its AI search features use the same SEO foundations and require an indexed page eligible for a snippet. It does not require a special AI schema or `llms.txt`, and compliance does not guarantee crawling, indexing or display. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

The sitemap is a discovery file. Its URL count is not an indexed-page count, and neither count is an impression total. An impression requires the page to be shown for a query. The historical workbook had several queries at low average positions: `self hosted llm` 81.28, `shopify vs woocommerce` 76.11 and `AI conversion rate optimization` 65.43. Better historical positions included `aeo budget` 10.60 and `llmops consulting services` 12.93; these are observed past queries, not verified current search volumes or ranking forecasts.

## Remaining account-side diagnosis

Once Search Console access is available, inspect the domain property and collect:

1. Latest Performance data, comparing equal periods by page, query, Pakistan/international country and device. Separate branded from non-branded queries.
2. Page indexing exclusions for the 67 retained blogs: blocked, duplicate, crawled-not-indexed, discovered-not-indexed and server-error examples.
3. URL Inspection for the homepage, a service page and priority guides: `aeo-budget-planning-2026`, `hiring-dedicated-python-team-2026`, `private-ai-deployment-fintech-2026` and `llmops-consulting-what-to-expect-2026`. Record Google's selected canonical, last crawl and rendered result.
4. Crawl stats, Manual actions, Security issues and Removals. Check actual deployment/domain history around the end of August.
5. Confirm Google has read `https://www.voquarn.com/sitemap.xml` after this deployment. Request indexing for a few inspected priority URLs after correcting their reported issue; do not repeatedly resubmit as a substitute for diagnosis.

In Vercel project domain settings, change the existing `voquarn.com` → `www.voquarn.com` redirect to permanent 308 while preserving paths and query strings. Confirm the external response afterward; if it stays 307, inspect the relevant Cloudflare redirect configuration. The existing headers alone do not identify which account owns the rule. [Vercel domain redirect guidance](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)

Then compare complete 28-day periods with a recorded deployment date, retaining weekly observations without attributing normal variation to one change. There is no guaranteed recovery date. Prioritise accurate service proof and substantive guides over another batch of keyword-swapped pages. [Google traffic-drop diagnosis](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops), [Google scaled-content policy](https://developers.google.com/search/docs/essentials/spam-policies)

## Validation and deployment

Passed: full production build (128 generated routes, including all 67 articles), TypeScript, repository lint, canonical/robots/date/schema checks, internal blog links, all 18 redirect destinations without chains, sitemap completeness, and uncached 503 handling for data outages. The 24 cornerstone articles pass the existing editorial gate.

The production-server HTTP regression passed for page-two canonical/title, search noindex, out-of-range unfiltered/filtered 404 responses, and monthly CRM terms in schema and `llms.txt`. No packages were added. Publication remains 67 articles, with substantive changes to 31.

Main push and post-deployment verification are pending at the time of this report revision.

The official Next.js blog currently carries advance notice of an October 14 security update. That notice does not yet establish the final patched-version table. The security article links the official notice and asks readers to check the final advisory; this SEO release does not claim that framework 16.3.8 resolves that forthcoming advisory.
