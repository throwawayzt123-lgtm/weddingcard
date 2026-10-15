import { Sparkles } from "lucide-react";

/** "Want something made just for you?" strip with the highlighted custom-design button. */
export function CustomDesignBand({ href }: { href: string }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl border border-gold/50 bg-[linear-gradient(135deg,#fff8e8,#f6e7c2)] px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
      <div>
        <p className="font-serif text-2xl font-medium text-maroon sm:text-3xl">Want something made just for you?</p>
        <p className="mt-1 max-w-xl text-sm text-ink/70 sm:text-base">Tell us your colours, theme and wording and we will design a one-of-a-kind invitation for your wedding.</p>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-custom shrink-0">
        <Sparkles className="size-5" />
        Order Custom Design
      </a>
    </div>
  );
}
