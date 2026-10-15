import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight Auth.js settings shared by `auth.ts` and `proxy.ts`.
 * No database or bcrypt imports here, so the proxy stays fast.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [], // added in auth.ts
  callbacks: {
    /**
     * Runs in proxy.ts for /admin, /portal and /login. This is the first,
     * quick check only — every page and server action checks again on the
     * server via src/lib/dal.ts.
     */
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;
      const home = user?.role === "ADMIN" ? "/admin" : "/portal";

      if (path.startsWith("/admin")) {
        if (!user) return false; // → /login?callbackUrl=...
        if (user.role !== "ADMIN") return Response.redirect(new URL("/portal", nextUrl));
        return true;
      }
      if (path.startsWith("/portal")) {
        return !!user;
      }
      if (path === "/login" && user && !nextUrl.searchParams.has("reauth")) {
        // Already logged in: skip the login page.
        return Response.redirect(new URL(home, nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      // `user` is only present right after a successful login.
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.sessionVersion = user.sessionVersion;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.sessionVersion = token.sessionVersion;
      return session;
    },
  },
} satisfies NextAuthConfig;
