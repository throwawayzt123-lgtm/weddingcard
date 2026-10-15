"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Scroll-driven animation helpers (GSAP + ScrollTrigger), shared by the invitations
// and the marketing website. Always call these inside gsap.matchMedia()/gsap.context()
// so everything is cleaned up automatically, and never when the visitor prefers
// reduced motion.

gsap.registerPlugin(ScrollTrigger);
// Phones: the address bar sliding in and out must not make pinned sections jump.
ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger };

/**
 * Cards that PILE UP as you scroll. The CSS (position: sticky) does the piling; this adds
 * the depth: every card shrinks a little more each time another card slides over it.
 */
export function stackCards(cards: HTMLElement[], shrink = 0.045) {
  const n = cards.length;
  if (n < 2) return;
  const progress = new Array<number>(n).fill(0);

  const apply = () => {
    cards.forEach((card, i) => {
      if (i === n - 1) return;
      let covered = 0;
      for (let j = i + 1; j < n; j++) covered += progress[j];
      gsap.set(card, { scale: 1 - shrink * covered, transformOrigin: "50% 0%" });
    });
  };

  cards.forEach((card, j) => {
    if (j === 0) return;
    const stickyTop = () => parseFloat(getComputedStyle(card).top) || 0;
    ScrollTrigger.create({
      trigger: card,
      start: () => `top ${stickyTop() + card.offsetHeight * 0.7}px`,
      end: () => `top ${stickyTop()}px`,
      onUpdate: (self) => {
        progress[j] = self.progress;
        apply();
      },
      onRefresh: (self) => {
        progress[j] = self.progress;
        apply();
      },
    });
  });
}

/**
 * Pins a section while the page scrolls DOWN and slides its strip of cards SIDEWAYS.
 * Each card also straightens up from a small tilt as it reaches the middle.
 */
export function horizontalScroll(section: HTMLElement, strip: HTMLElement, options: { topOffset?: number; tilt?: boolean } = {}) {
  const { topOffset = 0, tilt = true } = options;
  // How far the strip must travel left so its last card ends just inside the screen.
  const shift = () => Math.max(0, section.getBoundingClientRect().left + strip.offsetLeft + strip.scrollWidth - window.innerWidth + 24);

  if (shift() < 40) return; // everything already fits on screen

  const tween = gsap.to(strip, {
    x: () => -shift(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: () => `top ${topOffset}px`,
      end: () => `+=${shift()}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  if (tilt) {
    Array.from(strip.children).forEach((child, i) => {
      gsap.fromTo(
        child,
        { rotate: i % 2 ? 3.5 : -3.5, y: 28 },
        {
          rotate: 0,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: child as Element, containerAnimation: tween, start: "left 96%", end: "left 48%", scrub: true },
        },
      );
    });
  }
}

/** Things slide up (and fade in) in small groups as they scroll into view. */
export function riseIn(items: Element[], options: { y?: number; x?: number; scale?: number; stagger?: number; start?: string } = {}) {
  if (items.length === 0) return;
  const { y = 46, x = 0, scale = 1, stagger = 0.12, start = "top 90%" } = options;
  gsap.set(items, { opacity: 0, y, x, scale });
  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, x: 0, scale: 1, duration: 1, ease: "power3.out", stagger, overwrite: true }),
  });
}

/** Moves an element at its own speed as the page scrolls past (a simple parallax). */
export function parallax(el: Element, fromPercent: number, toPercent: number, trigger: Element = el) {
  gsap.fromTo(
    el,
    { yPercent: fromPercent },
    { yPercent: toPercent, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } },
  );
}
