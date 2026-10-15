// Next.js 16 "proxy" (this was called "middleware" in Next.js 15).
// Runs before /admin, /portal and /login pages and redirects visitors who
// are not logged in, or not allowed. See `authorized` in auth.config.ts.
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login"],
};
