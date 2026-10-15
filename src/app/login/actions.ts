"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error: string } | undefined;

/**
 * Where to go after login. Keeps only the path of the URL (so we never send
 * anyone to another website) and falls back to /dashboard.
 */
function safeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value) return "/dashboard";
  try {
    const url = new URL(value, "http://localhost");
    const path = url.pathname + url.search;
    if (path.startsWith("//") || path.startsWith("/login")) return "/dashboard";
    return path;
  } catch {
    return "/dashboard";
  }
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) {
    return { error: "Please enter your email (or username) and password." };
  }

  try {
    await signIn("credentials", {
      identifier,
      password,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });
  } catch (error) {
    if (error instanceof CredentialsSignin && error.code === "rate_limited") {
      return { error: "Too many attempts. Please wait 15 minutes and try again." };
    }
    if (error instanceof CredentialsSignin && error.code === "unavailable") {
      return {
        error:
          process.env.NODE_ENV === "development"
            ? "Can't connect to the database. Check DATABASE_URL in .env, run npm run db:deploy and npm run db:seed, then restart npm run dev."
            : "Login is temporarily unavailable. Please try again in a few minutes.",
      };
    }
    if (error instanceof AuthError) {
      return { error: "Wrong email/username or password. Please check and try again." };
    }
    // A successful login "throws" a redirect — let Next.js handle it.
    throw error;
  }
}
