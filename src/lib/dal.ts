import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { ActionError } from "@/lib/action-state";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------
// Data Access Layer: the REAL security check. proxy.ts only does a quick
// cookie check; every protected page and server action calls one of these.
// ---------------------------------------------------------------

/**
 * The logged-in user, loaded fresh from the database, or null.
 * Returns null if the admin reset this user's password after they logged in
 * (their cookie's sessionVersion no longer matches).
 * `cache` makes repeated calls in one request hit the database only once.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, username: true, role: true, phone: true, sessionVersion: true },
  });
  if (!user || user.sessionVersion !== session.user.sessionVersion) return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Any logged-in user (CLIENT or ADMIN), otherwise sends them to /login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  // "reauth" tells proxy.ts to show the login page even though an (outdated)
  // cookie still exists — otherwise we would loop between pages.
  if (!user) redirect("/login?reauth=1");
  return user;
}

/** Admins only. Clients are sent to their portal. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/portal");
  return user;
}

/**
 * For server ACTIONS (form submissions): returns the admin, or throws an
 * ActionError that is shown to the user. Unlike requireAdmin it never
 * redirects, so a lapsed session produces a clear message.
 */
export async function requireAdminForAction(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new ActionError("Your session has ended. Please log in again.");
  if (user.role !== "ADMIN") throw new ActionError("You are not allowed to do that.");
  return user;
}

/** For server actions used by customers (and admins). */
export async function requireUserForAction(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new ActionError("Your session has ended. Please log in again.");
  return user;
}
