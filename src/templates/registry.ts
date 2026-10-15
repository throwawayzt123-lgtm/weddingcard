// The list of designs customers can choose from.
// To add a design: create src/templates/<key>/, add it to loader.tsx and add
// an entry below. Nothing else in the app needs to change.

export type MusicTrack = {
  key: string;
  label: string;
  /** File in /public/music — replace with your own royalty-free MP3 (same name). */
  file: string;
  mood: string;
};

export const MUSIC_TRACKS: MusicTrack[] = [
  { key: "shahi-sitar", label: "Shahi Sitar", file: "/music/shahi-sitar.mp3", mood: "Royal, classical sitar" },
  { key: "soft-piano", label: "Soft Piano", file: "/music/soft-piano.mp3", mood: "Romantic, gentle piano" },
  { key: "festive-dhol", label: "Festive Dhol", file: "/music/festive-dhol.mp3", mood: "Joyful, rhythmic" },
  { key: "calm-pads", label: "Calm Bells", file: "/music/calm-pads.mp3", mood: "Modern, ambient" },
];

export function getTrack(key: string | null | undefined): MusicTrack | undefined {
  return MUSIC_TRACKS.find((t) => t.key === key);
}

export type TemplateMeta = {
  key: string;
  name: string;
  /** One line shown on cards. */
  tagline: string;
  description: string;
  /** Colour swatches shown on the gallery card. */
  colors: { name: string; hex: string }[];
  /** Screenshot used on the gallery (public/templates/<key>/thumb.webp). */
  thumbnail: string;
  /** Opening animation, shown as a small label. */
  opening: string;
  defaultTrack: string;
  /** Tracks offered in the portal for this design. */
  tracks: string[];
  /** Best for, shown as chips. */
  bestFor: string[];
};

export const TEMPLATES: TemplateMeta[] = [
  {
    key: "shahi-darwaza",
    name: "Shahi Darwaza",
    tagline: "Royal Mughal doors that swing open",
    description:
      "A carved wooden palace door inside a Mughal arch. Tap, and the doors open in 3D to reveal a maroon-and-gold palace. Rich, traditional and unmistakably grand.",
    colors: [
      { name: "Maroon", hex: "#5b1020" },
      { name: "Walnut", hex: "#5a3a22" },
      { name: "Antique gold", hex: "#c9a24b" },
      { name: "Ivory", hex: "#f6ecd9" },
    ],
    thumbnail: "/templates/shahi-darwaza/thumb.webp",
    opening: "Palace doors open",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "soft-piano", "calm-pads"],
    bestFor: ["Baraat", "Walima", "Traditional families"],
  },
  {
    key: "gulzar",
    name: "Gulzar",
    tagline: "A wax-sealed envelope in a rose garden",
    description:
      "Soft, romantic and pastel. A sealed envelope breaks open to reveal your card, while watercolour florals frame every page and petals drift down the screen.",
    colors: [
      { name: "Blush", hex: "#f4cfd0" },
      { name: "Sage", hex: "#9db08f" },
      { name: "Ivory", hex: "#fff8f3" },
      { name: "Rose gold", hex: "#c98f7e" },
    ],
    thumbnail: "/templates/gulzar/thumb.webp",
    opening: "Wax-sealed envelope",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikkah", "Day weddings", "Romantic couples"],
  },
  {
    key: "mehndi-rang",
    name: "Mehndi Rang",
    tagline: "Embroidered curtains and swaying marigolds",
    description:
      "Bright, playful and full of life. Phulkari-style curtains part to reveal a festival of colour, with marigold garlands, bunting and bold, easy-to-read cards.",
    colors: [
      { name: "Marigold", hex: "#f6a800" },
      { name: "Parrot green", hex: "#2e9e44" },
      { name: "Hot pink", hex: "#e0338a" },
      { name: "Orange", hex: "#f26a1b" },
    ],
    thumbnail: "/templates/mehndi-rang/thumb.webp",
    opening: "Curtains part",
    defaultTrack: "festive-dhol",
    tracks: ["festive-dhol", "shahi-sitar", "calm-pads"],
    bestFor: ["Mehndi", "Dholki", "Mayun"],
  },
  {
    key: "noor",
    name: "Noor",
    tagline: "A gold arch draws itself in the dark",
    description:
      "Modern, minimal and quietly luxurious. A thin gold line draws an arch on deep emerald, the names appear letter by letter, and the invitation unfolds with plenty of space to breathe.",
    colors: [
      { name: "Emerald", hex: "#0b3d2e" },
      { name: "Champagne gold", hex: "#d8c08a" },
      { name: "White", hex: "#fbfaf6" },
      { name: "Ink", hex: "#10241c" },
    ],
    thumbnail: "/templates/noor/thumb.webp",
    opening: "Gold arch draws itself",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Nikkah", "Modern couples", "Destination weddings"],
  },
  {
    key: "nikah-nama",
    name: "Nikah Nama",
    tagline: "A crimson cloth-bound book that opens",
    description:
      "Ivory paper and crimson ink, set like a printed wedding book. A gold-foil cover opens onto chapter-numbered pages, ledger-style event entries and a photograph tipped in by hand. Timeless, formal and quietly royal.",
    colors: [
      { name: "Crimson", hex: "#8f1a2c" },
      { name: "Ivory paper", hex: "#fbf8f2" },
      { name: "Ink", hex: "#2b1a1c" },
      { name: "Gold foil", hex: "#e3c27a" },
    ],
    thumbnail: "/templates/nikah-nama/thumb.webp",
    opening: "A book opens",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "shahi-sitar", "calm-pads"],
    bestFor: ["Nikah", "Formal families", "White & red"],
  },
  {
    key: "chandni",
    name: "Chandni",
    tagline: "Moonlight in silver and slate",
    description:
      "Calm, modern and quietly luxurious. A silver moon-dial turns on a pale ground, then swells like an eclipse into a night-sky invitation. Event tickets with perforated date stubs, round countdown dials and thin, wide-set capitals.",
    colors: [
      { name: "Night", hex: "#1e2329" },
      { name: "Slate", hex: "#2a3038" },
      { name: "Silver", hex: "#b7bec9" },
      { name: "Pearl", hex: "#f4f5f7" },
    ],
    thumbnail: "/templates/chandni/thumb.webp",
    opening: "Moon-dial eclipse",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Modern couples", "Evening nikah", "Grey & silver"],
  },
  {
    key: "siyah-taj",
    name: "Siyah Taj",
    tagline: "Black, old gold and one ruby thread",
    description:
      "Sharp and unmistakably royal. A black roller shutter with your names printed on it lifts to reveal a fashion-magazine invitation: huge Didone type, hairline gold rules, a programme of events with giant date numerals and cut-corner buttons.",
    colors: [
      { name: "Black", hex: "#0a0a0b" },
      { name: "Old gold", hex: "#c9a45c" },
      { name: "Ivory", hex: "#ece6d8" },
      { name: "Ruby", hex: "#b3202f" },
    ],
    thumbnail: "/templates/siyah-taj/thumb.webp",
    opening: "Shutter lifts",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "calm-pads", "soft-piano"],
    bestFor: ["Baraat", "Reception", "Black & gold"],
  },
  {
    key: "neelam-kashi",
    name: "Neelam Kashi",
    tagline: "Sapphire blue and glazed Multani tiles",
    description:
      "A deep sapphire wall of hand-glazed tiles with an arched nameplate. Tap and the tiles flip over from the centre outward. Ivory cards framed with rows of tile-work, carved Roman capitals and a flowing script. Rich, cool and regal.",
    colors: [
      { name: "Sapphire", hex: "#0c1a3b" },
      { name: "Cobalt", hex: "#1c3f94" },
      { name: "Turquoise", hex: "#1d9aa6" },
      { name: "Ivory", hex: "#f7f2e6" },
    ],
    thumbnail: "/templates/neelam-kashi/thumb.webp",
    opening: "Tiles flip over",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "soft-piano", "calm-pads"],
    bestFor: ["Walima", "Reception", "Blue & ivory"],
  },
  {
    key: "chambeli",
    name: "Chambeli",
    tagline: "Pure white, with hand-drawn jasmine",
    description:
      "Clean white pages and soft sage, with real jasmine sprigs trailing across the corners and over the edges of every card. A jasmine flower unfurls around your names, then scatters its petals. Oval photo frames, a thread of champagne gold. Light, fragrant and effortlessly elegant.",
    colors: [
      { name: "Pure white", hex: "#ffffff" },
      { name: "Sage", hex: "#6f8a76" },
      { name: "Deep sage", hex: "#4c6853" },
      { name: "Champagne", hex: "#b79a62" },
    ],
    thumbnail: "/templates/chambeli/thumb.webp",
    opening: "A jasmine unfurls",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikah", "Day weddings", "White & floral"],
  },
  {
    key: "farman",
    name: "Farman",
    tagline: "A royal decree sealed in wine-red wax",
    description:
      "Deep wine red and antique gold. A rolled royal decree with your initials in wax unrolls to show the names, then the page opens onto parchment cards with gold corner flourishes, wax-seal date badges and a hairline gold frame. Stately, warm and unmistakably regal.",
    colors: [
      { name: "Wine", hex: "#4a0f20" },
      { name: "Antique gold", hex: "#d4b06a" },
      { name: "Parchment", hex: "#f6ecd6" },
      { name: "Wax red", hex: "#8a1f3a" },
    ],
    thumbnail: "/templates/farman/thumb.webp",
    opening: "Wax-sealed scroll unrolls",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "soft-piano", "calm-pads"],
    bestFor: ["Baraat", "Walima", "Wine & gold"],
  },
  {
    key: "jharoka",
    name: "Jharoka",
    tagline: "Sandstone, terracotta and a carved lattice window",
    description:
      "A warm sandstone page with a faint stone-lattice screen. A palace window with carved shutters slides open and the evening sun floods in. Arch-framed names, little arched date badges in terracotta and a thread of turquoise. Warm, earthy and graceful.",
    colors: [
      { name: "Sandstone", hex: "#f3e8d4" },
      { name: "Terracotta", hex: "#a8482a" },
      { name: "Bronze", hex: "#9a7239" },
      { name: "Turquoise", hex: "#2f7f7a" },
    ],
    thumbnail: "/templates/jharoka/thumb.webp",
    opening: "Lattice shutters slide open",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "shahi-sitar", "calm-pads"],
    bestFor: ["Mehndi", "Day weddings", "Earthy & warm"],
  },
  {
    key: "mor-pankh",
    name: "Mor Pankh",
    tagline: "Peacock teal, deep blue and gold",
    description:
      "A deep peacock-green page with a faint feather-scale pattern. A closed fan of peacock feathers spreads open to reveal the invitation. Dark glass cards crowned with a feather eye, date badges drawn as peacock eyes and leaf-shaped photo frames. Rich, cool and dramatic.",
    colors: [
      { name: "Peacock", hex: "#07363d" },
      { name: "Deep blue", hex: "#123f6b" },
      { name: "Gold", hex: "#d8b45c" },
      { name: "Ivory", hex: "#f2ead6" },
    ],
    thumbnail: "/templates/mor-pankh/thumb.webp",
    opening: "Peacock fan spreads open",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "shahi-sitar", "soft-piano"],
    bestFor: ["Reception", "Evening events", "Teal & blue"],
  },
];

export function getTemplate(key: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
