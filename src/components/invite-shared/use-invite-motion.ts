"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap, horizontalScroll, parallax, riseIn, ScrollTrigger, stackCards } from "@/lib/motion";

/**
 * The scroll choreography of an invitation (GSAP + ScrollTrigger):
 *  - the names and verse are revealed at the moment the opening screen finishes, then drift away as you scroll
 *  - sections rise into place; the two families arrive from opposite sides
 *  - the couple photo has parallax depth
 *  - the event cards PILE UP on top of each other
 *  - the gallery is pinned and slides SIDEWAYS while you scroll down
 * Skipped completely for people who prefer reduced motion (they get the plain page).
 */
export function useInviteMotion(root: RefObject<HTMLElement | null>, options: { introDelay: number; opened: boolean }) {
  const { introDelay, opened } = options;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector, el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.dataset.motion = "on";

      // ---- Hero: entrance timed to the end of the opening screen, then a parallax exit ----
      const hero = el.querySelector<HTMLElement>(".inv-hero");
      const inner = el.querySelector<HTMLElement>(".inv-hero-inner");
      if (hero && inner) {
        const tl = gsap.timeline({ delay: introDelay, defaults: { ease: "power3.out" } });
        tl.from(inner.querySelectorAll("[data-m=hero]"), { y: 30, opacity: 0, duration: 1, stagger: 0.12 })
          .from(inner.querySelectorAll(".inv-name"), { yPercent: 40, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 1.3, stagger: 0.2, ease: "power4.out" }, 0.1)
          .from(hero.querySelector(".inv-scroll-hint"), { opacity: 0, duration: 0.8 }, ">-0.3");
        gsap.to(inner, {
          yPercent: -14,
          scale: 0.93,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom 25%", scrub: true },
        });
        gsap.to(hero.querySelector(".inv-scroll-hint"), { opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "+=180", scrub: true } });
      }

      // ---- Sections ----
      riseIn(q("[data-m=rise]"));
      riseIn(q("[data-m=panel]"), { y: 64, scale: 0.95 });
      const sides = q("#blessings .inv-family-side");
      if (sides[0]) riseIn([sides[0]], { x: -70, y: 0, start: "top 92%" });
      if (sides[1]) riseIn([sides[1]], { x: 70, y: 0, start: "top 92%" });
      riseIn(q("#greeting .inv-chip"), { y: 22, scale: 0.7, stagger: 0.07, start: "top 94%" });
      riseIn(q("#countdown .inv-count-cell"), { y: 36, stagger: 0.1, start: "top 92%" });
      riseIn(q(".inv-footer > *"), { y: 26, stagger: 0.1, start: "top 96%" });

      // ---- Couple photo: the picture drifts slower than its frame ----
      const photo = el.querySelector<HTMLElement>(".inv-couple-photo");
      const img = photo?.querySelector("img");
      if (photo && img) {
        gsap.set(img, { scale: 1.22 });
        parallax(img, -9, 9, photo);
      }

      // ---- Events pile up like cards on a table ----
      stackCards(q("#events .inv-event-card"));

      // ---- Gallery slides sideways ----
      const gallery = el.querySelector<HTMLElement>("#gallery");
      const strip = gallery?.querySelector<HTMLElement>(".inv-gallery-strip");
      if (gallery && strip) {
        const bar = parseFloat(getComputedStyle(el.closest(".invitation") ?? el).getPropertyValue("--inv-bar")) || 0;
        horizontalScroll(gallery, strip, { topOffset: bar });
      }

      return () => {
        delete el.dataset.motion;
      };
    });

    return () => mm.revert();
  }, [root, introDelay]);

  // Layout changes once the opening screen is gone (the page becomes scrollable) and as fonts load.
  useEffect(() => {
    if (!opened) return;
    const timers = [setTimeout(() => ScrollTrigger.refresh(), 100), setTimeout(() => ScrollTrigger.refresh(), 1600)];
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => timers.forEach(clearTimeout);
  }, [opened]);
}
