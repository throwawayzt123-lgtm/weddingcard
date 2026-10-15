"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail, PlusCircle, ScrollText, Settings, Users } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard, exact: true },
  { href: "/admin/invitations", label: "Invitations", short: "Cards", icon: Mail },
  { href: "/admin/invitations/new", label: "New invitation", short: "New", icon: PlusCircle, exact: true, highlight: true },
  { href: "/admin/clients", label: "Clients", short: "Clients", icon: Users },
  { href: "/admin/audit", label: "Audit log", short: "Log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", short: "Settings", icon: Settings },
];

function isActive(pathname: string, item: (typeof ITEMS)[number]) {
  if (item.exact) return pathname === item.href;
  // "Invitations" should not light up on the "New invitation" page
  if (item.href === "/admin/invitations") return pathname.startsWith(item.href) && pathname !== "/admin/invitations/new";
  return pathname.startsWith(item.href);
}

/** Sidebar on large screens, bottom bar on phones. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <>
      <nav aria-label="Admin" className="hidden w-60 shrink-0 flex-col gap-1 border-r border-ink/10 bg-white p-4 lg:flex">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[0.95rem] font-medium transition ${
                item.highlight ? "bg-maroon text-white hover:bg-maroon-dark" : active ? "bg-cream text-maroon" : "text-ink/75 hover:bg-ink/5"
              }`}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-ink/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.65rem] font-semibold ${active ? "text-maroon" : "text-ink/60"}`}>
              <item.icon className={`size-5 ${item.highlight ? "text-gold-dark" : ""}`} />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
