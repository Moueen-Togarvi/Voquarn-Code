// Next.js 16 renamed Middleware to Proxy. Keeping Auth.js here protects the
// admin UI and admin APIs while using the Node.js runtime required by bcrypt.
export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/admin((?!/login).*)", "/api/admin/:path*"],
};
