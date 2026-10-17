import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { BellRing, CalendarCheck, Check, Gift, Heart, Languages, MapPinned, Music2, Send, Sparkles, Users, Wallet } from "lucide-react";
import { DesignCard } from "@/components/marketing/design-card";
import { MarketingFooter } from "@/components/marketing/footer";
import { CustomDesignBand } from "@/components/marketing/custom-band";
import { MarketingHeader } from "@/components/marketing/header";
import { PageMotion } from "@/components/marketing/page-motion";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { CUSTOM_ORDER_MESSAGE } from "@/lib/site";
import { getSettings, waLink } from "@/lib/settings";
import { TEMPLATES } from "@/templates/registry";

// The page reads the brand and contact details from the database; refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Digital Wedding Invitations in Pakistan | Elegant Cards for WhatsApp" },
  description:
    "Elegant animated wedding invitations with personal guest links, RSVP, venue maps and music. Choose a design and share it with your family on WhatsApp.",
  alternates: { canonical: "/" },
};

const STEPS = [
  { icon: Sparkles, title: "Choose your design", text: "Open the live demos on your phone and pick the one that feels like your family." },
  { icon: Wallet, title: "Confirm your order", text: "Send us a message on WhatsApp. We will guide you through payment and the few details we need." },
  { icon: Gift, title: "Receive your portal", text: "We prepare your invitation and send you a private login. Add your events, families and photos whenever you like." },
  { icon: Send, title: "Share with your guests", text: "Every guest receives a personal link that welcomes them by name. You can see who has opened it." },
];

// A different colour for each of the four stacked cards, so the pile is easy to see.
const STEP_STYLES = [
  { card: "border-gold/40 bg-ivory text-ink", icon: "text-gold-dark" },
  { card: "border-gold/50 bg-cream text-ink", icon: "text-maroon" },
  { card: "border-maroon-dark bg-maroon text-ivory", icon: "text-gold-light" },
  { card: "border-black/20 bg-maroon-dark text-ivory", icon: "text-gold" },
];

const FEATURES = [
  { icon: Users, title: "Personal guest links", text: "Welcome each guest the way you would in person, as Mr & Mrs Ali or Mr Ali and his family. They see only the events meant for them." },
  { icon: Music2, title: "Tap to open, with music", text: "A graceful opening, then soft music that begins when your guest taps." },
  { icon: CalendarCheck, title: "RSVP and headcount", text: "Guests answer Yes, No or Maybe for each event. You see the totals and can export the list to Excel." },
  { icon: MapPinned, title: "Maps and calendar", text: "Directions and an add to calendar button for every ceremony." },
  { icon: BellRing, title: "Live countdown", text: "A countdown to the first event builds anticipation as the day draws near." },
  { icon: Languages, title: "Urdu and English", text: "Add Bismillah or any verse in Urdu or Arabic, set in elegant Nastaliq." },
];

const FAQ = [
  { q: "How do I order?", a: "Choose a design and tap Order This Design. WhatsApp opens with your message ready, and we reply with the next steps." },
  { q: "How does payment work?", a: "We accept bank transfer, JazzCash and EasyPaisa. Once your payment is received we create your invitation and send you your login, usually within a few hours." },
  { q: "Can I change details after I receive my portal?", a: "Yes. You can edit events, venues, times, family names, photos, music and guests at any time. Only the names of the bride and groom, and the web address, are fixed. If there is a spelling mistake, message us and we will correct it at no charge." },
  { q: "Why are the couple names fixed?", a: "Each invitation belongs to one couple. Fixing the names protects your invitation from being copied for another wedding." },
  { q: "Do my guests need to install anything?", a: "No. Guests simply tap the link on WhatsApp and it opens in their phone browser, like any website." },
  { q: "How long will the invitation stay online?", a: "Until 30 days after your last event. After that it shows a polite message that the celebration has concluded. We can extend it on request." },
  { q: "Can I use my own music?", a: "Every design comes with music to choose from. If you would like your own track, let us know and we will arrange it." },
  { q: "Can I change my design later?", a: "Yes. Message us on WhatsApp and we will switch your design. Your details stay exactly as they are." },
];

export default async function HomePage() {
  const settings = await getSettings();
  const wa = (text?: string) => waLink(settings, text);
  const customHref = wa(CUSTOM_ORDER_MESSAGE);

  return (
    <>
      <MarketingHeader brandName={settings.brandName} logoUrl={settings.logoUrl} whatsappHref={wa("Hi, I'd like to order a wedding invitation.")} customHref={customHref} />

      <main>
        <PageMotion />
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-[radial-gradient(90%_60%_at_50%_0%,#f6e3d3,transparent_70%),linear-gradient(#fbf7f0,#f3ead9)]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-24">
            <div className="text-center lg:text-left">
              <p className="section-eyebrow">Digital wedding invitations</p>
              <h1 className="mt-4 font-serif text-5xl leading-[1.05] font-medium text-maroon sm:text-6xl lg:text-7xl">
                Your invitation, <span className="font-script text-gold-dark">beautifully alive</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/75 lg:mx-0">
                A tap opens a palace door, an envelope or a garden gate, and soft music begins. Share one link on WhatsApp and every guest is welcomed by name, with directions, a countdown and a simple way to reply.
              </p>
              <div className="mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/designs" className="btn-primary">
                  See live designs
                </Link>
                <a href={customHref} target="_blank" rel="noopener noreferrer" className="btn-custom">
                  <Sparkles className="size-5" />
                  Order Custom Design
                </a>
                <a href={wa("Hi, I'd like to order a wedding invitation.")} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Order on WhatsApp
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink/70 lg:justify-start">
                {["Personal guest links", "RSVP tracking", "Ready in hours", "Urdu and English"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="size-4 text-gold-dark" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Three phones, slightly overlapping */}
            <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-0 sm:max-w-lg" aria-hidden>
              <div data-fx-speed="-26" className="z-10 -mr-6 w-[34%] sm:-mr-8">
                <div className="float-slow translate-y-8">
                  <PhoneMockup template={TEMPLATES[2]} sizes="160px" />
                </div>
              </div>
              <div data-fx-speed="-8" className="z-20 w-[40%]">
                <div className="float-slower">
                  <PhoneMockup template={TEMPLATES[1]} priority sizes="220px" />
                </div>
              </div>
              <div data-fx-speed="-18" className="z-10 -ml-6 w-[34%] sm:-ml-8">
                <div className="float-slow translate-y-8">
                  <PhoneMockup template={TEMPLATES[4]} sizes="160px" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- How it works: the four cards pile up as you scroll ---------- */}
        <section id="how-it-works" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div data-fx="rise" className="text-center">
              <p className="section-eyebrow">How it works</p>
              <h2 className="section-title">Four simple steps to a finished invitation</h2>
            </div>
            <ol data-fx="stack" className="mx-auto mt-14 max-w-3xl">
              {STEPS.map((s, i) => (
                <li key={s.title} className={`fx-stack-card ${STEP_STYLES[i].card}`} style={{ "--i": i } as CSSProperties}>
                  <span className="font-serif text-7xl leading-none opacity-30 sm:text-8xl">0{i + 1}</span>
                  <div>
                    <s.icon className={`size-8 ${STEP_STYLES[i].icon}`} />
                    <h3 className="mt-3 font-serif text-3xl">{s.title}</h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed opacity-80">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Designs: a simple grid ---------- */}
        <section id="designs" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <p className="section-eyebrow">The designs</p>
              <h2 className="section-title">Pick the one that feels like you</h2>
              <p className="mx-auto mt-4 max-w-xl text-ink/70">Open any live demo to see it exactly as your guests will.</p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <div key={t.key} data-fx="rise">
                <DesignCard template={t} orderHref={wa(`Hi, I want to order the ${t.name} invitation.`)} />
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-6xl px-4">
            <CustomDesignBand href={customHref} />
          </div>
        </section>

        {/* ---------- Features ---------- */}
        <section className="bg-maroon py-20 text-ivory">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <p className="text-xs font-bold tracking-[0.3em] text-gold-light uppercase">Everything included</p>
              <h2 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">Thoughtful details for every guest</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} data-fx="rise" className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <f.icon className="size-7 text-gold-light" />
                  <h3 className="mt-4 font-serif text-2xl">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/75">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <p className="section-eyebrow">Questions</p>
              <h2 className="section-title">Good to know</h2>
            </div>
            <div className="mt-10 divide-y divide-ink/10 rounded-3xl border border-gold/30 bg-ivory">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-maroon [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="text-2xl text-gold-dark transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final call to action ---------- */}
        <section className="bg-[linear-gradient(135deg,#7a1f35,#4d1220)] py-20 text-center text-ivory">
          <div className="mx-auto max-w-2xl px-4">
            <Heart className="mx-auto size-8 fill-gold-light text-gold-light" />
            <h2 className="mt-5 font-serif text-4xl font-medium sm:text-5xl">Ready to invite your guests?</h2>
            <p className="mt-4 text-ivory/80">Message us on WhatsApp and your invitation can be ready today.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={customHref} target="_blank" rel="noopener noreferrer" className="btn-custom">
                <Sparkles className="size-5" />
                Order Custom Design
              </a>
              <a href={wa("Hi, I'd like to order a wedding invitation.")} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-white/10 ring-1 ring-white/30 hover:!bg-white/20">
                Chat on WhatsApp · {settings.whatsappDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter brandName={settings.brandName} whatsappHref={wa()} whatsappDisplay={settings.whatsappDisplay} customHref={customHref} />
    </>
  );
}
