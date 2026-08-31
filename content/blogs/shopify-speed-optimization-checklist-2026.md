---
title: "Shopify Speed Optimization: What Actually Moves Core Web Vitals"
slug: "shopify-speed-optimization-checklist-2026"
description: "A diagnostic-first approach to store speed: which apps cost most, how to fix LCP and INP on themes you cannot control, and what scores hide."
category: "Ecommerce Development"
targetKeyword: "shopify speed optimization checklist"
secondaryKeywords: "shopify speed optimization, shopify core web vitals, shopify page speed, improve shopify site speed"
readTime: "6 min read"
publishedAt: "2026-08-31"
status: "published"
cornerstone: true
allowExcludedTerms: true
---

Most **Shopify speed optimization services** begin by compressing images and minifying CSS. On a typical store those changes recover a few hundred milliseconds. The two to four seconds that actually matter are elsewhere — in third-party app scripts, render-blocking resources, and a theme doing far more work than the page requires.

This is a diagnostic sequence rather than a checklist, because the order in which you look determines whether you find the real cost.

## Ignore the Shopify speed score

The score in your Shopify admin is a Lighthouse composite run on a synthetic mobile profile against a handful of pages. It is directionally useful and routinely misleading.

What Google actually uses for ranking is **Core Web Vitals from the Chrome User Experience Report** — field data from real visitors on real devices and connections. A store can score 70 in the admin and fail CWV, or score 45 and pass, depending entirely on who visits and on what.

Work from field data. In Search Console, the Core Web Vitals report shows real-user LCP, INP, and CLS. That is the measurement that matters. Lab tools are for diagnosis; field data is for judgement.

The thresholds:

```
LCP  (Largest Contentful Paint)   good <= 2.5s
INP  (Interaction to Next Paint)  good <= 200ms
CLS  (Cumulative Layout Shift)    good <= 0.1
```

You need the 75th percentile to pass, not the median. Optimising for your own fast laptop on office wifi is how stores end up failing while looking fine locally.

## Apps are almost always the answer

On the majority of Shopify stores, third-party apps account for more front-end cost than everything else combined.

The mechanism is that most apps inject JavaScript into every page whether or not the page uses them. A review app loads on the checkout. A currency converter loads on the blog. A popup tool loads on all of them and blocks the main thread while it decides not to show anything.

**Audit properly.** Open Chrome DevTools, load a product page, and in the Network panel sort by transfer size with the filter set to JS. Then use the Coverage panel to see what fraction of each script is actually executed. Stores commonly find 60–80% of loaded JavaScript unused on any given page.

For each app, answer three questions:

1. Does it need to load on *this* page type, or only on some?
2. Does it need to load before first paint, or can it defer until interaction?
3. Is it earning its cost? An app adding 400ms to every page view to display badges is a measurable revenue trade, not a free feature.

**Uninstalling is not enough.** Shopify apps frequently leave theme code behind — script tags, snippets, and Liquid includes that persist and continue loading against endpoints that may no longer respond. After removing an app, search your theme for its handle and remove the residue manually.

## LCP: usually the hero image, sometimes the font

On collection and product pages the LCP element is nearly always the main image. Three things dominate it:

**Discovery time.** If the image is loaded by JavaScript — a slider, a lazy-load library — the browser cannot begin fetching until that script parses and runs. Preloading the LCP image in the document head fixes this:

```liquid
{%- if template.name == 'product' -%}
  <link rel="preload" as="image"
        href="{{ product.featured_image | image_url: width: 800 }}"
        imagesrcset="{{ product.featured_image | image_url: width: 400 }} 400w,
                     {{ product.featured_image | image_url: width: 800 }} 800w"
        imagesizes="(max-width: 768px) 100vw, 50vw">
{%- endif -%}
```

**Never lazy-load the LCP image.** `loading="lazy"` on an above-the-fold hero delays it by design. Lazy-load everything below the fold; eager-load what is visible immediately.

**Font blocking.** If the LCP element is text, a webfont without `font-display: swap` blocks rendering until the font arrives. Shopify serves fonts from its CDN reasonably, but custom fonts added via theme code frequently lack the directive.

## INP: the metric that replaced FID

Interaction to Next Paint measures responsiveness across the whole session, not just the first interaction. It is stricter than FID was, and many stores that passed FID comfortably fail INP.

The dominant cause is main-thread congestion from app scripts. When a visitor taps "add to cart" and the main thread is busy executing a personalisation script, the interaction waits.

Practical fixes:

- **Defer non-critical scripts.** Anything not needed for initial render gets `defer`, or loads on first interaction.
- **Break up long tasks.** Any task over 50ms blocks interaction. In DevTools Performance, long tasks appear with red corners.
- **Reduce event handler work.** Handlers doing layout reads and writes in sequence force synchronous reflow.
- **Subscribe to fewer scroll and resize events**, and throttle those you keep.

Shopify's own scripts are generally well-behaved. The congestion is almost always installed apps.

## CLS: usually cheap to fix

Layout shift comes from a small set of causes, all straightforward:

**Images without dimensions.** Always set width and height, or an aspect ratio, so the browser reserves space:

```liquid
<img src="{{ image | image_url: width: 800 }}"
     width="{{ image.width }}"
     height="{{ image.height }}"
     alt="{{ image.alt | escape }}"
     loading="lazy">
```

**Injected banners.** Announcement bars, cookie notices, and promotional strips inserted after paint push content down. Reserve their space in the initial layout or position them so they do not displace content.

**Webfont swap.** A fallback font with substantially different metrics causes reflow when the webfont loads. `size-adjust` and `ascent-override` in the `@font-face` declaration reduce this considerably.

## The theme itself

Some themes are simply heavy — extensive section options, large bundled JavaScript, multiple carousel libraries. If the theme is the constraint, no amount of app pruning rescues it.

Signals that the theme is the problem: over 300KB of theme JavaScript before apps, multiple animation libraries, or a bundled jQuery still in use.

Migrating themes is disruptive and sometimes correct. An Online Store 2.0 theme built for performance, with apps reinstalled deliberately rather than restored wholesale, often produces a larger improvement than months of incremental tuning.

## What to expect

Realistic outcomes on a typical mid-size store with 15–25 apps:

```
App audit and removal            -800ms to -2,000ms  LCP
LCP preload + eager loading      -300ms to -900ms    LCP
Script deferral                  -100ms to -400ms    INP
Image dimensions + reserved space  CLS 0.25 -> <0.1
Image format/compression         -100ms to -300ms    LCP
```

The ordering is deliberate. App auditing is unglamorous, requires merchant conversations about which features justify their cost, and delivers most of the available gain. Image compression is easy, satisfying, and usually the smallest line.

## Frequently asked questions

**Why is my Shopify store slow despite a good speed score?**
The admin score is a synthetic lab measurement on a few pages. Google ranks on field data from real visitors at the 75th percentile. Check Core Web Vitals in Search Console instead.

**Which apps hurt performance most?**
Anything injecting scripts on every page regardless of use — popups, currency converters, review widgets, personalisation tools, and live chat. Audit with Chrome DevTools Coverage to see what proportion of each script actually executes.

**Does uninstalling an app remove its code?**
Frequently not. Apps leave script tags and theme snippets behind. After uninstalling, search your theme files for the app's handle and remove the remnants manually.

**Should I go headless for speed?**
Rarely for that reason alone. A tuned standard theme with disciplined app usage performs excellently. Headless adds substantial engineering commitment and is justified by custom UX requirements, not by page speed.

**How long until Core Web Vitals improve in Search Console?**
The report uses a 28-day rolling window, so meaningful movement takes three to four weeks after deployment. Lab tools confirm the change immediately; field data lags.

## Further reading

- [Google Core Web Vitals thresholds](https://web.dev/articles/vitals)
- [Chrome User Experience Report](https://developer.chrome.com/docs/crux)

## Related

- [Web development](/services/web-dev)
- [Selected work](/portfolio)
- [Talk to us](/contact)
