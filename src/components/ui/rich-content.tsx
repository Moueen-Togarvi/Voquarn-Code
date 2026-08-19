import type { ReactNode } from "react";

type RichNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: RichNode[];
};

export type TableOfContentsItem = {
  id: string;
  label: string;
  level: number;
};

function plainText(node: RichNode): string {
  if (node.type === "text") return node.text ?? "";
  return node.content?.map(plainText).join("") ?? "";
}

function headingId(label: string) {
  return label
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

function headingIds(content: RichNode[]) {
  const seen = new Map<string, number>();
  return content.map((node) => {
    if (node.type !== "heading") return null;
    const base = headingId(plainText(node));
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}

export function extractTableOfContents(content: Record<string, unknown>[]): TableOfContentsItem[] {
  const nodes = content as RichNode[];
  const ids = headingIds(nodes);
  return nodes.flatMap((node, index) => {
    if (node.type !== "heading" || !ids[index]) return [];
    const level = Number(node.attrs?.level ?? 2);
    if (level < 2 || level > 3) return [];
    return [{ id: ids[index]!, label: plainText(node), level }];
  });
}

function safeHref(value: unknown) {
  if (typeof value !== "string") return null;
  return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(value) ? value : null;
}

function TextNode({ node, nodeKey }: { node: RichNode; nodeKey: string }) {
  let output: ReactNode = node.text ?? "";

  for (const [index, mark] of (node.marks ?? []).entries()) {
    const key = `${nodeKey}-mark-${index}`;
    if (mark.type === "bold") output = <strong key={key} className="font-bold text-[var(--foreground)]">{output}</strong>;
    if (mark.type === "italic") output = <em key={key}>{output}</em>;
    if (mark.type === "code") output = <code key={key} className="rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.88em] text-[var(--foreground)]">{output}</code>;
    if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      if (href) {
        const external = /^https?:\/\//i.test(href);
        output = <a key={key} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="font-semibold text-[var(--blog-accent)] underline decoration-[#ff5400]/35 decoration-2 underline-offset-4 hover:text-[#ff5400] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5400]">{output}</a>;
      }
    }
  }

  return output;
}

function InlineNodes({ nodes, nodeKey }: { nodes?: RichNode[]; nodeKey: string }) {
  return nodes?.map((node, index) => node.type === "text" ? <TextNode key={`${nodeKey}-${index}`} node={node} nodeKey={`${nodeKey}-${index}`} /> : <Node key={`${nodeKey}-${index}`} node={node} nodeKey={`${nodeKey}-${index}`} />) ?? null;
}

function Node({ node, nodeKey, headingAnchor }: { node: RichNode; nodeKey: string; headingAnchor?: string | null }) {
  const children = <InlineNodes nodes={node.content} nodeKey={nodeKey} />;

  switch (node.type) {
    case "text":
      return <TextNode node={node} nodeKey={nodeKey} />;
    case "paragraph":
      return <p className="my-5 text-[1.05rem] leading-8 text-[var(--muted)] sm:text-[1.1rem]">{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const className = "scroll-mt-28 font-display font-black tracking-tight text-[var(--foreground)]";
      if (level === 3) return <h3 id={headingAnchor ?? undefined} className={`${className} mb-3 mt-9 text-xl sm:text-2xl`}>{children}</h3>;
      if (level === 1) return <h2 id={headingAnchor ?? undefined} className={`${className} mb-4 mt-12 text-3xl sm:text-4xl`}>{children}</h2>;
      return <h2 id={headingAnchor ?? undefined} className={`${className} mb-4 mt-12 text-2xl sm:text-3xl`}>{children}</h2>;
    }
    case "bulletList":
      return <ul className="my-6 list-disc space-y-2.5 pl-6 text-[1.05rem] leading-7 text-[var(--muted)] marker:text-[#ff5400] sm:text-[1.1rem]">{node.content?.map((item, index) => <Node key={`${nodeKey}-${index}`} node={item} nodeKey={`${nodeKey}-${index}`} />)}</ul>;
    case "orderedList":
      return <ol className="my-6 list-decimal space-y-2.5 pl-6 text-[1.05rem] leading-7 text-[var(--muted)] marker:font-bold marker:text-[#ff5400] sm:text-[1.1rem]">{node.content?.map((item, index) => <Node key={`${nodeKey}-${index}`} node={item} nodeKey={`${nodeKey}-${index}`} />)}</ol>;
    case "listItem":
      return <li className="pl-1 [&>p]:my-0">{children}</li>;
    case "blockquote":
      return <blockquote className="my-8 rounded-r-2xl border-l-4 border-[#ff5400] bg-[#ff5400]/6 px-6 py-2 italic [&_p]:text-[var(--foreground)]">{children}</blockquote>;
    case "codeBlock":
      return <pre className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#111113] p-5 text-sm leading-6 text-neutral-100"><code>{plainText(node)}</code></pre>;
    case "horizontalRule":
      return <hr className="my-10 border-[var(--border)]" />;
    default:
      return <>{children}</>;
  }
}

export function RichContent({ content }: { content: Record<string, unknown>[] }) {
  const nodes = content as RichNode[];
  const ids = headingIds(nodes);
  return (
    <div className="blog-content">
      {nodes.map((node, index) => <Node key={index} node={node} nodeKey={String(index)} headingAnchor={ids[index]} />)}
    </div>
  );
}
