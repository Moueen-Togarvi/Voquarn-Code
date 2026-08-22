import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blogs");
const EXCLUDED_TERMS = ["shopify", "seo"];
const MINIMUM_WORDS = 900;
const MINIMUM_HEADINGS = 6;
const MINIMUM_LIST_ITEMS = 8;
const MINIMUM_INTERNAL_LINKS = 3;
const MINIMUM_EXTERNAL_LINKS = 2;
const LONG_PARAGRAPH_LENGTH = 120;

function parseFrontmatter(source, filename) {
  const match = source.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid or missing frontmatter in ${filename}`);
  const values = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const raw = line.slice(separator + 1).trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try {
        values[key] = JSON.parse(raw);
      } catch {
        values[key] = raw.slice(1, -1);
      }
    } else values[key] = raw;
  }
  return { frontmatter: values, markdown: match[2].trim() };
}

function normalized(value = "") {
  return value.toLowerCase().replace(/\b20\d{2}\b/g, " ").replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizedParagraph(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function wordCount(markdown) {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/[#>*_`|~-]/g, " ")
      .match(/[\p{L}\p{N}][\p{L}\p{N}'’.+-]*/gu) ?? []
  ).length;
}

function containsTerm(source, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(source);
}

const requestedFiles = process.argv.slice(2);
if (requestedFiles.length === 0) {
  console.error("Pass one or more new Markdown files to check.");
  console.error("Example: npm run blogs:check-new -- content/blogs/example.md");
  process.exit(2);
}

const newFiles = requestedFiles.map((file) => path.resolve(process.cwd(), file));
const newFileSet = new Set(newFiles);
const corpusFilenames = (await readdir(BLOG_DIRECTORY)).filter((name) => name.endsWith(".md"));
const corpusKeywords = new Map();
const corpusParagraphs = new Map();
const corpusSlugs = new Set();

for (const filename of corpusFilenames) {
  const absolutePath = path.join(BLOG_DIRECTORY, filename);
  const source = await readFile(absolutePath, "utf8");
  const { frontmatter, markdown } = parseFrontmatter(source, filename);
  corpusSlugs.add(frontmatter.slug);
  if (newFileSet.has(absolutePath)) continue;

  const keyword = normalized(frontmatter.targetKeyword);
  if (keyword) corpusKeywords.set(keyword, filename);
  for (const paragraph of markdown.split(/\n\s*\n/).map(normalizedParagraph)) {
    if (paragraph.length < LONG_PARAGRAPH_LENGTH) continue;
    const files = corpusParagraphs.get(paragraph) ?? [];
    files.push(filename);
    corpusParagraphs.set(paragraph, files);
  }
}

const errors = [];
const seenNewKeywords = new Map();
const seenNewParagraphs = new Map();

for (const absolutePath of newFiles) {
  const relativePath = path.relative(process.cwd(), absolutePath);
  let source;
  try {
    source = await readFile(absolutePath, "utf8");
  } catch (error) {
    errors.push(`${relativePath}: cannot read file (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  let parsed;
  try {
    parsed = parseFrontmatter(source, relativePath);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    continue;
  }

  const { frontmatter, markdown } = parsed;
  const filename = path.basename(absolutePath);
  const keyword = normalized(frontmatter.targetKeyword);
  const words = wordCount(markdown);
  const headings = markdown.match(/^#{2,3}\s+.+$/gm) ?? [];
  const listItems = markdown.match(/^(?:[-*]|\d+\.)\s+.+$/gm) ?? [];
  const links = [...markdown.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((match) => match[2]);
  const internalLinks = links.filter((href) => href.startsWith("/"));
  const externalLinks = links.filter((href) => /^https:\/\//i.test(href));
  const blogLinks = internalLinks.filter((href) => href.startsWith("/blog/"));
  const paragraphs = markdown.split(/\n\s*\n/).map(normalizedParagraph).filter((value) => value.length >= LONG_PARAGRAPH_LENGTH);

  if (!frontmatter.slug || `${frontmatter.slug}.md` !== filename) errors.push(`${relativePath}: slug must match filename`);
  if (frontmatter.status !== "published") errors.push(`${relativePath}: status must be published`);
  if (!frontmatter.publishedAt || Number.isNaN(Date.parse(frontmatter.publishedAt))) errors.push(`${relativePath}: invalid publishedAt`);
  if (!keyword) errors.push(`${relativePath}: targetKeyword is required`);
  if (keyword && corpusKeywords.has(keyword)) errors.push(`${relativePath}: targetKeyword duplicates ${corpusKeywords.get(keyword)}`);
  if (keyword && seenNewKeywords.has(keyword)) errors.push(`${relativePath}: targetKeyword duplicates new file ${seenNewKeywords.get(keyword)}`);
  if (keyword) seenNewKeywords.set(keyword, relativePath);

  for (const term of EXCLUDED_TERMS) {
    if (containsTerm(source, term)) errors.push(`${relativePath}: contains excluded term "${term}"`);
  }

  if ((frontmatter.title?.length ?? 0) < 30 || frontmatter.title.length > 70) errors.push(`${relativePath}: title must be 30–70 characters`);
  if ((frontmatter.description?.length ?? 0) < 110 || frontmatter.description.length > 170) errors.push(`${relativePath}: description must be 110–170 characters`);
  if (words < MINIMUM_WORDS) errors.push(`${relativePath}: ${words} words; minimum is ${MINIMUM_WORDS}`);
  if (headings.length < MINIMUM_HEADINGS) errors.push(`${relativePath}: ${headings.length} H2/H3 headings; minimum is ${MINIMUM_HEADINGS}`);
  if (listItems.length < MINIMUM_LIST_ITEMS) errors.push(`${relativePath}: ${listItems.length} list items; minimum is ${MINIMUM_LIST_ITEMS}`);
  if (new Set(internalLinks).size < MINIMUM_INTERNAL_LINKS) errors.push(`${relativePath}: needs ${MINIMUM_INTERNAL_LINKS} distinct internal links`);
  if (new Set(externalLinks).size < MINIMUM_EXTERNAL_LINKS) errors.push(`${relativePath}: needs ${MINIMUM_EXTERNAL_LINKS} distinct HTTPS evidence links`);

  for (const href of blogLinks) {
    const slug = decodeURIComponent(href.match(/^\/blog\/([^/?#]+)/)?.[1] ?? "");
    if (slug && !corpusSlugs.has(slug)) errors.push(`${relativePath}: broken blog link ${href}`);
  }

  for (const paragraph of paragraphs) {
    if (corpusParagraphs.has(paragraph)) {
      errors.push(`${relativePath}: repeats a long paragraph from ${corpusParagraphs.get(paragraph)[0]}`);
    }
    if (seenNewParagraphs.has(paragraph)) {
      errors.push(`${relativePath}: repeats a long paragraph from new file ${seenNewParagraphs.get(paragraph)}`);
    }
    seenNewParagraphs.set(paragraph, relativePath);
  }
}

if (errors.length > 0) {
  console.error(`New blog quality check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`New blog quality check passed for ${newFiles.length} file(s).`);
