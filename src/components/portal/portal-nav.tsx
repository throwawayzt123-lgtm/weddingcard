"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, Home, ImageIcon, Music, UserRound, Users, ClipboardList, KeyRound } from "lucide-react";

const ITEMS = [
  { href: "/portal", label: "Home", icon: Home, exact: true },
  { href: "/portal/details", label: "Details", icon: UserRound },
  { href: "/portal/family", label: "Family", icon: Heart },
  { href: "/portal/events", label: "Events", icon: CalendarDays },
  { href: "/portal/guests", label: "Guests", icon: Users },
  { href: "/portal/rsvps", label: "Replies", icon: ClipboardList },
  { href: "/portal/gallery", label: "Photos", icon: ImageIcon },
  { href: "/portal/music", label: "Music", icon: Music },
  { href: "/portal/account", label: "Account", icon: KeyRound },
];

/** Sidebar on large screens; a scrollable row of big tabs on phones. */
export function PortalNav() {
  const pathname = usePathname();
  const active = (item: (typeof ITEMS)[number]) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <>
      <nav aria-label="My invitation" className="hidden w-56 shrink-0 flex-col gap-1 border-r border-ink/10 bg-white p-4 lg:flex">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active(item) ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[0.95rem] font-medium transition ${active(item) ? "bg-cream text-maroon" : "text-ink/75 hover:bg-ink/5"}`}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <nav aria-label="My invitation" className="sticky top-14 z-20 flex gap-1 overflow-x-auto border-b border-ink/10 bg-white px-2 py-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active(item) ? "page" : undefined}
            className={`flex min-w-[4.6rem] shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold ${active(item) ? "bg-maroon text-white" : "text-ink/70"}`}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

