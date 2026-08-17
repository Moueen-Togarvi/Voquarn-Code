import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const proxy = auth((request) => {
  const isAdminMutation =
    request.nextUrl.pathname.startsWith("/api/admin/") && unsafeMethods.has(request.method);

  if (isAdminMutation) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    const allowedOrigins = new Set([request.nextUrl.origin]);

    if (process.env.SITE_URL) {
      try {
        allowedOrigins.add(new URL(process.env.SITE_URL).origin);
      } catch {
        // A malformed SITE_URL is ignored; the concrete request origin remains allowed.
      }
    }

    if (!origin || fetchSite === "cross-site" || !allowedOrigins.has(origin)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    const maxBytes = request.nextUrl.pathname === "/api/admin/upload" ? 31 * 1024 * 1024 : 1024 * 1024;
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin((?!/login).*)", "/api/admin/:path*"],
};
