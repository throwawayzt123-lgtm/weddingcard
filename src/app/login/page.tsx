import type { Metadata } from "next";
import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { callbackUrl, reauth } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center font-serif text-2xl text-maroon">
          {SITE.brandName}
        </Link>

        <div className="card p-6 sm:p-8">
          <h1 className="font-serif text-3xl text-ink">Welcome back</h1>
          <p className="mt-1 mb-6 text-sm text-ink/70">Log in to manage your wedding invitation.</p>

          {reauth && (
            <p className="mb-5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
              Your session has ended. Please log in again.
            </p>
          )}

          <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
        </div>

        <p className="mt-6 text-center text-sm text-ink/70">
          Forgot your password?{" "}
          <a
            href={whatsappLink("Hi, I forgot my invitation portal password.")}
            className="font-medium text-maroon underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
