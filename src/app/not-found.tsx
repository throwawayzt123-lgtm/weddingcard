import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="section-eyebrow">Error 404</p>
        <h1 className="section-title">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-ink/70">The link may be old or mistyped. If you were sent an invitation link, please ask the family to send it again.</p>
        <Link href="/" className="btn-primary mt-8">
          Go to {SITE.brandName}
        </Link>
      </div>
    </main>
  );
}
