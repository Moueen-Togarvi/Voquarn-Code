import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateBlogSeries } from "../scripts/generate-trend-blogs.mjs";

await assert.rejects(generateBlogSeries(), /Bulk template publication is retired/);
for (const filename of ["quarantine-unsafe-blogs.mjs", "quarantine-broken-blogs.mjs"]) {
  const script = fileURLToPath(new URL(`../scripts/${filename}`, import.meta.url));
  const root = await mkdtemp(path.join(tmpdir(), "voquarn-recovery-"));
  try {
    await mkdir(path.join(root, "content/blogs"), { recursive: true });
    await mkdir(path.join(root, "backups/archive"), { recursive: true });
    const source = "Original archived article\n";
    const quarantined = ["first", "second"].map((name) => ({
      archivePath: `backups/archive/${name}.md`,
      originalPath: `content/blogs/${name}.md`,
      checksum: createHash("sha256").update(source).digest("hex"),
    }));
    for (const item of quarantined) await writeFile(path.join(root, item.archivePath), source);
    await writeFile(path.join(root, "manifest.json"), JSON.stringify({ quarantined }));
    await writeFile(path.join(root, "content/blogs/second.md"), "Rewritten article\n");
    const restore = () => execFileSync(process.execPath, [script, "--restore", "manifest.json"], { cwd: root, stdio: "pipe" });
    assert.throws(restore, /Restore target already exists/);
    assert.equal(await readFile(path.join(root, quarantined[0].archivePath), "utf8"), source);
    await assert.rejects(readFile(path.join(root, quarantined[0].originalPath)), { code: "ENOENT" });
    await rm(path.join(root, "content/blogs/second.md"));
    await writeFile(path.join(root, quarantined[1].archivePath), "Unexpected modification\n");
    assert.throws(restore, /Archive checksum mismatch/);
    assert.equal(await readFile(path.join(root, quarantined[0].archivePath), "utf8"), source);
    await writeFile(path.join(root, quarantined[1].archivePath), source);

    await writeFile(path.join(root, "backups/not-directory"), "Not a directory\n");
    for (const [field, invalidPath, expectedError] of [
      ["archivePath", "backups/archive/../archive/first.md", /Duplicate archive source/],
      ["originalPath", "content/blogs/../blogs/first.md", /Duplicate restore target/],
      ["archivePath", "backups/not-directory/second.md", /ENOTDIR/],
    ]) {
      const invalid = quarantined.map((item) => ({ ...item }));
      invalid[1][field] = invalidPath;
      await writeFile(path.join(root, "manifest.json"), JSON.stringify({ quarantined: invalid }));
      assert.throws(restore, expectedError);
      for (const item of quarantined) {
        assert.equal(await readFile(path.join(root, item.archivePath), "utf8"), source);
        await assert.rejects(readFile(path.join(root, item.originalPath)), { code: "ENOENT" });
      }
    }

    await writeFile(path.join(root, "manifest.json"), JSON.stringify({ quarantined }));
    restore();
    restore(); // Already-moved archives are still safe to skip on a repeat run.
    for (const item of quarantined) assert.equal(await readFile(path.join(root, item.originalPath), "utf8"), source);
    console.log(`${filename}: conflicts, checksums, duplicate paths and archive I/O errors fail before publication; valid recovery and repeat runs succeed.`);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
