"use client";

import { useEffect } from "react";

/**
 * Scroll choreography for the public website. It looks for data-fx="…" markers that the pages
 * already contain (nothing is hidden before this runs, and nothing happens for visitors who
 * prefer reduced motion):
 *   data-fx="rise"            slides up and fades in when it scrolls into view
 *   data-fx-speed="-12"       drifts at its own speed while the section scrolls by (parallax)
 *   data-fx="stack"           its <li> cards pile on top of each other (CSS sticky + GSAP depth)
 * GSAP is only downloaded when the visitor first scrolls or touches the page (or after 8 seconds),
 * so it never slows down the first screen.
 */
export function PageMotion() {
  useEffect(() => {
    let cancelled = false;
    let started = false;
    let revert: (() => void) | undefined;
    const triggers = ["scroll", "pointerdown", "touchstart", "keydown", "wheel"] as const;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (started) return;
      started = true;
      triggers.forEach((t) => window.removeEventListener(t, start));
      clearTimeout(fallback);
      init();
    };
    triggers.forEach((t) => window.addEventListener(t, start, { passive: true, once: true }));
    fallback = setTimeout(start, 8000);

    function init() {
      import("@/lib/motion").then(({ gsap, ScrollTrigger, riseIn, stackCards }) => {
        if (cancelled) return;
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const q = <T extends HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector);

          // only things still below the screen: anything already on screen stays put
          riseIn(q("[data-fx=rise]").filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92));

          q("[data-fx-speed]").forEach((el) => {
            gsap.to(el, {
              yPercent: Number(el.dataset.fxSpeed),
              ease: "none",
              scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
            });
          });

          stackCards(q("[data-fx=stack] > li"), 0.05);
        });

        revert = () => mm.revert();
        ScrollTrigger.refresh();
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      triggers.forEach((t) => window.removeEventListener(t, start));
      revert?.();
    };
  }, []);

  return null;
}
