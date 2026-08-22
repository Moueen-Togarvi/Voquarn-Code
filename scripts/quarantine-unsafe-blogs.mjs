import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const BLOG_DIRECTORY = path.join(ROOT, "content", "blogs");
const RUN_DATE = new Date().toISOString().slice(0, 10);
const ARCHIVE_DIRECTORY = path.join(ROOT, "backups", `blog-quarantine-${RUN_DATE}`);
const REPORT_DIRECTORY = path.join(ROOT, "reports");
const MANIFEST_PATH = path.join(REPORT_DIRECTORY, `blog-quarantine-${RUN_DATE}.json`);
const REPORT_PATH = path.join(REPORT_DIRECTORY, `blog-quarantine-${RUN_DATE}.md`);
const LONG_PARAGRAPH_LENGTH = 120;
const REPEAT_PAGE_FLOOR = 10;

function parse(source, filename) {
  const match = source.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter: ${filename}`);
  const values = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try { value = JSON.parse(value); } catch { value = value.slice(1, -1); }
    }
    values[key] = value;
  }
  return { frontmatter: values, markdown: match[2].trim() };
}

function normalizeParagraph(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeKeyword(value = "") {
  return value.toLowerCase().replace(/\b20\d{2}\b/g, " ").replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(markdown) {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`|~-]/g, " ")
      .match(/[\p{L}\p{N}][\p{L}\p{N}'’.+-]*/gu) ?? []
  ).length;
}

function checksum(source) {
  return createHash("sha256").update(source).digest("hex");
}

async function restore(manifestFile) {
  const manifestPath = path.resolve(ROOT, manifestFile);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!Array.isArray(manifest.quarantined)) throw new Error("Manifest has no quarantined file list.");

  let restored = 0;
  for (const item of manifest.quarantined) {
    const source = path.resolve(ROOT, item.archivePath);
    const destination = path.resolve(ROOT, item.originalPath);
    if (!source.startsWith(path.resolve(ROOT, "backups") + path.sep)) throw new Error(`Unsafe archive path: ${source}`);
    if (!destination.startsWith(BLOG_DIRECTORY + path.sep)) throw new Error(`Unsafe restore path: ${destination}`);
    try {
      await stat(source);
    } catch {
      continue;
    }
    try {
      await stat(destination);
      throw new Error(`Restore target already exists: ${destination}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    await rename(source, destination);
    restored += 1;
  }
  console.log(`Restored ${restored} blog file(s) from ${path.relative(ROOT, manifestPath)}.`);
}

const restoreIndex = process.argv.indexOf("--restore");
if (restoreIndex >= 0) {
  const manifestFile = process.argv[restoreIndex + 1];
  if (!manifestFile) throw new Error("--restore requires a manifest path.");
  await restore(manifestFile);
  process.exit(0);
}

const filenames = (await readdir(BLOG_DIRECTORY)).filter((name) => name.endsWith(".md")).sort();
const posts = [];
const paragraphFiles = new Map();

for (const filename of filenames) {
  const absolutePath = path.join(BLOG_DIRECTORY, filename);
  const source = await readFile(absolutePath, "utf8");
  const { frontmatter, markdown } = parse(source, filename);
  if (frontmatter.status !== "published") continue;

  const links = [...markdown.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((match) => match[1]);
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map(normalizeParagraph)
    .filter((paragraph) => paragraph.length >= LONG_PARAGRAPH_LENGTH);
  for (const paragraph of new Set(paragraphs)) {
    const files = paragraphFiles.get(paragraph) ?? [];
    files.push(filename);
    paragraphFiles.set(paragraph, files);
  }

  posts.push({
    filename,
    source,
    checksum: checksum(source),
    keyword: normalizeKeyword(frontmatter.targetKeyword),
    series: frontmatter.trendSeries || "manual",
    wordCount: countWords(markdown),
    headingCount: (markdown.match(/^#{2,3}\s+.+$/gm) ?? []).length,
    listItemCount: (markdown.match(/^(?:[-*]|\d+\.)\s+.+$/gm) ?? []).length,
    internalLinkCount: new Set(links.filter((href) => href.startsWith("/"))).size,
    externalLinkCount: new Set(links.filter((href) => href.startsWith("https://"))).size,
    paragraphs,
    reasons: [],
  });
}

for (const post of posts) {
  const repeatedParagraphs = post.paragraphs.filter(
    (paragraph) => (paragraphFiles.get(paragraph)?.length ?? 0) >= REPEAT_PAGE_FLOOR,
  ).length;
  post.repeatedParagraphPercent = post.paragraphs.length
    ? Number(((repeatedParagraphs / post.paragraphs.length) * 100).toFixed(1))
    : 0;
  if (post.repeatedParagraphPercent >= 50) post.reasons.push("template-heavy");
  if (post.wordCount < 700) post.reasons.push("thin-under-700-words");
  if (post.headingCount < 4 || post.listItemCount < 3 || post.internalLinkCount < 2) {
    post.reasons.push("weak-structure-or-linking");
  }
}

const initialKeep = posts.filter((post) => post.reasons.length === 0);
const keywordGroups = new Map();
for (const post of initialKeep) {
  if (!post.keyword) continue;
  const group = keywordGroups.get(post.keyword) ?? [];
  group.push(post);
  keywordGroups.set(post.keyword, group);
}

for (const group of keywordGroups.values()) {
  if (group.length < 2) continue;
  group.sort(
    (a, b) =>
      b.wordCount - a.wordCount ||
      b.externalLinkCount - a.externalLinkCount ||
      b.internalLinkCount - a.internalLinkCount ||
      a.filename.localeCompare(b.filename),
  );
  for (const duplicate of group.slice(1)) duplicate.reasons.push("duplicate-target-keyword");
}

const keep = posts.filter((post) => post.reasons.length === 0);
const quarantine = posts.filter((post) => post.reasons.length > 0);
const manifest = {
  createdAt: new Date().toISOString(),
  applied: process.argv.includes("--apply"),
  sourceDirectory: path.relative(ROOT, BLOG_DIRECTORY),
  archiveDirectory: path.relative(ROOT, ARCHIVE_DIRECTORY),
  thresholds: {
    repeatedParagraphPercent: 50,
    repeatedOnAtLeastPages: REPEAT_PAGE_FLOOR,
    minimumWords: 700,
    minimumHeadings: 4,
    minimumListItems: 3,
    minimumInternalLinks: 2,
  },
  beforePublished: posts.length,
  afterPublished: keep.length,
  quarantinedCount: quarantine.length,
  retained: keep.map((post) => ({
    path: path.join("content", "blogs", post.filename),
    keyword: post.keyword,
    wordCount: post.wordCount,
  })),
  quarantined: quarantine.map((post) => ({
    originalPath: path.join("content", "blogs", post.filename),
    archivePath: path.join("backups", `blog-quarantine-${RUN_DATE}`, post.filename),
    checksum: post.checksum,
    reasons: post.reasons,
    keyword: post.keyword,
    series: post.series,
    wordCount: post.wordCount,
    repeatedParagraphPercent: post.repeatedParagraphPercent,
  })),
};

const reasonCounts = new Map();
for (const post of quarantine) {
  for (const reason of post.reasons) reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
}

const report = `# Blog quarantine report — ${RUN_DATE}

This cleanup is recoverable. Quarantined Markdown files are moved out of the published blog directory and can be restored with the JSON manifest.

## Result

- Published before: ${posts.length}
- Retained as published: ${keep.length}
- Quarantined: ${quarantine.length}
- Applied: ${manifest.applied ? "yes" : "no (dry run)"}

## Quarantine reasons

${[...reasonCounts.entries()].map(([reason, count]) => `- ${reason}: ${count}`).join("\n")}

## Retained files

${keep.map((post) => `- ${post.filename} — ${post.wordCount} words`).join("\n")}

## Recovery

Run:

\`npm run blogs:cleanup:restore\`

The restore command never overwrites an existing blog file.
`;

await mkdir(REPORT_DIRECTORY, { recursive: true });
await Promise.all([
  writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  writeFile(REPORT_PATH, report, "utf8"),
]);

if (manifest.applied) {
  try {
    await stat(ARCHIVE_DIRECTORY);
    throw new Error(`Archive target already exists: ${ARCHIVE_DIRECTORY}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await mkdir(ARCHIVE_DIRECTORY, { recursive: false });
  for (const post of quarantine) {
    await rename(path.join(BLOG_DIRECTORY, post.filename), path.join(ARCHIVE_DIRECTORY, post.filename));
  }
  await writeFile(path.join(ARCHIVE_DIRECTORY, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  applied: manifest.applied,
  publishedBefore: posts.length,
  retainedPublished: keep.length,
  quarantined: quarantine.length,
  report: path.relative(ROOT, REPORT_PATH),
  manifest: path.relative(ROOT, MANIFEST_PATH),
  archive: path.relative(ROOT, ARCHIVE_DIRECTORY),
}, null, 2));
