import type { Metadata } from "next";
import { DesignCategories } from "@/components/marketing/design-categories";
import { MarketingFooter } from "@/components/marketing/footer";
import { CustomDesignBand } from "@/components/marketing/custom-band";
import { MarketingHeader } from "@/components/marketing/header";
import { PageMotion } from "@/components/marketing/page-motion";
import { CUSTOM_ORDER_MESSAGE } from "@/lib/site";
import { getSettings, waLink } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Wedding Invitation Designs | Live Demos",
  description: "Browse animated wedding invitation designs, from palace doors and sealed envelopes to festive mehndi curtains and modern emerald. Open a live demo and see it exactly as your guests will.",
  alternates: { canonical: "/designs" },
};

export default async function DesignsPage() {
  const settings = await getSettings();
  const wa = (text?: string) => waLink(settings, text);
  const customHref = wa(CUSTOM_ORDER_MESSAGE);

  return (
    <>
      <MarketingHeader brandName={settings.brandName} logoUrl={settings.logoUrl} whatsappHref={wa("Hi, I'd like to order a wedding invitation.")} customHref={customHref} />
      <main className="bg-[linear-gradient(#fbf7f0,#f3ead9)] pt-14 pb-24">
        <PageMotion />
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="section-eyebrow">Our designs</p>
            <h1 className="section-title">Choose your invitation</h1>
            <p className="mx-auto mt-4 max-w-xl text-ink/70">
              Every design includes personal guest links, music, countdown, maps and RSVP. Open a live demo to see exactly what your guests will experience. It looks best on your phone, with the sound on.
            </p>
          </div>
          <div className="mt-10">
            <DesignCategories orderHref={wa} />
          </div>
          <CustomDesignBand href={customHref} />
        </div>
      </main>
      <MarketingFooter brandName={settings.brandName} whatsappHref={wa()} whatsappDisplay={settings.whatsappDisplay} customHref={customHref} />
    </>
  );
}
