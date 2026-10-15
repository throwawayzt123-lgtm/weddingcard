import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { buildDemoData } from "@/templates/demo-data";
import { getTemplate } from "@/templates/registry";
import { TemplateHost } from "@/templates/template-host";

// Demo dates are "about 2 months from today", so refresh the page hourly.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/preview/[templateKey]">): Promise<Metadata> {
  const { templateKey } = await params;
  const template = getTemplate(templateKey);
  return {
    title: template ? `${template.name} — Live Demo` : "Design not found",
    robots: { index: false, follow: false },
  };
}

export default async function PreviewPage({ params, searchParams }: PageProps<"/preview/[templateKey]">) {
  const { templateKey } = await params;
  const { guest, embed } = await searchParams;
  // ?embed=1 hides our top bar (used for the thumbnails on the designs page)
  const showBar = embed !== "1";
  const template = getTemplate(templateKey);
  if (!template) notFound();

  const data = buildDemoData(templateKey, { guest: guest !== "0" });
  const orderLink = whatsappLink(`Hi, I want to order the ${template.name} invitation.`);

  return (
    <>
      {showBar && (
        <>
      {/* Tells the opening screen to leave room for the bar below */}
      <style>{":root{--inv-bar:3.5rem}"}</style>
      {/* Sits above the invitation: back, brand and the order button */}
      <div className="fixed inset-x-0 top-0 z-[70] flex h-14 items-center justify-between gap-2 border-b border-white/10 bg-black/60 px-3 text-white backdrop-blur-md">
        <Link href="/designs" className="flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium hover:bg-white/10">
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">All designs</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <Link href="/" className="truncate font-serif text-base text-[#ebd08a] sm:text-lg">
          {SITE.brandName}
        </Link>
        <a
          href={orderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#25d366] px-3.5 text-xs font-bold tracking-wide text-black uppercase hover:brightness-110 sm:px-4 sm:text-sm"
        >
          <MessageCircle className="size-4" />
          Order this design
        </a>
      </div>
        </>
      )}

      <TemplateHost data={data} />
    </>
  );
}
