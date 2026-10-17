import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatPkr } from "@/lib/site";
import type { TemplateMeta } from "@/templates/registry";
import { PhoneMockup } from "./phone-mockup";

/** One design in the gallery: phone preview, details, and the two buttons that matter. */
export function DesignCard({ template, orderHref }: { template: TemplateMeta; orderHref: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/30 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/preview/${template.key}`} className="relative block bg-gradient-to-b from-cream to-ivory px-10 pt-8 pb-6" aria-label={`View ${template.name} live demo`}>
        <span className="absolute top-3 right-3 z-10 rounded-full bg-maroon px-3 py-1 text-[0.65rem] font-bold tracking-widest text-gold-light uppercase">{PLANS[template.plan].label}</span>
        <div className="mx-auto max-w-[210px] transition duration-500 group-hover:scale-[1.03]">
          <PhoneMockup template={template} sizes="210px" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold tracking-[0.22em] text-gold-dark uppercase">{template.opening}</p>
        <h3 className="mt-1 font-serif text-3xl text-maroon">{template.name}</h3>
        <p className="text-sm font-semibold text-gold-dark">{formatPkr(PLANS[template.plan].pricePkr)}</p>
        <p className="mt-1 text-sm font-medium text-ink/70">{template.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">{template.description}</p>

        <div className="mt-4 flex items-center gap-1.5" aria-label="Colours">
          {template.colors.map((c) => (
            <span key={c.hex} title={c.name} className="size-5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.bestFor.map((b) => (
            <span key={b} className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-maroon">
              {b}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-2.5 pt-6 sm:grid-cols-2">
          <Link href={`/preview/${template.key}`} className="btn-secondary !px-4 !text-sm">
            <Eye className="size-4" />
            View Live Demo
          </Link>
          <a href={orderHref} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !text-sm">
            <MessageCircle className="size-4" />
            Order This Design
          </a>
        </div>
      </div>
    </article>
  );
}
