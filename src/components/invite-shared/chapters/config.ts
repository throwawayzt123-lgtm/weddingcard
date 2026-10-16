import type { EventKind } from "@/templates/types";

export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position, to keep the interesting part in view. */
  position?: string;
  /** Pin this picture to one of the design's colour surfaces (by index). */
  surface?: number;
};

/** One colour scheme of a chapter. */
export type Surface = {
  bg: string;
  ink: string;
  /** The "gold": rules, small accents and buttons. Must read well on `bg`. */
  accent: string;
};

/**
 * How a chapter is put together:
 *  split    text on the left, a big picture on the right
 *  flip     a big picture on the left, text on the right
 *  overlay  a full-screen picture with the text on a frosted card
 *  arch     the picture sits in a tall arched window beside the text
 *  poster   a wide picture across the top, the details below in two columns
 * (On phones every layout puts the picture on top, but keeps its own shape.)
 */
export type Layout = "split" | "flip" | "overlay" | "arch" | "poster";

/** Everything a design decides about its full-screen chapters. */
export type ChapterConfig = {
  /** The pictures, used in turn so the background changes with every chapter. */
  photos: Photo[];
  /** Pictures that fit a kind of celebration (index into `photos`), e.g. henna hands for the Mehndi. */
  eventPhotos?: Partial<Record<EventKind, number>>;
  /** Colour schemes the chapters alternate between. */
  surfaces: Surface[];
  /** Layouts the chapters cycle through. */
  layouts: Layout[];
  /** Style hooks (CSS variables) such as --ch-sans, --ch-names-font, --ch-title-transform. */
  vars?: Record<string, string>;
};
