import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const BLOG_DIRECTORY = path.join(ROOT, "content", "blogs");
const RUN_DATE = new Date().toISOString().slice(0, 10);
const ARCHIVE_DIRECTORY = path.join(ROOT, "backups", `blog-problems-${RUN_DATE}`);
const MANIFEST_PATH = path.join(ROOT, "reports", `blog-problems-${RUN_DATE}.json`);
const MINIMUM_WORDS = 400;

function parse(source, filename) {
  const match = source.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter: ${filename}`);

  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try { value = JSON.parse(value); } catch { value = value.slice(1, -1); }
    }
    frontmatter[key] = value;
  }

  return { frontmatter, markdown: match[2].trim() };
}

function normalizeKeyword(value = "") {
  return value
    .toLowerCase()
    .replace(/\b20\d{2}\b/g, " ")
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  let restored = 0;

  for (const item of manifest.quarantined ?? []) {
    const source = path.resolve(ROOT, item.archivePath);
    const destination = path.resolve(ROOT, item.originalPath);
    if (!source.startsWith(path.resolve(ROOT, "backups") + path.sep)) {
      throw new Error(`Unsafe archive path: ${source}`);
    }
    if (!destination.startsWith(BLOG_DIRECTORY + path.sep)) {
      throw new Error(`Unsafe restore path: ${destination}`);
    }

    try { await stat(source); } catch { continue; }
    try {
      await stat(destination);
      throw new Error(`Restore target already exists: ${destination}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    await rename(source, destination);
    restored += 1;
  }

  console.log(`Restored ${restored} problem blog file(s).`);
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

for (const filename of filenames) {
  const source = await readFile(path.join(BLOG_DIRECTORY, filename), "utf8");
  const { frontmatter, markdown } = parse(source, filename);
  if (frontmatter.status !== "published") continue;

  const links = [...markdown.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((match) => match[1]);
  posts.push({
    filename,
    source,
    checksum: checksum(source),
    keyword: normalizeKeyword(frontmatter.targetKeyword),
    wordCount: countWords(markdown),
    internalLinkCount: new Set(links.filter((href) => href.startsWith("/"))).size,
    externalLinkCount: new Set(links.filter((href) => href.startsWith("https://"))).size,
    reasons: [],
  });
}

for (const post of posts) {
  if (!post.keyword) post.reasons.push("missing-target-keyword");
  if (post.wordCount < MINIMUM_WORDS) post.reasons.push("extremely-thin-under-400-words");
}

const keywordGroups = new Map();
for (const post of posts) {
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
  for (const duplicate of group.slice(1)) duplicate.reasons.push("weaker-exact-keyword-duplicate");
}

const quarantine = posts.filter((post) => post.reasons.length > 0);
const retained = posts.filter((post) => post.reasons.length === 0);
const reasonCounts = {};
for (const post of quarantine) {
  for (const reason of post.reasons) reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
}

const applied = process.argv.includes("--apply");
const manifest = {
  createdAt: new Date().toISOString(),
  applied,
  policy: "Only objectively broken pages: missing target keyword, under 400 words, or weaker exact-keyword duplicate.",
  publishedBefore: posts.length,
  retainedPublished: retained.length,
  quarantinedCount: quarantine.length,
  reasonCounts,
  quarantined: quarantine.map((post) => ({
    originalPath: path.join("content", "blogs", post.filename),
    archivePath: path.join("backups", `blog-problems-${RUN_DATE}`, post.filename),
    checksum: post.checksum,
    keyword: post.keyword,
    wordCount: post.wordCount,
    reasons: post.reasons,
  })),
};

if (applied) {
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
}

await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
if (applied) {
  await writeFile(path.join(ARCHIVE_DIRECTORY, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  applied,
  publishedBefore: posts.length,
  retainedPublished: retained.length,
  quarantined: quarantine.length,
  reasonCounts,
  manifest: path.relative(ROOT, MANIFEST_PATH),
  archive: path.relative(ROOT, ARCHIVE_DIRECTORY),
}, null, 2));
