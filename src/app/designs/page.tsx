import type { Metadata } from "next";
import { DesignCard } from "@/components/marketing/design-card";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { PageMotion } from "@/components/marketing/page-motion";
import { getSettings, waLink } from "@/lib/settings";
import { TEMPLATES } from "@/templates/registry";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Wedding Invitation Designs — Live Demos",
  description: "Browse animated digital wedding invitation designs: royal palace doors, a wax-sealed envelope, festive mehndi curtains and modern emerald. Open any live demo on your phone.",
  alternates: { canonical: "/designs" },
};

export default async function DesignsPage() {
  const settings = await getSettings();
  const wa = (text?: string) => waLink(settings, text);

  return (
    <>
      <MarketingHeader brandName={settings.brandName} logoUrl={settings.logoUrl} whatsappHref={wa("Hi, I'd like to order a wedding invitation.")} />
      <main className="bg-[linear-gradient(#fbf7f0,#f3ead9)] pt-14 pb-24">
        <PageMotion />
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="section-eyebrow">Our designs</p>
            <h1 className="section-title">Choose your invitation</h1>
            <p className="mx-auto mt-4 max-w-xl text-ink/70">
              Every design includes personal guest links, music, countdown, maps and RSVP. Open a live demo to see exactly what your guests will experience — best on your phone, with the sound on.
            </p>
          </div>
          <div className="mt-12 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {TEMPLATES.map((t) => (
              <div key={t.key} data-fx="rise">
                <DesignCard template={t} orderHref={wa(`Hi, I want to order the ${t.name} invitation.`)} />
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-sm text-ink/60">Want something different? Message us — we can adapt colours and wording to your wedding.</p>
        </div>
      </main>
      <MarketingFooter brandName={settings.brandName} whatsappHref={wa()} whatsappDisplay={settings.whatsappDisplay} />
    </>
  );
}
