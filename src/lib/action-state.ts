// The shape every form action returns, so every form can show errors the same way.

export type ActionState<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; data?: T }
  | undefined;

export class ActionError extends Error {}

/** Wraps an action body: expected problems become friendly messages, unexpected ones are logged. */
export async function runAction<T>(fn: () => Promise<ActionState<T>>): Promise<ActionState<T>> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ActionError) return { ok: false, error: error.message };
    // Next.js uses thrown errors for redirects — let those through.
    if (error && typeof error === "object" && "digest" in error && String((error as { digest: unknown }).digest).startsWith("NEXT_")) throw error;
    console.error("Action failed:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/** Zod error → { fieldName: "message" } */
export function firstFieldErrors(fieldErrors: Record<string, string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) if (messages?.[0]) out[key] = messages[0];
  return out;
}
