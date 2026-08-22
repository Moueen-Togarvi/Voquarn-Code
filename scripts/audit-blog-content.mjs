import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blogs");
const REPORT_DIRECTORY = path.join(process.cwd(), "reports");
const AUDIT_DATE = new Date().toISOString().slice(0, 10);
const EXCLUDED_TERMS = ["shopify", "seo"];
const LONG_PARAGRAPH_LENGTH = 120;
const REPEATED_PARAGRAPH_PAGE_FLOOR = 10;

function parseFrontmatter(source, filename) {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid or missing frontmatter: ${filename}`);

  const values = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      try {
        values[key] = JSON.parse(rawValue);
      } catch {
        values[key] = rawValue.slice(1, -1);
      }
    } else {
      values[key] = rawValue;
    }
  }

  return { frontmatter: values, markdown: match[2].trim() };
}

function plainWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|~-]/g, " ")
    .match(/[\p{L}\p{N}][\p{L}\p{N}'’.+-]*/gu) ?? [];
}

function normalizedKeyword(value = "") {
  return value
    .toLowerCase()
    .replace(/\b20\d{2}\b/g, " ")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedParagraph(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function countTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(`\\b${escaped}\\b`, "gi")) ?? []).length;
}

function topEntries(map, limit = 20) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}

function percent(part, whole) {
  return whole === 0 ? 0 : Number(((part / whole) * 100).toFixed(1));
}

function markdownTable(headers, rows) {
  if (rows.length === 0) return "None found.";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((value) => String(value).replaceAll("|", "\\|")).join(" | ")} |`),
  ].join("\n");
}

async function audit() {
  const filenames = (await readdir(BLOG_DIRECTORY)).filter((name) => name.endsWith(".md")).sort();
  const posts = [];
  const parseErrors = [];
  const keywordFiles = new Map();
  const paragraphFiles = new Map();
  const headingSignatureFiles = new Map();
  const slugSet = new Set();

  for (const filename of filenames) {
    try {
      const source = await readFile(path.join(BLOG_DIRECTORY, filename), "utf8");
      const { frontmatter, markdown } = parseFrontmatter(source, filename);
      const links = [...markdown.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((match) => ({
        label: match[1],
        href: match[2],
      }));
      const headings = [...markdown.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => match[1].trim());
      const paragraphs = markdown
        .split(/\n\s*\n/)
        .map(normalizedParagraph)
        .filter((paragraph) => paragraph.length >= LONG_PARAGRAPH_LENGTH);
      const targetKeyword = normalizedKeyword(frontmatter.targetKeyword);
      const slug = frontmatter.slug || filename.replace(/\.md$/, "");
      const termCounts = Object.fromEntries(EXCLUDED_TERMS.map((term) => [term, countTerm(source, term)]));

      slugSet.add(slug);
      if (targetKeyword) {
        const files = keywordFiles.get(targetKeyword) ?? [];
        files.push(filename);
        keywordFiles.set(targetKeyword, files);
      }
      for (const paragraph of new Set(paragraphs)) {
        const files = paragraphFiles.get(paragraph) ?? [];
        files.push(filename);
        paragraphFiles.set(paragraph, files);
      }
      const headingSignature = headings.map((heading) => normalizedKeyword(heading)).join(" > ");
      if (headingSignature) {
        const files = headingSignatureFiles.get(headingSignature) ?? [];
        files.push(filename);
        headingSignatureFiles.set(headingSignature, files);
      }

      posts.push({
        filename,
        slug,
        title: frontmatter.title ?? "",
        description: frontmatter.description ?? "",
        category: frontmatter.category ?? "",
        targetKeyword,
        status: frontmatter.status ?? "",
        publishedAt: frontmatter.publishedAt ?? "",
        wordCount: plainWords(markdown).length,
        h2Count: headings.filter((heading) => markdown.includes(`## ${heading}`)).length,
        headingCount: headings.length,
        listItemCount: (markdown.match(/^(?:[-*]|\d+\.)\s+/gm) ?? []).length,
        internalLinks: links.filter(({ href }) => href.startsWith("/")).map(({ href }) => href),
        externalLinks: links.filter(({ href }) => /^https?:\/\//i.test(href)).map(({ href }) => href),
        longParagraphs: paragraphs,
        termCounts,
        source,
      });
    } catch (error) {
      parseErrors.push({ filename, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const duplicateKeywords = [...keywordFiles.entries()]
    .filter(([, files]) => files.length > 1)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const repeatedParagraphs = [...paragraphFiles.entries()]
    .filter(([, files]) => files.length >= REPEATED_PARAGRAPH_PAGE_FLOOR)
    .sort((a, b) => b[1].length - a[1].length);
  const repeatedHeadingStructures = [...headingSignatureFiles.entries()]
    .filter(([, files]) => files.length >= REPEATED_PARAGRAPH_PAGE_FLOOR)
    .sort((a, b) => b[1].length - a[1].length);

  for (const post of posts) {
    post.repeatedLongParagraphs = post.longParagraphs.filter(
      (paragraph) => (paragraphFiles.get(paragraph)?.length ?? 0) >= REPEATED_PARAGRAPH_PAGE_FLOOR,
    ).length;
    post.repeatedLongParagraphRatio = post.longParagraphs.length
      ? post.repeatedLongParagraphs / post.longParagraphs.length
      : 0;
    post.brokenBlogLinks = post.internalLinks.filter((href) => {
      const match = href.match(/^\/blog\/([^/?#]+)/);
      return match ? !slugSet.has(decodeURIComponent(match[1])) : false;
    });
  }

  const published = posts.filter((post) => post.status === "published");
  const drafts = posts.filter((post) => post.status === "draft");
  const thin = published.filter((post) => post.wordCount < 700);
  const veryThin = published.filter((post) => post.wordCount < 400);
  const repetitive = published.filter((post) => post.repeatedLongParagraphRatio >= 0.5);
  const missingKeyword = published.filter((post) => !post.targetKeyword);
  const weakStructure = published.filter(
    (post) => post.headingCount < 4 || post.listItemCount < 3 || post.internalLinks.length < 2,
  );
  const noExternalEvidence = published.filter((post) => post.externalLinks.length === 0);
  const brokenBlogLinks = published.filter((post) => post.brokenBlogLinks.length > 0);
  const filenameMismatch = posts.filter((post) => `${post.slug}.md` !== post.filename);
  const futureDated = published.filter((post) => post.publishedAt > AUDIT_DATE);
  const excludedTermFiles = Object.fromEntries(
    EXCLUDED_TERMS.map((term) => [term, published.filter((post) => post.termCounts[term] > 0)]),
  );
  const categoryCounts = new Map();
  for (const post of published) categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);

  const summary = {
    auditDate: AUDIT_DATE,
    totalFiles: filenames.length,
    parsedFiles: posts.length,
    parseErrors: parseErrors.length,
    published: published.length,
    drafts: drafts.length,
    uniqueTargetKeywords: keywordFiles.size,
    pagesMissingTargetKeyword: missingKeyword.length,
    duplicateKeywordGroups: duplicateKeywords.length,
    duplicateKeywordPages: duplicateKeywords.reduce((sum, [, files]) => sum + files.length, 0),
    thinPagesUnder700Words: thin.length,
    veryThinPagesUnder400Words: veryThin.length,
    pagesWithWeakStructure: weakStructure.length,
    pagesWithoutExternalEvidenceLinks: noExternalEvidence.length,
    brokenBlogLinkPages: brokenBlogLinks.length,
    filenameSlugMismatches: filenameMismatch.length,
    futureDatedPages: futureDated.length,
    repeatedLongParagraphPatterns: repeatedParagraphs.length,
    repeatedHeadingStructures: repeatedHeadingStructures.length,
    pagesAtLeastHalfRepeatedLongParagraphs: repetitive.length,
    excludedTermFiles: Object.fromEntries(
      EXCLUDED_TERMS.map((term) => [term, excludedTermFiles[term].length]),
    ),
  };

  const report = `# Blog content audit — ${AUDIT_DATE}

This report audits the current Markdown corpus. It does not delete, redirect, unpublish, or rewrite any article.

## Executive summary

${markdownTable(
  ["Check", "Result", "Share of published"],
  [
    ["Published pages", summary.published, "100%"],
    ["Unique target keywords", summary.uniqueTargetKeywords, "—"],
    ["Missing target keyword", summary.pagesMissingTargetKeyword, `${percent(summary.pagesMissingTargetKeyword, summary.published)}%`],
    ["Duplicate target-keyword pages", summary.duplicateKeywordPages, `${percent(summary.duplicateKeywordPages, summary.published)}%`],
    ["Under 700 words", summary.thinPagesUnder700Words, `${percent(summary.thinPagesUnder700Words, summary.published)}%`],
    ["Under 400 words", summary.veryThinPagesUnder400Words, `${percent(summary.veryThinPagesUnder400Words, summary.published)}%`],
    ["Weak headings/lists/internal links", summary.pagesWithWeakStructure, `${percent(summary.pagesWithWeakStructure, summary.published)}%`],
    ["No external evidence link", summary.pagesWithoutExternalEvidenceLinks, `${percent(summary.pagesWithoutExternalEvidenceLinks, summary.published)}%`],
    ["At least half of long paragraphs reused", summary.pagesAtLeastHalfRepeatedLongParagraphs, `${percent(summary.pagesAtLeastHalfRepeatedLongParagraphs, summary.published)}%`],
    ["Broken contextual blog-link pages", summary.brokenBlogLinkPages, `${percent(summary.brokenBlogLinkPages, summary.published)}%`],
    ...EXCLUDED_TERMS.map((term) => [
      `Contains excluded term: ${term}`,
      summary.excludedTermFiles[term],
      `${percent(summary.excludedTermFiles[term], summary.published)}%`,
    ]),
  ],
)}

## Main findings

1. **Template reuse is the largest risk.** ${summary.pagesAtLeastHalfRepeatedLongParagraphs.toLocaleString()} published pages have at least half of their substantial paragraphs reused on ten or more pages.
2. **Keyword cannibalization exists but is limited at the exact-match level.** ${summary.duplicateKeywordGroups} keyword groups target an identical normalized phrase.
3. **Evidence quality needs improvement.** ${summary.pagesWithoutExternalEvidenceLinks.toLocaleString()} pages do not link to an external primary or authoritative source.
4. **Structure is inconsistent.** ${summary.pagesWithWeakStructure.toLocaleString()} pages miss the minimum combination of four headings, three list items, and two contextual internal links.
5. **Excluded terms already occur in legacy content.** The exclusion rule should be enforced for new files without silently deleting existing URLs.

## Duplicate target keywords

${markdownTable(
  ["Normalized keyword", "Pages", "Files"],
  duplicateKeywords.slice(0, 50).map(([keyword, files]) => [keyword, files.length, files.join("<br>")]),
)}

## Most repeated long paragraphs

${markdownTable(
  ["Pages", "Paragraph sample"],
  repeatedParagraphs.slice(0, 25).map(([paragraph, files]) => [
    files.length,
    `${paragraph.slice(0, 180)}${paragraph.length > 180 ? "…" : ""}`,
  ]),
)}

## Largest repeated heading structures

${markdownTable(
  ["Pages", "Heading sequence"],
  repeatedHeadingStructures.slice(0, 20).map(([signature, files]) => [
    files.length,
    `${signature.slice(0, 220)}${signature.length > 220 ? "…" : ""}`,
  ]),
)}

## Thin-page samples

${markdownTable(
  ["Words", "File", "Target keyword"],
  [...thin]
    .sort((a, b) => a.wordCount - b.wordCount)
    .slice(0, 50)
    .map((post) => [post.wordCount, post.filename, post.targetKeyword || "missing"]),
)}

## Broken contextual blog links

${markdownTable(
  ["File", "Broken links"],
  brokenBlogLinks.slice(0, 50).map((post) => [post.filename, [...new Set(post.brokenBlogLinks)].join("<br>")]),
)}

## Category distribution

${markdownTable(
  ["Category", "Published pages"],
  topEntries(categoryCounts, 50),
)}

## Recommended order of work

1. Freeze bulk publication and apply a quality gate to every new article.
2. Map the ${summary.duplicateKeywordGroups} exact duplicate-keyword groups to one primary URL each; merge or reposition only after a manual intent review.
3. Prioritize the ${summary.pagesAtLeastHalfRepeatedLongParagraphs.toLocaleString()} template-heavy pages using real impressions, clicks, leads, backlinks, and conversion data.
4. Rewrite or consolidate pages in measured batches. Do not change thousands of URLs at once.
5. Add first-party examples, named expert review, original diagrams/data, and authoritative citations to pages worth retaining.
6. Publish new articles only when their target keyword, search intent, outline, examples, and substantial paragraphs are distinct from the existing corpus.
7. Keep new content containing the excluded terms out of publication and the sitemap.
`;

  return {
    summary,
    report,
    details: {
      parseErrors,
      duplicateKeywords: duplicateKeywords.map(([keyword, files]) => ({ keyword, files })),
      missingTargetKeyword: missingKeyword.map(({ filename, slug }) => ({ filename, slug })),
      thinPages: thin.map(({ filename, slug, wordCount, targetKeyword }) => ({ filename, slug, wordCount, targetKeyword })),
      repetitivePages: repetitive.map(({ filename, slug, repeatedLongParagraphRatio }) => ({
        filename,
        slug,
        repeatedLongParagraphPercent: Number((repeatedLongParagraphRatio * 100).toFixed(1)),
      })),
      weakStructurePages: weakStructure.map(({ filename, headingCount, listItemCount, internalLinks }) => ({
        filename,
        headingCount,
        listItemCount,
        internalLinkCount: internalLinks.length,
      })),
      brokenBlogLinks: brokenBlogLinks.map(({ filename, brokenBlogLinks: links }) => ({ filename, links })),
      filenameMismatch: filenameMismatch.map(({ filename, slug }) => ({ filename, slug })),
      futureDated: futureDated.map(({ filename, publishedAt }) => ({ filename, publishedAt })),
      excludedTermFiles: Object.fromEntries(
        EXCLUDED_TERMS.map((term) => [
          term,
          excludedTermFiles[term].map(({ filename, termCounts }) => ({ filename, occurrences: termCounts[term] })),
        ]),
      ),
    },
  };
}

const result = await audit();
const shouldWrite = process.argv.includes("--write");

if (shouldWrite) {
  await mkdir(REPORT_DIRECTORY, { recursive: true });
  const markdownPath = path.join(REPORT_DIRECTORY, `blog-content-audit-${AUDIT_DATE}.md`);
  const jsonPath = path.join(REPORT_DIRECTORY, `blog-content-audit-${AUDIT_DATE}.json`);
  await Promise.all([
    writeFile(markdownPath, result.report, "utf8"),
    writeFile(jsonPath, `${JSON.stringify({ summary: result.summary, ...result.details }, null, 2)}\n`, "utf8"),
  ]);
  console.log(`Wrote ${path.relative(process.cwd(), markdownPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), jsonPath)}`);
}

console.log(JSON.stringify(result.summary, null, 2));
