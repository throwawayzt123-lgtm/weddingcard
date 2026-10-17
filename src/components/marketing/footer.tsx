import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

export function MarketingFooter({ brandName, whatsappHref, whatsappDisplay, customHref }: { brandName: string; whatsappHref: string; whatsappDisplay: string; customHref: string }) {
  return (
    <>
      <footer className="bg-maroon-dark text-ivory">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <p className="font-serif text-2xl">{brandName}</p>
            <p className="mt-2 max-w-xs text-sm text-ivory/70">Animated wedding invitations with personal guest links, RSVP and maps. Made for sharing on WhatsApp.</p>
          </div>
          <nav aria-label="Footer" className="text-sm">
            <p className="font-semibold tracking-wider text-gold-light uppercase">Explore</p>
            <ul className="mt-3 space-y-2 text-ivory/80">
              <li><Link href="/designs" className="hover:text-white">All designs</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white">How it works</Link></li>
              <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/login" className="hover:text-white">Customer login</Link></li>
            </ul>
          </nav>
          <div className="text-sm">
            <p className="font-semibold tracking-wider text-gold-light uppercase">Contact</p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-ivory/90 hover:text-white">
              <MessageCircle className="size-4" />
              {whatsappDisplay}
            </a>
            <a href={customHref} target="_blank" rel="noopener noreferrer" className="btn-custom mt-4 !min-h-11 !px-5 !py-2.5 !text-sm">
              <Sparkles className="size-4" />
              Order Custom Design
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/55">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 sm:right-6 sm:bottom-6"
      >
        <MessageCircle className="size-7" />
      </a>
    </>
  );
}
