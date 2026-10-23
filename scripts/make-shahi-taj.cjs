/**
 * Draws the artwork of the 6th Royal design: "Shahi Taj" (Diamond Crown Palace in champagne gold and ivory).
 * Inspired by luxury royal invitations: baroque gold arch, crystal chandelier, diamond crown crest,
 * twin royal swans, glowing lanterns, and champagne roses.
 *
 * Files generated in public/templates/shahi-taj/:
 *   silk.webp        the champagne silk & candlelight cover background
 *   env-back.webp    the gold damask lined envelope inside
 *   card.webp        the grand diamond crown palace card
 *   env-front.webp   the ivory silk envelope pocket with gold scrollwork
 *   flap.webp        the scalloped top flap
 *   seal.webp        the 3D diamond crown gold wax seal with silk ribbon
 *   crown-corner.webp inside page corner ornament
 *
 * Run:  node scripts/make-shahi-taj.cjs
 */
const path = require("path");
const fs = require("fs");
const k = require("./art/kit.cjs");

const { W, H, CX, r2, between, rand } = k;
const OUT = path.join(__dirname, "..", "public", "templates", "shahi-taj");

const GOLD = "#dfb76c";
const GOLD_LIGHT = "#f7e5b5";
const GOLD_DARK = "#996e21";
const IVORY = "#fbf7ee";
const CREAM = "#f3ede0";
const SILK = "#efe6d4";

const ENV = { x0: 160, x1: 920, y0: 470, y1: 1540 };
const TIP = { x: CX, y: 1070 };

k.seed(42);

// ---------------------------------------------------------------- silk background

function silk() {
  const extraDefs = `
  <radialGradient id="silkGlow" cx="0.5" cy="0.45" r="0.75">
    <stop offset="0" stop-color="#fff9ed"/>
    <stop offset="0.55" stop-color="#f0e4cf"/>
    <stop offset="1" stop-color="#d9caa8"/>
  </radialGradient>
  <filter id="silkGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.5" numOctaves="3" seed="5" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.5  0 0 0 0.08 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#silkGlow)"/><rect width="${W}" height="${H}" fill="#000" filter="url(#silkGrain)"/>`;

  // Soft flowing silk waves
  for (let i = 0; i < 7; i++) {
    body += `<path d="M${r2(between(-150, 1200))} -60Q${r2(between(0, 1080))} 960 ${r2(between(-150, 1200))} 1980" stroke="#fef4df" stroke-width="${r2(between(50, 110))}" fill="none" opacity="0.35" filter="url(#soft)"/>`;
  }

  // Gold foil royal outer border with corner cartouches
  body += `<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.85"/>`;
  body += `<rect x="42" y="42" width="${W - 84}" height="${H - 84}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2" opacity="0.7"/>`;

  // Corner floral clusters in champagne & cream roses
  body += k.cluster(60, 60, 240, { roses: ["cream", "gold", "white"], count: 7, size: [40, 76], blossoms: ["white", "blush"], leafTone: "sage", leaves: 14 });
  body += k.cluster(1020, 60, 230, { roses: ["white", "cream", "gold"], count: 6, size: [40, 72], blossoms: ["white"], leafTone: "sage", leaves: 12 });
  body += k.cluster(60, 1860, 250, { roses: ["gold", "cream", "white"], count: 7, size: [40, 78], blossoms: ["white"], leafTone: "sage", leaves: 14 });
  body += k.cluster(1020, 1860, 240, { roses: ["cream", "white", "gold"], count: 6, size: [40, 74], blossoms: ["white", "blush"], leafTone: "sage", leaves: 12 });

  // Floating gold leaf petals
  for (let i = 0; i < 35; i++) {
    body += `<ellipse cx="${r2(between(60, 1020))}" cy="${r2(between(180, 1780))}" rx="${r2(between(8, 14))}" ry="${r2(between(5, 8))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? GOLD_LIGHT : GOLD}" opacity="0.75" filter="url(#emboss)"/>`;
  }

  // Ambient candlelights
  [[120, 1700], [960, 1720], [950, 360], [130, 380]].forEach(([x, y]) => (body += k.candle(x, y, 65, 26)));

  return k.svg(body, { extraDefs, emboss: "#6e4b17", embossOpacity: 0.38 });
}

// ---------------------------------------------------------------- the card

function damask() {
  return `<pattern id="damask" width="140" height="180" patternUnits="userSpaceOnUse">
    <path d="M70 20C90 40 100 60 70 90C40 60 50 40 70 20Z M70 90C100 110 110 140 70 160C30 140 40 110 70 90Z M0 90C15 100 15 120 0 130M140 90C125 100 125 120 140 130" fill="none" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="70" cy="90" r="5" fill="${GOLD}"/>
  </pattern>`;
}

function card() {
  const arch = { hw: 410, spring: 590, apex: 240, bottom: 1860, lobes: 7, depth: 0.62 };
  const extraDefs = `${damask()}
  <radialGradient id="paperGlow" cx="0.5" cy="0.42" r="0.7">
    <stop offset="0" stop-color="#fffefa"/>
    <stop offset="0.7" stop-color="#faf4e8"/>
    <stop offset="1" stop-color="#eee2cb"/>
  </radialGradient>
  <linearGradient id="goldArchGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GOLD_LIGHT}"/>
    <stop offset="0.5" stop-color="${GOLD}"/>
    <stop offset="1" stop-color="${GOLD_DARK}"/>
  </linearGradient>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#paperGlow)"/>`;
  body += `<rect width="${W}" height="${H}" fill="url(#damask)" opacity="0.12"/>`;
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)"/>`;

  // Outer gold borders
  body += `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="url(#goldArchGrad)" stroke-width="3.5"/>`;
  body += `<rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-dasharray="8 6"/>`;

  // The inner arched palace panel
  body += `<path d="${k.cuspedArch(arch)}" fill="#ffffff"/>`;
  body += `<path d="${k.cuspedArch(arch)}" fill="none" stroke="url(#goldArchGrad)" stroke-width="6"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw + 22, apex: arch.apex - 26, spring: arch.spring - 10, bottom: arch.bottom + 18 })}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="8" stroke-dasharray="0 15" stroke-linecap="round"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw - 20, apex: arch.apex + 24, spring: arch.spring + 10, bottom: arch.bottom - 18 })}" fill="none" stroke="${GOLD}" stroke-width="1.8"/>`;

  // Imperial crown crest at apex
  body += `
  <g transform="translate(${CX} 160) scale(1.35)" filter="url(#emboss)">
    <path d="M0 -34L12 -12L30 -22L22 10H-22L-30 -22L-12 -12Z" fill="url(#goldArchGrad)" stroke="${GOLD_DARK}" stroke-width="2"/>
    <circle cx="0" cy="-36" r="4.5" fill="${GOLD_LIGHT}"/>
    <circle cx="-30" cy="-24" r="3.5" fill="${GOLD_LIGHT}"/>
    <circle cx="30" cy="-24" r="3.5" fill="${GOLD_LIGHT}"/>
    <rect x="-22" y="12" width="44" height="6" rx="3" fill="url(#goldArchGrad)"/>
    <circle cx="-14" cy="15" r="1.8" fill="#fff"/>
    <circle cx="0" cy="15" r="2.2" fill="#fff"/>
    <circle cx="14" cy="15" r="1.8" fill="#fff"/>
  </g>`;

  // Grand crystal chandelier hanging inside apex
  body += k.chandelier(CX, 240, 310, GOLD);

  // Twin hanging Moroccan brass lanterns
  body += k.lantern(230, 360, 1.25, 0, GOLD_DARK) + k.lantern(850, 360, 1.25, 0, GOLD_DARK);
  body += k.lantern(310, 240, 0.9, 0, GOLD_DARK) + k.lantern(770, 240, 0.9, 0, GOLD_DARK);

  // Trailing champagne rose garlands down arch pillars
  body += k.sprig([100, 300], [70, 600], [130, 920], [90, 1220], { leaves: 14, flowers: 0, leafTone: "sage", stem: "#6a7f60" });
  body += k.sprig([980, 300], [1010, 600], [950, 920], [990, 1220], { leaves: 14, flowers: 0, leafTone: "sage", stem: "#6a7f60" });
  [[94, 520], [120, 780], [98, 1030], [986, 520], [960, 780], [984, 1030]].forEach(([x, y], i) => {
    body += k.rose(x, y, 30, i * 45, i % 2 ? "gold" : "cream") + k.bud(x + 20, y + 36, 16, 150, "cream");
  });

  // Corner rose clusters
  body += k.cluster(60, 70, 270, { roses: ["cream", "gold", "white"], count: 8, size: [42, 82], blossoms: ["white", "blush"], leafTone: "sage", leaves: 16, buds: 3 });
  body += k.cluster(1030, 70, 260, { roses: ["gold", "cream", "white"], count: 8, size: [42, 80], blossoms: ["white"], leafTone: "sage", leaves: 16, buds: 3 });
  body += k.cluster(70, 1840, 290, { roses: ["white", "cream", "gold"], count: 9, size: [42, 84], blossoms: ["white", "blush"], leafTone: "sage", leaves: 18, buds: 3 });

  // Royal couple at bottom right in ivory and champagne gold
  for (let i = 0; i < 50; i++) {
    body += `<ellipse cx="${r2(between(560, 1060))}" cy="${r2(between(1800, 1900))}" rx="${r2(between(7, 13))}" ry="${r2(between(4, 8))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? GOLD_LIGHT : "#fcecd2"}" opacity="0.95"/>`;
  }
  body += k.couple(835, 1860, 0.98, {
    lehenga: "#f7ebd3", lehengaDeep: "#e2caa0", dupatta: "#edd6aa", trim: "#cda358",
    sherwani: "#422e18", sherwaniDeep: "#24180a", trousers: "#f9f2e4", turban: "#dfb872",
  });
  body += k.cluster(1060, 1880, 150, { roses: ["cream", "gold"], count: 4, size: [34, 60], blossoms: ["white"], leafTone: "sage", leaves: 8 });

  // Warm candlelight pools at base
  [[340, 1850], [390, 1870], [280, 1880], [440, 1860]].forEach(([x, y], i) => {
    body += k.candle(x, y, 42 + i * 10, 18);
  });

  // Twin royal swans in the courtyard pool (left base)
  body += `
  <g transform="translate(190 1835) scale(0.65)" opacity="0.95" filter="url(#emboss)">
    <!-- Swan 1 -->
    <path d="M40 50C25 50 10 38 10 22C10 8 20 2 28 2C32 2 34 6 32 10C30 16 26 22 36 24C48 26 62 14 74 24C82 32 76 50 40 50Z" fill="#fff" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M28 2L20 4L24 7Z" fill="#e07b00"/>
    <circle cx="27" cy="5" r="1.5" fill="#111"/>
    <!-- Swan 2 facing -->
    <path d="M120 50C135 50 150 38 150 22C150 8 140 2 132 2C128 2 126 6 128 10C130 16 134 22 124 24C112 26 98 14 86 24C78 32 84 50 120 50Z" fill="#fff" stroke="${GOLD}" stroke-width="1.8"/>
    <path d="M132 2L140 4L136 7Z" fill="#e07b00"/>
    <circle cx="133" cy="5" r="1.5" fill="#111"/>
    <!-- Water ripples -->
    <ellipse cx="80" cy="54" rx="70" ry="8" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2" opacity="0.6"/>
  </g>`;

  return k.svg(body, { extraDefs, emboss: "#6e4b17", embossOpacity: 0.35 });
}

// ---------------------------------------------------------------- the envelope

const flapPath = `M${ENV.x0} ${ENV.y0}H${ENV.x1}L${TIP.x} ${TIP.y}Z`;
const frontPath = `M${ENV.x0} ${ENV.y0}L${TIP.x} ${TIP.y - 50}L${ENV.x1} ${ENV.y0}V${ENV.y1}H${ENV.x0}Z`;

const envDefs = `
  <linearGradient id="silkIvory" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffefa"/>
    <stop offset="1" stop-color="#f2e6cf"/>
  </linearGradient>
  <linearGradient id="goldTrim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${GOLD}"/>
    <stop offset="0.5" stop-color="${GOLD_LIGHT}"/>
    <stop offset="1" stop-color="${GOLD}"/>
  </linearGradient>`;

function filigree(x, y, s, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round"><path d="M0 0C30 0 50 20 50 50M0 0C0 30 20 50 50 50M14 14C40 10 60 30 74 4M14 14C10 40 30 60 4 74"/><circle cx="50" cy="50" r="5" fill="${GOLD}"/><circle cx="74" cy="4" r="3" fill="${GOLD}"/><circle cx="4" cy="74" r="3" fill="${GOLD}"/></g>`;
}

function envBack() {
  let body = `<g filter="url(#lift)"><rect x="${ENV.x0}" y="${ENV.y0}" width="${ENV.x1 - ENV.x0}" height="${ENV.y1 - ENV.y0}" rx="10" fill="#2d1d0c"/></g>`;
  body += `<rect x="${ENV.x0 + 24}" y="${ENV.y0 + 24}" width="${ENV.x1 - ENV.x0 - 48}" height="${ENV.y1 - ENV.y0 - 48}" fill="url(#damask)" opacity="0.6"/>`;
  return k.svg(body, { extraDefs: `${envDefs}${damask()}` });
}

function envFront() {
  let body = `<path d="${frontPath}" fill="url(#silkIvory)"/>`;
  body += `<path d="${frontPath}" fill="#000" filter="url(#grain)"/>`;
  body += `<path d="M${ENV.x0} ${ENV.y1}L${TIP.x} ${TIP.y + 40}L${ENV.x1} ${ENV.y1}" fill="#f6ece0" stroke="#dfcaa2" stroke-width="2"/>`;
  body += `<path d="M${ENV.x0 + 30} ${ENV.y1 - 30}L${TIP.x} ${TIP.y + 76}L${ENV.x1 - 30} ${ENV.y1 - 30}" fill="none" stroke="url(#goldTrim)" stroke-width="3"/>`;
  body += `<rect x="${ENV.x0 + 16}" y="${ENV.y0 + 16}" width="${ENV.x1 - ENV.x0 - 32}" height="${ENV.y1 - ENV.y0 - 32}" fill="none" stroke="url(#goldTrim)" stroke-width="2.4" opacity="0.95"/>`;
  body += filigree(ENV.x0 + 30, ENV.y1 - 30, 1, -90) + filigree(ENV.x1 - 30, ENV.y1 - 30, 1, 180);
  body += k.cluster(ENV.x0 + 40, ENV.y1 - 40, 120, { roses: ["cream", "gold"], count: 4, size: [26, 50], blossoms: ["white"], leafTone: "sage", leaves: 8, buds: 1 });
  body += k.cluster(ENV.x1 - 40, ENV.y1 - 40, 110, { roses: ["gold", "cream"], count: 3, size: [26, 46], blossoms: ["white"], leafTone: "sage", leaves: 8, buds: 1 });
  return k.svg(body, { extraDefs: envDefs });
}

function flap() {
  let body = `<g filter="url(#lift)"><path d="${flapPath}" fill="url(#silkIvory)"/></g>`;
  body += `<path d="${flapPath}" fill="#000" filter="url(#grain)"/>`;
  body += `<path d="M${ENV.x0 + 40} ${ENV.y0 + 18}H${ENV.x1 - 40}L${TIP.x} ${TIP.y - 44}Z" fill="none" stroke="url(#goldTrim)" stroke-width="3.5"/>`;
  body += `<path d="M${ENV.x0 + 80} ${ENV.y0 + 36}H${ENV.x1 - 80}L${TIP.x} ${TIP.y - 92}Z" fill="none" stroke="${GOLD_LIGHT}" stroke-width="6" stroke-dasharray="0 13" stroke-linecap="round"/>`;
  body += filigree(ENV.x0 + 30, ENV.y0 + 10, 0.8, 0) + filigree(ENV.x1 - 30, ENV.y0 + 10, 0.8, 90);
  return k.svg(body, { extraDefs: envDefs });
}

function seal() {
  const S = 400;
  const c = 200;
  const N = 18;
  const rim = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 160 + (i % 2 ? 8 : -4) + between(-4, 4);
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let blob = `M${mid(rim[N - 1], rim[0]).map(r2).join(" ")}`;
  rim.forEach((p, i) => (blob += `Q${p.map(r2).join(" ")} ${mid(p, rim[(i + 1) % N]).map(r2).join(" ")}`));

  const extraDefs = `
    <radialGradient id="goldWax" cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color="#fff0c9"/>
      <stop offset="0.45" stop-color="#dfb76c"/>
      <stop offset="0.8" stop-color="#b08129"/>
      <stop offset="1" stop-color="#69460d"/>
    </radialGradient>
    <linearGradient id="silkRibbon" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#dfcaa2"/>
      <stop offset="0.5" stop-color="#fffefa"/>
      <stop offset="1" stop-color="#dfcaa2"/>
    </linearGradient>`;

  // Gold cord and silk ribbon hanging below seal
  let threads = "";
  for (let i = 0; i < 24; i++) {
    threads += `<path d="M${r2(c - 30 + i * 2.6)} 520Q${r2(c - 36 + i * 3)} 620 ${r2(c - 40 + i * 3.4)} 690" stroke="${i % 3 ? "#f4deb0" : "#c59a43"}" stroke-width="2.2" fill="none"/>`;
  }

  const body = `
    <path d="M${c} 300C${c - 28} 380 ${c + 28} 420 ${c} 470" stroke="url(#silkRibbon)" stroke-width="12" fill="none"/>
    ${threads}
    <path d="M${c - 30} 470H${c + 30}L${c + 24} 530H${c - 24}Z" fill="url(#silkRibbon)" stroke="${GOLD_DARK}" stroke-width="2"/>
    <g filter="url(#lift)"><path d="${blob}Z" fill="url(#goldWax)"/></g>
    <circle cx="${c}" cy="${c}" r="122" fill="#c99b40" stroke="#7e5818" stroke-width="3"/>
    <circle cx="${c}" cy="${c}" r="110" fill="none" stroke="${GOLD_LIGHT}" stroke-width="3.5" stroke-dasharray="1 9" stroke-linecap="round"/>
    <!-- Diamond crown embossed in the center of the gold seal -->
    <g transform="translate(${c} ${c - 5}) scale(1.15)">
      <path d="M0 -34L12 -12L30 -22L22 10H-22L-30 -22L-12 -12Z" fill="#fff4d0" stroke="#66440c" stroke-width="2"/>
      <circle cx="0" cy="-36" r="4.5" fill="#fff"/>
      <circle cx="-30" cy="-24" r="3.5" fill="#fff"/>
      <circle cx="30" cy="-24" r="3.5" fill="#fff"/>
      <rect x="-22" y="12" width="44" height="6" rx="3" fill="#fff4d0"/>
      <circle cx="-14" cy="15" r="1.8" fill="#c99b40"/>
      <circle cx="0" cy="15" r="2.2" fill="#c99b40"/>
      <circle cx="14" cy="15" r="1.8" fill="#c99b40"/>
    </g>
    ${k.leaf(c - 34, c + 44, 150, 56, "gold")}${k.leaf(c + 34, c + 44, 30, 56, "gold")}
    <ellipse cx="${c - 55}" cy="${c - 65}" rx="38" ry="16" transform="rotate(-35 ${c - 55} ${c - 65})" fill="#fff" opacity="0.35"/>`;

  return k.svg(body, { extraDefs, w: S, h: 720, emboss: "#4a300a", embossOpacity: 0.5 });
}

function crownCorner() {
  const body =
    k.cluster(70, 70, 230, { count: 7, size: [34, 74], leaves: 14, buds: 3, roses: ["cream", "gold", "white"], leafTone: "sage" }) +
    k.cluster(250, 40, 110, { count: 3, size: [22, 40], leaves: 6, buds: 1, roses: ["gold", "cream"], leafTone: "sage" }) +
    k.cluster(40, 250, 110, { count: 3, size: [22, 40], leaves: 6, buds: 1, roses: ["white", "gold"], leafTone: "sage" });
  return k.svg(body, { w: 420, h: 420, emboss: "#6e4b17", embossOpacity: 0.28 });
}

k.writeAll(OUT, [
  ["silk", silk(), { quality: 82 }],
  ["card", card(), { quality: 85 }],
  ["env-back", envBack(), {}],
  ["env-front", envFront(), {}],
  ["flap", flap(), {}],
  ["seal", seal(), { quality: 88, alphaQuality: 95 }],
  ["crown-corner", crownCorner(), {}],
]);
