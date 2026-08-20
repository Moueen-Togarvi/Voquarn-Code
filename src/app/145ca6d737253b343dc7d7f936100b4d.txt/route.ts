import { INDEXNOW_KEY } from "@/lib/indexnow";

// IndexNow ownership proof: the key must be served as plain text at
// /<key>.txt. The folder name and the exported key must match exactly —
// see the comment in lib/indexnow.ts before changing either.
export const dynamic = "force-static";

export function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
