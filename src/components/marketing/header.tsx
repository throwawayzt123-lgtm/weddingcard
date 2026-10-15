"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircle, Sparkles, X } from "lucide-react";

const LINKS = [
  { href: "/designs", label: "Designs" },
  { href: "/#how-it-works", label: "How it works" },
  // { href: "/#pricing", label: "Pricing" }, // pricing section is hidden for now
  { href: "/#faq", label: "FAQ" },
];

export function MarketingHeader({ brandName, logoUrl, whatsappHref, customHref }: { brandName: string; logoUrl: string | null; whatsappHref: string; customHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl text-maroon sm:text-2xl" onClick={() => setOpen(false)}>
          {logoUrl && <Image src={logoUrl} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />}
          {brandName}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink/80 hover:text-maroon">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:text-maroon sm:block">
            Customer login
          </Link>
          <a href={customHref} target="_blank" rel="noopener noreferrer" className="btn-custom !min-h-10 !rounded-full !px-4 !py-2 !text-sm max-sm:hidden">
            <Sparkles className="size-4" />
            <span className="hidden lg:inline">Order Custom Design</span>
            <span className="lg:hidden">Custom Design</span>
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hidden min-h-10 items-center gap-2 rounded-full bg-maroon px-4 text-sm font-semibold text-white hover:bg-maroon-dark xl:inline-flex">
            <MessageCircle className="size-4" />
            Order now
          </a>
          <button type="button" className="flex size-11 items-center justify-center rounded-lg text-maroon md:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/25 bg-ivory px-4 pb-5 md:hidden" aria-label="Mobile">
          <a href={customHref} target="_blank" rel="noopener noreferrer" className="btn-custom mt-4 w-full" onClick={() => setOpen(false)}>
            <Sparkles className="size-5" />
            Order Custom Design
          </a>
          <ul className="divide-y divide-ink/10">
            {[...LINKS, { href: "/login", label: "Customer login" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3.5 text-lg font-medium text-ink" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 w-full">
            <MessageCircle className="size-5" />
            Order on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
