import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAdmin } from "@/lib/dal";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [admin, settings] = await Promise.all([requireAdmin(), getSettings()]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link href="/admin" className="truncate font-serif text-xl text-maroon">
            {settings.brandName} <span className="ml-1 font-sans text-[0.65rem] font-bold tracking-widest text-ink/45 uppercase">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-ink/5 sm:flex">
              <ExternalLink className="size-4" />
              View site
            </Link>
            <span className="hidden text-sm text-ink/55 md:inline">{admin.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <AdminNav />
        <main className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-8 lg:pb-12">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
