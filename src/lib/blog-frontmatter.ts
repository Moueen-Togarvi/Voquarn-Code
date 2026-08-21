// Pure Markdown/frontmatter parsing for content/blogs/*.md.
//
// Deliberately free of `server-only` and of any filesystem access so the
// build-time indexer (scripts/build-blog-index.ts) and the request-time
// loader (src/lib/markdown-blogs.ts) parse posts with exactly the same rules.

export type Frontmatter = {
  title: string;
  slug: string;
  description: string;
  category: string;
  targetKeyword?: string;
  secondaryKeywords?: string;
  publishedAt?: string;
  readTime: string;
  status: "draft" | "published";
  coverImage?: string;
};

export type RichTextNode = Record<string, unknown>;

export function parseFrontmatter(source: string, filename: string) {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Invalid or missing frontmatter in ${filename}`);
  }

  const values: Record<string, string> = {};

  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Invalid frontmatter line in ${filename}: ${line}`);
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    let value = rawValue;

    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      try {
        value = JSON.parse(rawValue) as string;
      } catch {
        throw new Error(`Invalid quoted frontmatter value for ${key} in ${filename}`);
      }
    }

    values[key] = value;
  }

  const required = ["title", "slug", "description", "category", "readTime", "status"];
  for (const key of required) {
    if (!values[key]) {
      throw new Error(`Missing ${key} in ${filename}`);
    }
  }

  if (values.status !== "draft" && values.status !== "published") {
    throw new Error(`Invalid status in ${filename}: ${values.status}`);
  }

  if (values.status === "published") {
    if (!values.publishedAt || Number.isNaN(Date.parse(values.publishedAt))) {
      throw new Error(`Published post ${filename} needs a valid publishedAt date`);
    }
  }

  return {
    frontmatter: values as Frontmatter,
    markdown: match[2].trim(),
  };
}

function safeLink(href: string) {
  return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : null;
}

function inlineContent(text: string): RichTextNode[] {
  const nodes: RichTextNode[] = [];
  const pattern = /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      nodes.push({ type: "text", text: text.slice(cursor, index) });
    }

    if (match[2] && match[3]) {
      const href = safeLink(match[3]);
      nodes.push(
        href
          ? {
              type: "text",
              text: match[2],
              marks: [{ type: "link", attrs: { href, target: null, rel: "noopener noreferrer", class: null } }],
            }
          : { type: "text", text: match[2] },
      );
    } else if (match[4]) {
      nodes.push({ type: "text", text: match[4], marks: [{ type: "bold" }] });
    } else if (match[5]) {
      nodes.push({ type: "text", text: match[5], marks: [{ type: "code" }] });
    }

    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push({ type: "text", text: text.slice(cursor) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", text }];
}

function paragraph(text: string): RichTextNode {
  return { type: "paragraph", content: inlineContent(text) };
}

function isBlockStart(line: string) {
  return /^(?:#{1,3}\s+|[-*]\s+|\d+\.\s+|>\s?|```|---$)/.test(line);
}

export function markdownToRichContent(markdown: string): RichTextNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const content: RichTextNode[] = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      content.push({
        type: "heading",
        attrs: { level: heading[1].length },
        content: inlineContent(heading[2]),
      });
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: RichTextNode[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push({
          type: "listItem",
          content: [paragraph(lines[index].trim().replace(/^[-*]\s+/, ""))],
        });
        index += 1;
      }
      content.push({ type: "bulletList", content: items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: RichTextNode[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push({
          type: "listItem",
          content: [paragraph(lines[index].trim().replace(/^\d+\.\s+/, ""))],
        });
        index += 1;
      }
      content.push({ type: "orderedList", attrs: { start: 1, type: null }, content: items });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      content.push({ type: "blockquote", content: [paragraph(quote.join(" "))] });
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || null;
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      content.push({
        type: "codeBlock",
        attrs: { language },
        content: code.length > 0 ? [{ type: "text", text: code.join("\n") }] : [],
      });
      continue;
    }

    if (line === "---") {
      content.push({ type: "horizontalRule" });
      index += 1;
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    content.push(paragraph(paragraphLines.join(" ")));
  }

  return content;
}
