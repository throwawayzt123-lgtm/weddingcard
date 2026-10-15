"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The full details are in the server log; this id helps find them.
    console.error("Page error", error.digest);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="section-eyebrow">Something went wrong</p>
        <h1 className="section-title">Sorry, that did not work</h1>
        <p className="mt-4 text-ink/70">Please try again. If it keeps happening, message us on WhatsApp and mention the time it happened.</p>
        {error.digest && <p className="mt-2 text-xs text-ink/40">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">Home</Link>
        </div>
      </div>
    </main>
  );
}
