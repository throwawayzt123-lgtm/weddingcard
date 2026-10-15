import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Lock, ShieldCheck } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { getPortalContext } from "@/lib/portal";
import { getSettings, waLink } from "@/lib/settings";

export const metadata: Metadata = {
  title: { default: "My Invitation", template: "%s · My Invitation" },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: LayoutProps<"/portal">) {
  const [ctx, settings] = await Promise.all([getPortalContext(), getSettings()]);
  const { user, invitation, edit, asAdmin } = ctx;
  const help = waLink(settings, invitation ? `Hi, I need help with my invitation (${invitation.groomName} & ${invitation.brideName}).` : "Hi, I need help with my invitation.");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link href="/portal" className="min-w-0 truncate font-serif text-xl text-maroon">
            {settings.brandName}
          </Link>
          <div className="flex items-center gap-1">
            {invitation && (
              <a href={`/i/${invitation.slug}`} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-maroon hover:bg-cream sm:flex">
                <ExternalLink className="size-4" /> Preview
              </a>
            )}
            <span className="hidden text-sm text-ink/55 md:inline">{user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {asAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-ink px-4 py-2 text-sm text-white">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-gold-light" /> You are viewing this customer&apos;s portal as admin
          </span>
          <Link href="/admin" className="font-semibold underline underline-offset-2">
            Back to admin
          </Link>
        </div>
      )}

      {invitation && !edit.editable && (
        <div role="alert" className="flex items-start gap-3 bg-amber-100 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p>
            {edit.reason}{" "}
            <a href={help} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              Message us
            </a>
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:flex-row">
        {invitation && <PortalNav />}
        <main className="min-w-0 flex-1 px-4 pt-6 pb-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            {invitation && (
              <p className="mb-5 flex items-center gap-2 text-sm text-ink/55">
                <Lock className="size-3.5" />
                <span className="font-semibold text-ink/75">
                  {invitation.groomName} &amp; {invitation.brideName}
                </span>
              </p>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
