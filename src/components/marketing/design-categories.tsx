import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_KEYS, PLANS, planFeatures } from "@/lib/plans";
import { formatPkr } from "@/lib/site";
import { templatesByPlan } from "@/templates/registry";
import { DesignCard } from "./design-card";

const SHOWN = [0, 1, 4, 5, 6]; // the feature lines worth showing on the website

/** The designs grouped by category, each with its price: Regular, Advanced, Prime and Royal. */
export function DesignCategories({ orderHref }: { orderHref: (text: string) => string }) {
  return (
    <div>
      <nav aria-label="Design categories" className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
        {PLAN_KEYS.map((key) => (
          <a key={key} href={`#${PLANS[key].label.toLowerCase()}`} className="rounded-full border border-gold/40 bg-white px-4 py-2 text-sm font-medium text-maroon transition hover:bg-cream">
            {PLANS[key].label} <span className="text-ink/55">from {formatPkr(PLANS[key].pricePkr)}</span>
          </a>
        ))}
      </nav>

      {PLAN_KEYS.map((key) => {
        const plan = PLANS[key];
        const features = planFeatures(key).filter((_, i) => SHOWN.includes(i));
        return (
          <section key={key} id={plan.label.toLowerCase()} className="scroll-mt-24 pt-14">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex flex-col gap-5 border-b border-gold/30 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-eyebrow !text-left">{plan.label} designs</p>
                  <h3 className="mt-1 font-serif text-4xl text-maroon sm:text-5xl">
                    {formatPkr(plan.pricePkr)}
                  </h3>
                  <p className="mt-2 max-w-xl text-ink/70">{plan.blurb}.</p>
                </div>
                <ul className="grid gap-x-8 gap-y-1.5 text-sm text-ink/75 sm:grid-cols-2 lg:max-w-xl">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-dark" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templatesByPlan(key).map((t) => (
                  <div key={t.key} data-fx="rise">
                    <DesignCard template={t} orderHref={orderHref(`Hi, I want to order the ${t.name} invitation (${plan.label}, ${formatPkr(plan.pricePkr)}).`)} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <p className="mt-10 text-center text-sm text-ink/55">
        <Link href="/designs" className="hover:text-maroon">All prices are one time, per wedding.</Link>
      </p>
    </div>
  );
}
