# SEO, AEO and GEO review — 9 October 2026

## Search Console evidence

Source: the owner's `voquarn.com-Performance-on-Search-2026-10-09.zip`, Web search, last three months. Daily data ends on 6 October.

| Period | Days | Clicks | Impressions | Impressions/day |
| --- | ---: | ---: | ---: | ---: |
| 19–29 August | 11 | 7 | 2,733 | 248.5 |
| 30 August–6 October | 38 | 0 | 120 | 3.2 |

The decline begins on 30 August. This export establishes timing, not the cause. It does not include Page indexing, Crawl stats, Manual actions, Security issues, URL Inspection, or a daily page/query breakdown. October changes happened after the decline began. Historical reports contain HTTP, HTTPS apex and HTTPS www URLs; current canonical and permanent-host redirect settings consolidate on `https://www.voquarn.com`.

Bulk publication preceded the spike. An automated content comparison identified 4,282 pages with at least half their long paragraphs repeated across ten or more pages. This is a quality concern and a plausible contributor; neither this analysis nor the export proves a Google penalty or a specific algorithmic cause.

## Applied publication cleanup

The owner authorized publication cleanup after being informed of its exact scope. A recoverable archive holds 4,351 files. The published set contains 67 articles, including 24 reviewed cornerstone guides. Quarantine criteria also include fewer than 700 words or weak structure/internal linking. These are editorial screening rules, not Google minimum requirements or proof that every flagged page is unhelpful.

- Local archive: `backups/blog-quarantine-2026-10-09/` (ignored by Git).
- Inventory and checksums: `reports/blog-quarantine-2026-10-09.json`.
- Recovery: `npm run blogs:cleanup:restore`, followed by `npm run blogs:index` and a redeployment. Recovery never overwrites an existing article. The previous Git revision also preserves the original files.
- Seventeen matching retired URLs permanently redirect to substantive guides on the same subject. Other retired URLs return 404. No blanket redirect to the homepage or blog listing is applied.
- Every remaining published blog belongs in the sitemap. Search Console's discovered count is a processed snapshot and may differ until Google reads the new sitemap.

## Technical and content improvements

- Fixed two internal links left pointing to quarantined articles; added a check across every published Markdown blog.
- Added tests for permanent blog redirects, existing destinations and absence of redirect chains.
- Prebuild all curated article pages to serve cached HTML on their first visit.
- Make missing blog/service metadata use Next.js `notFound()` rather than the collection page's canonical metadata.
- Align article metadata and schema with the visible author profile; show publication dates on mobile.
- Add visible service buying questions and matching FAQ schema, including international delivery, pricing scope and enquiries.
- Refresh three AEO/GEO articles with current primary sources, practical measurement steps and removal of unsupported universal timing/citation claims.
- Return uncached 503 responses for `llms.txt` data outages, matching the sitemap outage policy.
- Retain www canonicals, accurate article modification dates, crawler access, public-page sitemap coverage and private-page noindex rules.

No new batch of keyword-swapped pages was generated. Keyword priorities come from the owner's observed query data: `aeo budget`, `self hosted llm`, `dedicated team python`, `legacy software development uk`, `shopify vs woocommerce`, `ai conversion rate optimization`, `private ai for fintech` and `llmops consulting services`. These are observed impressions, not verified search-volume rankings.

## Measurement after deployment

Local validation passed: production build (128 generated pages, including all 67 articles), TypeScript, lint, canonical/robots/schema checks, published-article internal links, redirect destinations and chains, sitemap completeness and database-outage handling. All 4,351 archived files match their recorded SHA-256 checksums.

Compare the next 28-day period with this baseline, separating branded/non-branded queries, public service pages and retained articles. Inspect indexing and selected canonicals for a few retained guides and redirected URLs. Check Search Console's indexing, crawl, manual-action and security reports before attributing the drop to a single cause. The uploaded export cannot confirm those reports' status.

Google includes AI feature traffic in the Web performance report; it does not provide a complete assistant-citation log there. Use Bing AI Performance where available, plus dated prompt samples with country, assistant and cited URL. Track enquiries independently. Access, valid markup and helpful content support eligibility; rankings, indexing, citations and traffic recovery are not guaranteed.

## Primary references

- [Google: debugging search traffic drops](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: core updates and content assessment](https://developers.google.com/search/docs/appearance/core-updates)
- [Google: site moves and relevant redirects](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Bing: AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
