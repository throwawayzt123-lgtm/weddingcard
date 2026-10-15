import {
  Alex_Brush, Allura, Bodoni_Moda, Cinzel, Cormorant_Garamond, Gilda_Display, Great_Vibes, Inter, Imperial_Script, Italiana, Italianno, Jost, Libre_Caslon_Display, Libre_Caslon_Text,
  Marcellus, Noto_Nastaliq_Urdu, Parisienne, Petit_Formal_Script, Pinyon_Script, Playfair_Display, Tenor_Sans,
} from "next/font/google";

// Each font exposes a CSS variable that globals.css maps to a Tailwind class:
//   font-sans, font-serif, font-display, font-script, font-script-alt, font-urdu
// The rarely used decorative fonts use preload: false, so they only download on pages that need them.

/** Clean UI font for the portal and admin panel. */
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

/** Elegant serif for headings and invitation text. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** High-contrast display serif. */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

/** Script font for couple names. */
export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  // Preloaded: it is the couple-names font on three designs and on the homepage headline.
});

/** Alternative, finer script font. */
export const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
});

/** Urdu / Arabic text (verses, Urdu names). */
export const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  display: "swap",
  preload: false,
});

// ---- Fonts used by one design each (downloaded only when that design is opened) ----

/** Nikah Nama: the classic book typeface, plus a fine calligraphic script for the names. */
export const caslon = Libre_Caslon_Text({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-caslon", display: "swap", preload: false });
export const caslonDisplay = Libre_Caslon_Display({ subsets: ["latin"], weight: "400", variable: "--font-caslon-display", display: "swap", preload: false });
export const italianno = Italianno({ subsets: ["latin"], weight: "400", variable: "--font-italianno", display: "swap", preload: false });

/** Chandni: thin, wide-set capitals and a light geometric sans. */
export const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana", display: "swap", preload: false });
export const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap", preload: false });

/** Siyah Taj: a sharp fashion-magazine Didone. */
export const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-bodoni", display: "swap", preload: false });

/** Neelam Kashi: Roman capitals (like carved stone) and a flowing script. */
export const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cinzel", display: "swap", preload: false });
export const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura", display: "swap", preload: false });

/** Chambeli: a formal, delicate script for the names (it sits on pure white). */
export const imperial = Imperial_Script({ subsets: ["latin"], weight: "400", variable: "--font-imperial", display: "swap", preload: false });

/** Farman (wine and gold): a stately display face and a formal pen script. */
export const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda", display: "swap", preload: false });
export const petit = Petit_Formal_Script({ subsets: ["latin"], weight: "400", variable: "--font-petit", display: "swap", preload: false });

/** Jharoka (sandstone): classical Roman capitals and a brush script. */
export const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap", preload: false });
export const alexBrush = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-alex", display: "swap", preload: false });

/** Mor Pankh (peacock): a refined humanist sans and a flowing script. */
export const tenor = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor", display: "swap", preload: false });
export const parisienne = Parisienne({ subsets: ["latin"], weight: "400", variable: "--font-parisienne", display: "swap", preload: false });

export const fontVariables = [inter, cormorant, playfair, greatVibes, pinyon, nastaliq, caslon, caslonDisplay, italianno, italiana, jost, bodoni, cinzel, allura, imperial, gilda, petit, marcellus, alexBrush, tenor, parisienne]
  .map((f) => f.variable)
  .join(" ");
