import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

/** Thrown when someone tries too many passwords. Shown as a friendly message. */
class TooManyAttempts extends CredentialsSignin {
  code = "rate_limited";
}

/** Thrown when the database is unreachable, so the login page can say so. */
class LoginUnavailable extends CredentialsSignin {
  code = "unavailable";
}

/** Hash of a random throwaway password; never matches anything. */
const DUMMY_HASH = "$2b$12$/XTs4ZqHJEqwxxQK.Jr9xuxzJwLbKOyK9LgmS/jT5FZUgFec64Hlu";

const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(1).max(100), // email OR username
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;

        try {
          // Max 20 attempts per IP and 10 per account, every 15 minutes.
          const ip = getClientIp(request.headers);
          const accountKey = `login:id:${identifier}`;
          const [byIp, byAccount] = await Promise.all([
            rateLimit(`login:ip:${ip}`, 20, 15 * 60),
            rateLimit(accountKey, 10, 15 * 60),
          ]);
          if (!byIp.ok || !byAccount.ok) throw new TooManyAttempts();

          const user = await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          });
          // Always run bcrypt, even for unknown users, so response time does not
          // reveal which usernames exist.
          const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
          if (!user || !valid) return null;

          await resetRateLimit(accountKey);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            sessionVersion: user.sessionVersion,
          };
        } catch (error) {
          if (error instanceof CredentialsSignin) throw error;
          // Usually the database can't be reached (wrong DATABASE_URL, or the
          // tables were never created). Show a clear message on the login page.
          console.error("✖ Login failed — database error:", error);
          throw new LoginUnavailable();
        }
      },
    }),
  ],
});
