import type { Plan } from "@prisma/client";

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
  /** The category (and price) of the design: BASIC = Regular, STANDARD = Advanced, PREMIUM = Prime, ROYAL = Royal. */
  plan: Plan;
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
    key: "marwareed",
    plan: "PREMIUM",
    name: "Marwareed",
    tagline: "Silk gatefold, French lace and a pearl brooch",
    description:
      "Pure luxury in ivory satin and French lace. A pearl and rhinestone brooch clasps two silk doors; tap, and they swing open in three dimensions onto gold-framed ivory cardstock with scalloped lace, deckled-edge event cards, draped pearl strands and garden roses.",
    colors: [
      { name: "Ivory silk", hex: "#faf6ee" },
      { name: "Antique gold", hex: "#cda358" },
      { name: "Pearl cream", hex: "#f3ede3" },
      { name: "Blush taupe", hex: "#8c6b65" },
    ],
    thumbnail: "/templates/marwareed/thumb.webp",
    opening: "Silk gatefold doors swing open",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Reception", "Walima", "Luxury weddings", "Ivory and gold"],
  },
  {
    key: "sadaf-e-noor",
    plan: "PREMIUM",
    name: "Sadaf-e-Noor",
    tagline: "Blush satin gatefold, rose gold lace and a crystal pearl buckle",
    description:
      "Soft, romantic and quietly royal. Blush pink satin doors edged in rose gold scalloped lace, clasped with a radiant pearl and crystal buckle. Tap, and the doors swing open onto illuminated parchment with petal dividers, deckled celebration cards, and a champagne gold crest.",
    colors: [
      { name: "Blush silk", hex: "#faece8" },
      { name: "Rose gold", hex: "#c59285" },
      { name: "Pearl cream", hex: "#fbf6ec" },
      { name: "Dusky rose", hex: "#a5656a" },
    ],
    thumbnail: "/templates/sadaf-e-noor/thumb.webp",
    opening: "Blush silk doors swing open",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikkah", "Walima", "Blush and rose gold", "Romantic couples"],
  },
  {
    key: "gulab-mahal",
    plan: "ROYAL",
    name: "Gulab Mahal",
    tagline: "A blush envelope opens onto a palace arch at sunset",
    description:
      "A blush pink envelope edged in rose gold, with embossed roses and a rose gold wax seal. Break the seal and the arched flap lifts, the envelope falls away and you look out through a flowered palace arch, past a crystal chandelier and glowing lanterns, to a domed palace at sunset where the couple sits by the water. Your invitation is written in the evening sky. Inside, each celebration waits behind its own arched doorway along a palace corridor.",
    colors: [
      { name: "Blush", hex: "#f1dbcf" },
      { name: "Rose gold", hex: "#b07f6b" },
      { name: "Dusky rose", hex: "#a5656a" },
      { name: "Ivory", hex: "#f5ebe1" },
    ],
    thumbnail: "/templates/gulab-mahal/thumb.webp",
    opening: "Wax sealed envelope opens onto a palace arch",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "shahi-sitar", "calm-pads"],
    bestFor: ["Nikah","Baraat","Blush and rose gold"],
  },
  {
    key: "laal-gulab",
    plan: "ROYAL",
    name: "Laal Gulab",
    tagline: "Burgundy velvet, red roses and an ivory card",
    description:
      "An ivory envelope rests on burgundy velvet among red roses and candles, sealed with wine red wax and a gold tassel. Break the seal and the flap opens, the card slides out and fills the screen: a gold arch on ivory, red roses, hanging lanterns and the bride and groom at its foot, with your invitation inside the arch. Inside, a suite of ivory cards lies on the velvet: a printed order of celebrations, calling cards for the families and a reply card.",
    colors: [
      { name: "Burgundy", hex: "#6e0f22" },
      { name: "Rose red", hex: "#b3182f" },
      { name: "Ivory", hex: "#f8f1e4" },
      { name: "Gold", hex: "#c9a052" },
    ],
    thumbnail: "/templates/laal-gulab/thumb.webp",
    opening: "Velvet envelope, wax seal and tassel; the card slides out",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "soft-piano", "calm-pads"],
    bestFor: ["Baraat","Nikah","Red and gold"],
  },
  {
    key: "mahtab",
    plan: "ROYAL",
    name: "Mahtab",
    tagline: "A full moon rises over a palace at night",
    description:
      "A starry navy sky with the moon low on the horizon. Tap, and the full moon rises into place while a gold Mughal arch, a lit palace on the water and cascades of blue and white roses appear around it. The couple stands on a marble balcony and your invitation is written in the night sky. Inside, the celebrations follow a gold thread down the sky, the moon growing fuller at every one.",
    colors: [
      { name: "Midnight", hex: "#0d1838" },
      { name: "Moon gold", hex: "#d4b46a" },
      { name: "Hydrangea blue", hex: "#8fa9cf" },
      { name: "Pearl", hex: "#f3f4f8" },
    ],
    thumbnail: "/templates/mahtab/thumb.webp",
    opening: "The moon rises and a palace arch appears",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Walima","Evening events","Navy and gold"],
  },
  {
    key: "chaman",
    plan: "ROYAL",
    name: "Chaman",
    tagline: "A sehra of jasmine opens onto a white rose garden",
    description:
      "Strings of jasmine and red roses hang like a groom's sehra over the screen. Tap, and the sehra parts to either side onto a garden card in ivory and sage: white roses and eucalyptus, a fine gold arch for your words, and below it the couple walking under a floral arch towards a white marble pavilion. Inside, each celebration is an arched botanical card with a sprig and a plant label.",
    colors: [
      { name: "Ivory", hex: "#fbfaf4" },
      { name: "Sage", hex: "#7d9479" },
      { name: "White rose", hex: "#ece4d8" },
      { name: "Soft gold", hex: "#b89b5e" },
    ],
    thumbnail: "/templates/chaman/thumb.webp",
    opening: "A jasmine sehra parts",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikah","Day weddings","White and sage"],
  },
  {
    key: "mehfil",
    plan: "ROYAL",
    name: "Mehfil",
    tagline: "Marigolds, mirror work parasols and a dholak",
    description:
      "A marigold wreath turns slowly around your names. Tap, and it spins open: the mehndi night comes into focus, mirror work parasols drop in from above and marigold garlands swing down. A fuchsia mirror work arch holds your invitation, with the couple in green and yellow, a dholak, diyas and marigolds below. Inside, every celebration is a bright ticket with a tear-off stub and the countdown hangs on bunting.",
    colors: [
      { name: "Marigold", hex: "#f57c00" },
      { name: "Fuchsia", hex: "#c2185b" },
      { name: "Parrot green", hex: "#23955a" },
      { name: "Haldi yellow", hex: "#ffcf5c" },
    ],
    thumbnail: "/templates/mehfil/thumb.webp",
    opening: "A marigold wreath spins open",
    defaultTrack: "festive-dhol",
    tracks: ["festive-dhol", "shahi-sitar", "calm-pads"],
    bestFor: ["Mehndi","Dholki","Mayun"],
  },
  {
    key: "bazm",
    plan: "PREMIUM",
    name: "Bazm",
    tagline: "Full screen chapters, a new picture with every scroll",
    description:
      "Each part of your invitation is its own full screen chapter. Scroll, swipe or tap the menu and the whole scene changes: a new picture, a new colour, new wording. Blessings, every celebration, families, moments and RSVP, one beautiful chapter at a time.",
    colors: [
      { name: "Wine", hex: "#3d1927" },
      { name: "Forest green", hex: "#1e372d" },
      { name: "Ivory", hex: "#f4eee3" },
      { name: "Champagne", hex: "#c3a776" },
    ],
    thumbnail: "/templates/bazm/thumb.webp",
    opening: "Split cover slides apart",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "shahi-sitar", "calm-pads"],
    bestFor: ["Multi day weddings","Modern couples","Photo led"],
  },
  {
    key: "shahi-darwaza",
    plan: "PREMIUM",
    name: "Shahi Darwaza",
    tagline: "Carved palace doors that swing open",
    description:
      "A carved wooden palace door set in a Mughal arch. Tap, and the doors open in three dimensions onto a maroon and gold hall. Rich, traditional and unmistakably grand.",
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
    bestFor: ["Baraat","Walima","Traditional families"],
  },
  {
    key: "gulzar",
    plan: "PREMIUM",
    name: "Gulzar",
    tagline: "A sealed envelope in a rose garden",
    description:
      "Soft, romantic and gentle. A sealed envelope opens to reveal your card, while watercolour florals frame every page and petals drift down the screen.",
    colors: [
      { name: "Blush", hex: "#f4cfd0" },
      { name: "Sage", hex: "#9db08f" },
      { name: "Ivory", hex: "#fff8f3" },
      { name: "Rose gold", hex: "#c98f7e" },
    ],
    thumbnail: "/templates/gulzar/thumb.webp",
    opening: "Sealed envelope opens",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikkah","Day weddings","Romantic couples"],
  },
  {
    key: "mehndi-rang",
    plan: "PREMIUM",
    name: "Mehndi Rang",
    tagline: "Embroidered curtains and swaying marigolds",
    description:
      "Bright, playful and full of life. Embroidered curtains part to reveal a festival of colour, with marigold garlands, bunting and bold, easy to read cards.",
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
    bestFor: ["Mehndi","Dholki","Mayun"],
  },
  {
    key: "noor",
    plan: "PREMIUM",
    name: "Noor",
    tagline: "A gold arch drawn in the dark",
    description:
      "Modern, minimal and quietly luxurious. A fine gold line draws an arch on deep emerald, the names appear letter by letter, and the invitation unfolds with room to breathe.",
    colors: [
      { name: "Emerald", hex: "#0b3d2e" },
      { name: "Champagne gold", hex: "#d8c08a" },
      { name: "White", hex: "#fbfaf6" },
      { name: "Ink", hex: "#10241c" },
    ],
    thumbnail: "/templates/noor/thumb.webp",
    opening: "A gold arch draws itself",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Nikkah","Modern couples","Destination weddings"],
  },
  {
    key: "nikah-nama",
    plan: "PREMIUM",
    name: "Nikah Nama",
    tagline: "A crimson cloth bound book that opens",
    description:
      "Ivory paper and crimson ink, set like a printed wedding book. A gold foil cover opens onto numbered chapters, event entries laid out like a ledger and a photograph tipped in by hand. Timeless, formal and quietly royal.",
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
    bestFor: ["Nikah","Formal families","Ivory and red"],
  },
  {
    key: "chandni",
    plan: "STANDARD",
    name: "Chandni",
    tagline: "Moonlight in silver and slate",
    description:
      "Calm, modern and quietly luxurious. A silver moon dial turns on a pale ground, then swells like an eclipse into a night sky invitation. Event tickets with perforated date stubs, round countdown dials and finely spaced capitals.",
    colors: [
      { name: "Night", hex: "#1e2329" },
      { name: "Slate", hex: "#2a3038" },
      { name: "Silver", hex: "#b7bec9" },
      { name: "Pearl", hex: "#f4f5f7" },
    ],
    thumbnail: "/templates/chandni/thumb.webp",
    opening: "Moon dial eclipse",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Modern couples","Evening nikah","Grey and silver"],
  },
  {
    key: "siyah-taj",
    plan: "STANDARD",
    name: "Siyah Taj",
    tagline: "Black, old gold and one ruby thread",
    description:
      "Sharp and unmistakably royal. A black roller shutter with your names printed on it lifts to reveal an invitation set like a fashion magazine: large Didone type, hairline gold rules, a programme of events with big date numerals and cut corner buttons.",
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
    bestFor: ["Baraat","Reception","Black and gold"],
  },
  {
    key: "neelam-kashi",
    plan: "STANDARD",
    name: "Neelam Kashi",
    tagline: "Sapphire blue and glazed Multani tiles",
    description:
      "A deep sapphire wall of hand glazed tiles with an arched nameplate. Tap and the tiles turn over from the centre outward. Ivory cards framed with rows of tile work, carved Roman capitals and a flowing script. Rich, cool and regal.",
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
    bestFor: ["Walima","Reception","Blue and ivory"],
  },
  {
    key: "chambeli",
    plan: "STANDARD",
    name: "Chambeli",
    tagline: "Pure white, with hand drawn jasmine",
    description:
      "Clean white pages and soft sage, with jasmine sprigs trailing across the corners and over the edges of every card. A jasmine flower opens around your names, then scatters its petals. Oval photo frames and a thread of champagne gold. Light, fragrant and effortlessly elegant.",
    colors: [
      { name: "Pure white", hex: "#ffffff" },
      { name: "Sage", hex: "#6f8a76" },
      { name: "Deep sage", hex: "#4c6853" },
      { name: "Champagne", hex: "#b79a62" },
    ],
    thumbnail: "/templates/chambeli/thumb.webp",
    opening: "A jasmine opens",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "calm-pads", "shahi-sitar"],
    bestFor: ["Nikah","Day weddings","White and floral"],
  },
  {
    key: "farman",
    plan: "STANDARD",
    name: "Farman",
    tagline: "A royal decree sealed in wine red wax",
    description:
      "Deep wine red and antique gold. A rolled royal decree with your initials in wax unrolls to show the names, then the invitation opens onto parchment cards with gold corner flourishes, wax seal date badges and a fine gold frame. Stately, warm and regal.",
    colors: [
      { name: "Wine", hex: "#4a0f20" },
      { name: "Antique gold", hex: "#d4b06a" },
      { name: "Parchment", hex: "#f6ecd6" },
      { name: "Wax red", hex: "#8a1f3a" },
    ],
    thumbnail: "/templates/farman/thumb.webp",
    opening: "Wax sealed scroll unrolls",
    defaultTrack: "shahi-sitar",
    tracks: ["shahi-sitar", "soft-piano", "calm-pads"],
    bestFor: ["Baraat","Walima","Wine and gold"],
  },
  {
    key: "jharoka",
    plan: "STANDARD",
    name: "Jharoka",
    tagline: "Sandstone, terracotta and a carved lattice window",
    description:
      "A warm sandstone page with a faint stone lattice. A palace window with carved shutters slides open and the evening sun floods in. Names set in a tall arch, arched date badges in terracotta and a thread of turquoise. Warm, earthy and graceful.",
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
    bestFor: ["Mehndi","Day weddings","Warm and earthy"],
  },
  {
    key: "mor-pankh",
    plan: "BASIC",
    name: "Mor Pankh",
    tagline: "Peacock teal, deep blue and gold",
    description:
      "A deep peacock green page with a faint feather scale pattern. A closed fan of peacock feathers spreads open to reveal the invitation. Dark glass cards crowned with a feather eye, date badges drawn as peacock eyes and leaf shaped photo frames. Rich, cool and dramatic.",
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
    bestFor: ["Reception","Evening events","Teal and blue"],
  },
  {
    key: "aasmani",
    plan: "BASIC",
    name: "Aasmani",
    tagline: "Soft clouds part over a summer sky",
    description:
      "Light, airy and calm. Two banks of soft clouds drift apart to reveal your invitation on a clear morning sky. White cards with powder blue edges, navy script names and small cloud dividers. Simple, clean and easy to read.",
    colors: [
      { name: "Sky", hex: "#cfe6f7" },
      { name: "Powder blue", hex: "#8fb8dc" },
      { name: "Navy", hex: "#1c3557" },
      { name: "Cloud white", hex: "#ffffff" },
    ],
    thumbnail: "/templates/aasmani/thumb.webp",
    opening: "Clouds part",
    defaultTrack: "calm-pads",
    tracks: ["calm-pads", "soft-piano", "shahi-sitar"],
    bestFor: ["Day weddings","Nikah","Blue and white"],
  },
  {
    key: "sunehri",
    plan: "BASIC",
    name: "Sunehri",
    tagline: "A champagne gold gift box that lifts open",
    description:
      "Warm champagne, ivory and soft gold. Your invitation arrives as a wrapped gift: a ribbon bow unties and the lid lifts away. Foil edged cards, gold script names and a gentle shimmer. Simple, classic and generous.",
    colors: [
      { name: "Champagne", hex: "#e7d3a5" },
      { name: "Gold", hex: "#b8913a" },
      { name: "Ivory", hex: "#fbf6ec" },
      { name: "Cocoa", hex: "#4a3524" },
    ],
    thumbnail: "/templates/sunehri/thumb.webp",
    opening: "Gift box opens",
    defaultTrack: "soft-piano",
    tracks: ["soft-piano", "shahi-sitar", "calm-pads"],
    bestFor: ["Nikah","Walima","Gold and ivory"],
  },
  {
    key: "kesar",
    plan: "BASIC",
    name: "Kesar",
    tagline: "A brass diya lights up in saffron",
    description:
      "Warm saffron, cream and deep brown. A little brass diya sits in the dark; tap, and its flame grows into golden light that fills the screen. White cards with dotted saffron edges and flame shaped date badges. Simple, festive and welcoming.",
    colors: [
      { name: "Saffron", hex: "#f08a1c" },
      { name: "Cream", hex: "#fff3dc" },
      { name: "Deep brown", hex: "#3a1d10" },
      { name: "Brass", hex: "#c9922b" },
    ],
    thumbnail: "/templates/kesar/thumb.webp",
    opening: "A diya lights up",
    defaultTrack: "festive-dhol",
    tracks: ["festive-dhol", "shahi-sitar", "soft-piano"],
    bestFor: ["Mehndi","Mayun","Saffron and cream"],
  },
];

/** The designs of one category, in the order they are listed. */
export function templatesByPlan(plan: Plan): TemplateMeta[] {
  return TEMPLATES.filter((t) => t.plan === plan);
}

export function getTemplate(key: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
