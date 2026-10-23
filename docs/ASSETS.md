# Images & music guide

Everything in the twenty-three designs is built from **CSS and SVG**, so the site looks complete even with no images.
A few real photos make the designs richer. Each photo has a gradient fallback: if a file is missing or renamed,
the design still works.

## 1. What is already in the project

| File | Used by | Source |
|---|---|---|
| `public/templates/shahi-darwaza/door.webp` | Shahi Darwaza opening (the two doors) | Pexels photo 19195912 (free licence) |
| `public/templates/shahi-darwaza/palace.webp` | Shahi Darwaza (room behind the doors + page background) | Pexels photo 36470615 (free licence) |
| `public/templates/chambeli/sprig.svg`, `flower.svg` | The hand-drawn jasmine used across the Chambeli design | Drawn for this project (`scripts/make-chambeli-sprig.cjs`) |
| `public/templates/farman/corner-1…4.svg` | Gold corner flourishes of the Farman design | Drawn for this project (`scripts/make-farman-corners.cjs`) |
| `public/templates/jharoka/jali.svg` | Stone-lattice pattern of the Jharoka design | Drawn for this project (edit freely) |
| `public/templates/gulab-mahal/scene.webp`, `envelope.webp`, `flap.webp`, `seal.webp` | The Gulab Mahal design: the palace arch at sunset (also its first event picture) and the envelope that opens onto it | Drawn for this project (`scripts/make-gulab-mahal.cjs`) |
| `public/templates/laal-gulab/*.webp` | The Laal Gulab design: velvet, envelope, flap, wax seal with tassel, and the ivory card; `rose-corner.webp` inside | Drawn for this project (`scripts/make-laal-gulab.cjs`; the inside ornaments of all five Royal designs: `scripts/make-royal-ornaments.cjs`) |
| `public/templates/mahtab/*.webp` | The Mahtab design: night sky, moon and the arch and palace in front; `moon-disc.webp` and `rose-corner.webp` inside | Drawn for this project (`scripts/make-mahtab.cjs`) |
| `public/templates/chaman/*.webp` | The Chaman design: the garden card and the jasmine sehra; `wreath.webp` and `sprig.webp` inside | Drawn for this project (`scripts/make-chaman.cjs`) |
| `public/templates/mehfil/*.webp` | The Mehfil design: the mehndi card, parasols, garlands, the marigold wreath; `parasol.webp` and `swag.webp` inside | Drawn for this project (`scripts/make-mehfil.cjs`) |
| `public/templates/mor-pankh/eye.svg` | Peacock-feather eye used in the Mor Pankh design | Drawn for this project (edit freely) |
| `public/templates/bazm/scene-mehndi.webp`, `scene-barat.webp`, `scene-walima.webp` | The background pictures of the Bazm design (one per kind of celebration, used in turn so the picture changes every chapter) | AI-generated ambience pictures (no real venues or people). Replace with your own, same file names, about 960 px wide, under 200 KB |
| `public/templates/photos/hands-wedding.webp` | The picture of the first (Blessings) chapter in every design: hands with henna, deliberately no couple | Supplied by the owner |
| `public/templates/photos/*.webp` | The background pictures of the full-screen chapters. Every design picks its own set, so the picture changes as you scroll | Pexels, free licence (IDs in `public/templates/photos/CREDITS.md`) |
| `public/templates/<key>/thumb.webp`, `thumb-2.webp` | Phone mockups on the homepage and /designs | Screenshots of our own designs |
| `public/music/*.mp3` | Music for every design | **Generated placeholders — please replace** (see section 3) |

> The Pexels licence allows free commercial use without credit. The demo photos show real people, so they are used
> only on the demo preview pages. Real invitations show the customer's own photos.

### Re-making the thumbnails
After you change a design, run the dev server and then: `node scripts/make-thumbnails.cjs`

## 2. Optional upgrades (AI-generated images)

Drop a file in with the **exact name and folder** and the design picks it up automatically. WebP, under 300 KB.

| Design | File | What it should show | Size | AI prompt |
|---|---|---|---|---|
| Shahi Darwaza | `public/templates/shahi-darwaza/door.webp` | Straight-on carved teak double door with brass ring knockers, centre seam visible | 900×1350 | *"Straight-on photograph of a pair of ornately carved dark walnut wooden double doors, brass ring knockers, brass studs, Mughal palace style, centred symmetrical, soft warm light, no people, no text, 2:3 portrait"* |
| Shahi Darwaza | `public/templates/shahi-darwaza/palace.webp` | Dim palace hall interior with golden arches | 1080×1920 | *"Interior of a Mughal palace hall at dusk, scalloped arches, gold and deep maroon colours, glowing lamps, subtle bokeh, empty, no people, no text, vertical 9:16"* |
| Gulzar | `public/templates/gulzar/corner.webp` (optional, not wired by default) | Watercolour floral corner on transparent background | 800×800 PNG/WebP | *"Watercolour floral corner arrangement, blush pink peonies and roses, sage green leaves, soft edges, transparent background, wedding stationery style, no text"* |
| Mehndi Rang | `public/templates/mehndi-rang/mehndi-hands.webp` (optional) | Henna hands close-up | 1080×1350 | *"Close-up of bridal hands with intricate dark henna mehndi, marigold petals, warm festive light, no face visible, 4:5"* |
| Noor | `public/templates/noor/pattern.webp` (optional) | Fine gold Islamic geometric line pattern on emerald | 1080×1920 | *"Seamless fine gold line Islamic geometric star pattern on deep emerald green background, subtle, elegant, high contrast lines, vertical 9:16"* |

Where to make them: any AI image tool (Midjourney, Adobe Firefly, Ideogram, Canva "Magic Media") or free photos from
[pexels.com](https://www.pexels.com) / [unsplash.com](https://unsplash.com). Convert to WebP with
[squoosh.app](https://squoosh.app).

## 3. Music

The four MP3s in `public/music/` were **generated by a script** (`scripts/make-placeholder-music.cjs`). They are
original and copyright-free, but simple. Before launch, replace them with proper royalty-free tracks using the
**same file names**. About 45–90 seconds long, looping smoothly, 96–128 kbps, under 1.5 MB.

| File | Style to look for | Used by default in |
|---|---|---|
| `shahi-sitar.mp3` | Soft classical sitar / tanpura, slow, royal | Shahi Darwaza |
| `soft-piano.mp3` | Gentle romantic piano or instrumental nikah-style | Gulzar |
| `festive-dhol.mp3` | Cheerful dhol + dholak, upbeat Punjabi mehndi rhythm (instrumental) | Mehndi Rang |
| `calm-pads.mp3` | Modern ambient strings / soft bells | Noor |

**Only use music you are allowed to use commercially.** Safe sources: Pixabay Music, YouTube Audio Library (check
the licence on each track), Uppbeat (free tier with credit), Artlist/Epidemic Sound (paid), or a composer you hire.
Do **not** use popular film or pop songs: they can get your site taken down.

To add a *new* track: put the MP3 in `public/music/` and add one line to `MUSIC_TRACKS` in `src/templates/registry.ts`.
