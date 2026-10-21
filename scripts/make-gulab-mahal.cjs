/**
 * Draws the artwork of the "Gulab Mahal" design and saves it in public/templates/gulab-mahal:
 *   scene.webp     the palace arch at sunset: chandelier, lanterns, a pool, and the couple seen from behind
 *   envelope.webp  the blush envelope with its top flap cut away (the arch shaped window)
 *   flap.webp      the top flap that lifts open
 *   seal.webp      the rose gold wax seal
 * Run:  node scripts/make-gulab-mahal.cjs   (uses sharp, already installed with Next)
 * All four images share one 1080 × 1920 canvas so they line up exactly on screen.
 * Change the colours below and run it again.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = path.join(__dirname, "..", "public", "templates", "gulab-mahal");
const W = 1080;
const H = 1920;
const CX = W / 2;

const ROSE_GOLD = "#b07f6b";
const ROSE_GOLD_DARK = "#8c5a4b";
const ROSE_GOLD_LIGHT = "#e6c3ae";
const PAPER = "#f1dbcf";
const PAPER_LIGHT = "#f6e6dc";
const IVORY = "#f5ebe1";

const r2 = (n) => Math.round(n * 10) / 10;

// A small seeded random generator, so every run draws the same picture
let seed = 7;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + rand() * (b - a);

// ---------------------------------------------------------------- shapes

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
  ];
};

/**
 * A Mughal (cusped) arch: straight sides from `bottom` up to `spring`, then a pointed arch to the apex,
 * edged with scallops. Returns a closed path that runs clockwise around the opening.
 */
function cuspedArch({ cx = CX, hw, spring, apex, bottom = H + 20, lobes = 6, depth = 0.6 }) {
  const left = [[cx - hw, spring], [cx - hw, spring - (spring - apex) * 0.62], [cx - hw * 0.28, apex + (spring - apex) * 0.2], [cx, apex]];
  const pts = [];
  for (let i = 0; i <= lobes; i++) pts.push(cubic(...left, i / lobes));
  const right = pts.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y]);
  const all = [...pts, ...right];
  let d = `M${r2(cx - hw)} ${bottom}L${r2(cx - hw)} ${spring}`;
  for (let i = 1; i < all.length; i++) {
    const [x0, y0] = all[i - 1];
    const [x1, y1] = all[i];
    const chord = Math.hypot(x1 - x0, y1 - y0);
    d += `A${r2(chord * depth)} ${r2(chord * depth)} 0 0 0 ${r2(x1)} ${r2(y1)}`;
  }
  return `${d}L${r2(cx + hw)} ${bottom}Z`;
}

/** A plain pointed arch (no scallops), used for outlines. */
function pointedArch({ cx = CX, hw, spring, apex, bottom = H + 20 }) {
  return `M${cx - hw} ${bottom}L${cx - hw} ${spring}C${cx - hw} ${r2(spring - (spring - apex) * 0.62)} ${r2(cx - hw * 0.28)} ${r2(apex + (spring - apex) * 0.2)} ${cx} ${apex}C${r2(cx + hw * 0.28)} ${r2(apex + (spring - apex) * 0.2)} ${cx + hw} ${r2(spring - (spring - apex) * 0.62)} ${cx + hw} ${spring}L${cx + hw} ${bottom}`;
}

// ---------------------------------------------------------------- flowers

const PETAL = "M0 0C-15 -6 -19 -30 0 -33C19 -30 15 -6 0 0Z";

/** A layered rose, seen from above. */
function rose(x, y, r, rot = 0, tone = "pink") {
  const s = r / 34;
  const grad = tone === "pink" ? "url(#rosePetal)" : tone === "cream" ? "url(#creamPetal)" : "url(#goldPetal)";
  const edge = tone === "pink" ? "#c27b7d" : tone === "cream" ? "#d2b49c" : ROSE_GOLD_DARK;
  const heart = tone === "pink" ? "#b8676d" : tone === "cream" ? "#c9a587" : ROSE_GOLD_DARK;
  const ring = (n, scale, off) =>
    Array.from({ length: n }, (_, i) => `<path d="${PETAL}" transform="rotate(${r2((360 / n) * i + off)}) scale(${scale})"/>`).join("");
  return (
    `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(s * 100) / 100})" filter="url(#emboss)">` +
    `<g fill="${grad}" stroke="${edge}" stroke-width="1.1">${ring(7, 1.05, 0)}${ring(6, 0.78, 25)}${ring(5, 0.55, 8)}</g>` +
    `<circle r="9" fill="${heart}" opacity="0.85"/>` +
    `<path d="M-6 1A6 6 0 1 1 6 2A4.5 4.5 0 1 1 -3 -2" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>` +
    `</g>`
  );
}

/** A small five petalled blossom (jasmine, cherry). */
function blossom(x, y, r, tone = "white") {
  const fill = tone === "white" ? "#fffaf4" : tone === "blush" ? "#f6d3cf" : "#efc4bd";
  const edge = tone === "white" ? "#d9c2b2" : "#d29c98";
  const petals = [0, 72, 144, 216, 288]
    .map((a) => `<ellipse cy="${r2(-r * 0.55)}" rx="${r2(r * 0.42)}" ry="${r2(r * 0.55)}" transform="rotate(${a})"/>`)
    .join("");
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(between(0, 72))})"><g fill="${fill}" stroke="${edge}" stroke-width="0.8">${petals}</g><circle r="${r2(r * 0.2)}" fill="#e3b778"/></g>`;
}

function leaf(x, y, angle, len, tone = "sage") {
  const fill = tone === "sage" ? "url(#leafGrad)" : "url(#leafRose)";
  const s = len / 40;
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)}) scale(${r2(s * 100) / 100})" filter="url(#emboss)"><path d="M0 0C10 -11 28 -11 40 0C28 11 10 11 0 0Z" fill="${fill}" stroke="#8b927a" stroke-width="0.9"/><path d="M3 0H34" stroke="#8b927a" stroke-width="0.8" opacity="0.7"/></g>`;
}

/** A curved stem with leaves and blossoms along it. */
function sprig(p0, p1, p2, p3, { leaves = 7, flowers = 4, size = 1, tone = "white" } = {}) {
  let out = `<path d="M${p0.join(" ")}C${p1.join(" ")} ${p2.join(" ")} ${p3.join(" ")}" fill="none" stroke="#9a8f74" stroke-width="${r2(2.2 * size)}" stroke-linecap="round"/>`;
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    const [x, y] = cubic(p0, p1, p2, p3, t);
    const [x2, y2] = cubic(p0, p1, p2, p3, Math.min(1, t + 0.02));
    const a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    out += leaf(x, y, a + (i % 2 ? -50 : 50), between(26, 38) * size);
  }
  for (let i = 0; i < flowers; i++) {
    const [x, y] = cubic(p0, p1, p2, p3, 0.35 + (0.65 * i) / Math.max(1, flowers - 1));
    out += blossom(x + between(-8, 8), y + between(-8, 8), between(9, 13) * size, tone);
  }
  return out;
}

/** A hanging cascade of tiny flowers (wisteria / jasmine strings). */
function cascade(x, y, len, { width = 26, tone = "white", sway = 0 } = {}) {
  let out = `<path d="M${r2(x)} ${r2(y)}q${r2(sway * 0.5)} ${r2(len * 0.5)} ${r2(sway)} ${r2(len)}" stroke="#a49a80" stroke-width="1.4" fill="none"/>`;
  const count = Math.round(len / 9);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const spread = width * (1 - t * 0.75);
    const cx = x + sway * t * t + between(-spread, spread) * 0.5;
    const cy = y + len * t + between(-4, 4);
    const r = between(5, 8.5) * (1 - t * 0.45);
    const tones = tone === "white" ? ["white", "white", "white", "blush"] : ["blush", "white", "pink", "blush"];
    out += blossom(cx, cy, r, tones[Math.floor(rand() * tones.length)]);
  }
  return out;
}

/** A corner bouquet of roses, blossoms and leaves, drawn for the top-left corner. */
function cornerBouquet(scale = 1) {
  let out = "";
  out += sprig([10, 260], [60, 200], [120, 170], [250, 150], { leaves: 6, flowers: 3, size: 1.1 });
  out += sprig([150, 20], [170, 80], [190, 150], [200, 300], { leaves: 6, flowers: 3, size: 1.05 });
  out += sprig([30, 120], [120, 180], [160, 250], [140, 380], { leaves: 6, flowers: 2 });
  for (let i = 0; i < 9; i++) out += leaf(between(20, 190), between(20, 190), between(0, 360), between(36, 52));
  out += rose(85, 95, 64, 10);
  out += rose(205, 70, 40, 40, "cream");
  out += rose(60, 215, 44, 70, "cream");
  out += rose(175, 185, 30, 0);
  for (let i = 0; i < 16; i++) out += blossom(between(0, 250), between(0, 250), between(8, 13), rand() > 0.3 ? "white" : "blush");
  return `<g transform="scale(${scale})">${out}</g>`;
}

/** The same bouquet, placed in a corner: 1 top-left, 2 top-right, 3 bottom-right, 4 bottom-left. */
function corner(which, scale, inset = 0) {
  const flips = {
    1: `translate(${inset} ${inset})`,
    2: `translate(${W - inset} ${inset}) scale(-1 1)`,
    3: `translate(${W - inset} ${H - inset}) scale(-1 -1)`,
    4: `translate(${inset} ${H - inset}) scale(1 -1)`,
  };
  return `<g transform="${flips[which]}">${cornerBouquet(scale)}</g>`;
}

// ---------------------------------------------------------------- shared definitions

const DEFS = `
<linearGradient id="rosePetal" x1="0" y1="-1" x2="0" y2="0.2"><stop offset="0" stop-color="#f9d7d0"/><stop offset="1" stop-color="#e3a2a0"/></linearGradient>
<linearGradient id="creamPetal" x1="0" y1="-1" x2="0" y2="0.2"><stop offset="0" stop-color="#fff6ec"/><stop offset="1" stop-color="#ead2bd"/></linearGradient>
<linearGradient id="goldPetal" x1="0" y1="-1" x2="0" y2="0.2"><stop offset="0" stop-color="#e9c6b0"/><stop offset="1" stop-color="#b9866f"/></linearGradient>
<linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9bfa3"/><stop offset="1" stop-color="#d9dcc6"/></linearGradient>
<linearGradient id="leafRose" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c99583"/><stop offset="1" stop-color="#e5c0ae"/></linearGradient>
<filter id="emboss" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="2.4"/><feOffset dx="1.5" dy="3" result="b"/>
  <feFlood flood-color="#6e3f35" flood-opacity="0.32"/><feComposite in2="b" operator="in" result="s"/>
  <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0.09 0"/>
  <feComposite in2="SourceGraphic" operator="in"/>
</filter>`;

const svg = (body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${DEFS}${defs}</defs>${body}</svg>`;

// ---------------------------------------------------------------- the scene

/** A Moroccan style hanging lantern with a warm glow. */
function lantern(x, y, s = 1, chainFrom = 0) {
  return (
    `<path d="M${x} ${chainFrom}V${y}" stroke="#7a5640" stroke-width="${r2(1.6 * s)}"/>` +
    `<circle cx="${x}" cy="${y + 40 * s}" r="${r2(46 * s)}" fill="#ffcf86" opacity="0.55" filter="url(#glow)"/>` +
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M0 0L-7 10H7Z" fill="#a67c4e"/>` +
    `<path d="M-14 12H14L18 26C22 44 20 56 12 66H-12C-20 56 -22 44 -18 26Z" fill="#ffe1a6" stroke="#9c7244" stroke-width="2.4"/>` +
    `<path d="M-14 26H14M-17 44H17M0 12V66M-9 12L-12 66M9 12L12 66" stroke="#9c7244" stroke-width="1.4" opacity="0.8"/>` +
    `<path d="M-12 66H12L6 74H-6Z" fill="#a67c4e"/><circle cy="78" r="3" fill="#a67c4e"/>` +
    `</g>`
  );
}

function chandelier(x, top, y) {
  let out = `<path d="M${x} ${top}V${y}" stroke="#8f6a45" stroke-width="2.4"/>`;
  out += `<ellipse cx="${x}" cy="${y + 90}" rx="190" ry="120" fill="#ffd79a" opacity="0.45" filter="url(#soft)"/>`;
  const tiers = [
    { dy: 40, rx: 50, n: 6 },
    { dy: 95, rx: 105, n: 10 },
    { dy: 150, rx: 140, n: 12 },
  ];
  tiers.forEach(({ dy, rx, n }) => {
    const cy = y + dy;
    out += `<path d="M${x - rx} ${cy}Q${x} ${cy + rx * 0.38} ${x + rx} ${cy}" fill="none" stroke="#b8925a" stroke-width="3"/>`;
    out += `<path d="M${x - rx * 0.9} ${cy + 8}Q${x} ${cy + rx * 0.42} ${x + rx * 0.9} ${cy + 8}" fill="none" stroke="#e8d3a8" stroke-width="1.2" stroke-dasharray="1 6" stroke-linecap="round"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const cxp = x - rx + 2 * rx * t;
      const cyp = cy + 4 * rx * 0.38 * t * (1 - t) * 0.5 * 2 * 0.5;
      out += `<circle cx="${r2(cxp)}" cy="${r2(cyp - 16)}" r="9" fill="#fff0c8" opacity="0.8" filter="url(#glow)"/>`;
      out += `<rect x="${r2(cxp - 2.5)}" y="${r2(cyp - 16)}" width="5" height="14" fill="#fbf3e2"/>`;
      out += `<path d="M${r2(cxp)} ${r2(cyp - 26)}q-3.5 5 0 9q3.5 -4 0 -9Z" fill="#ffd27a"/>`;
      out += `<path d="M${r2(cxp)} ${r2(cyp)}v${r2(between(14, 30))}" stroke="#f3e6cc" stroke-width="1.2"/><circle cx="${r2(cxp)}" cy="${r2(cyp + between(16, 32))}" r="2.6" fill="#fff8e6"/>`;
    }
  });
  out += `<path d="M${x} ${y + 150}l-10 40h20Z" fill="#b8925a"/><circle cx="${x}" cy="${y + 200}" r="7" fill="#e8d3a8"/>`;
  out += `<circle cx="${x}" cy="${y + 16}" r="10" fill="#b8925a"/>`;
  return out;
}

function palm(x, base, height, lean, s = 1) {
  const top = [x + lean, base - height];
  let out = `<path d="M${x - 9 * s} ${base}Q${x + lean * 0.3} ${base - height * 0.55} ${top[0] - 3} ${top[1]}L${top[0] + 4} ${top[1]}Q${x + lean * 0.3 + 10} ${base - height * 0.55} ${x + 9 * s} ${base}Z"/>`;
  [-170, -145, -120, -95, -70, -40, -12, 15].forEach((a) => {
    const rad = (a * Math.PI) / 180;
    const len = between(95, 130) * s;
    const ex = top[0] + Math.cos(rad) * len;
    const ey = top[1] + Math.sin(rad) * len * 0.55 + len * 0.35;
    const mx = top[0] + Math.cos(rad) * len * 0.55;
    const my = top[1] + Math.sin(rad) * len * 0.5 - 18 * s;
    out += `<path d="M${r2(top[0])} ${r2(top[1])}Q${r2(mx)} ${r2(my - 12)} ${r2(ex)} ${r2(ey)}Q${r2(mx)} ${r2(my + 10)} ${r2(top[0])} ${r2(top[1])}Z"/>`;
  });
  return out;
}

/** The far palace on the horizon: a domed tomb, minarets and two pavilions. */
function palace(horizon) {
  const dome = (cx, base, w, h) =>
    `<path d="M${cx - w} ${base}C${cx - w} ${base - h * 0.55} ${cx - w * 0.55} ${base - h * 0.78} ${cx} ${base - h}C${cx + w * 0.55} ${base - h * 0.78} ${cx + w} ${base - h * 0.55} ${cx + w} ${base}Z"/><path d="M${cx} ${base - h}v-14" stroke-width="3"/>`;
  let out = `<g fill="#c99390" stroke="#c99390" opacity="0.9">`;
  out += `<rect x="455" y="${horizon - 70}" width="170" height="70"/>`;
  out += `<rect x="490" y="${horizon - 96}" width="100" height="30"/>`;
  out += dome(540, horizon - 96, 50, 92);
  out += dome(478, horizon - 70, 16, 34) + dome(602, horizon - 70, 16, 34);
  [432, 648].forEach((mx) => (out += `<rect x="${mx - 5}" y="${horizon - 120}" width="10" height="120"/>` + dome(mx, horizon - 120, 9, 20)));
  out += `<rect x="300" y="${horizon - 42}" width="90" height="42"/>` + dome(345, horizon - 42, 30, 46);
  out += `<rect x="692" y="${horizon - 38}" width="86" height="38"/>` + dome(735, horizon - 38, 28, 42);
  out += `</g>`;
  // arched doorways glowing in the dusk
  [500, 540, 580].forEach((dx) => (out += `<path d="M${dx - 9} ${horizon - 6}v-26q9 -14 18 0v26Z" fill="#ffd9a3" opacity="0.85"/>`));
  for (let i = 0; i < 26; i++) out += `<circle cx="${r2(between(290, 790))}" cy="${r2(horizon - between(2, 30))}" r="${r2(between(1.6, 3.2))}" fill="#ffe2a8" opacity="0.9"/>`;
  return out;
}

/** The couple, seated with their backs to us, looking out at the palace. */
function couple() {
  // paisley and buti motifs scattered on the lehenga and dupatta
  const paisley = (x, y, s, rot, colour) =>
    `<path transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${s})" d="M0 0C-12 -2 -16 -16 -8 -24C0 -31 14 -26 12 -12C10 -4 6 6 14 14C4 12 -2 8 0 0Z" fill="none" stroke="${colour}" stroke-width="2.2"/>`;
  let motifs = "";
  for (let i = 0; i < 26; i++) {
    const y = between(1660, 1900);
    const spread = 60 + (y - 1640) * 0.75;
    motifs += paisley(between(620 - spread, 640 + spread * 0.4), y, r2(between(0.9, 1.5)), between(-30, 30), rand() > 0.5 ? "#9fae8f" : "#c98f8b");
  }
  let dots = "";
  for (let i = 0; i < 70; i++) dots += `<circle cx="${r2(between(420, 720))}" cy="${r2(between(1560, 1910))}" r="1.8" fill="#c4a173" opacity="0.7"/>`;

  return `
  <g id="couple">
    <!-- settee behind the groom -->
    <path d="M800 1660C800 1600 860 1585 905 1610C935 1628 930 1680 905 1690L905 1920H800Z" fill="#efe3d4" stroke="#cbb39a" stroke-width="2"/>
    <path d="M905 1610C950 1590 975 1640 945 1662C925 1676 900 1668 905 1650" fill="none" stroke="#cbb39a" stroke-width="4"/>

    <!-- the groom: sherwani and shawl -->
    <path d="M688 1535C700 1515 735 1508 760 1510C795 1512 822 1528 832 1556C850 1620 852 1760 846 1920H676C668 1780 664 1620 688 1535Z" fill="url(#sherwani)"/>
    <path d="M790 1515C822 1530 836 1560 842 1610C850 1700 858 1800 856 1920H800C806 1800 806 1680 795 1600C790 1560 784 1530 790 1515Z" fill="#f1e4d0" opacity="0.92"/>
    <path d="M700 1560C720 1640 724 1760 718 1920" stroke="#bf9e78" stroke-width="2" fill="none" opacity="0.6"/>
    ${Array.from({ length: 40 }, () => `<circle cx="${r2(between(690, 790))}" cy="${r2(between(1550, 1900))}" r="1.5" fill="#b08a5c" opacity="0.6"/>`).join("")}
    <rect x="728" y="1488" width="40" height="30" rx="8" fill="#c08f74"/>
    <path d="M722 1506C735 1516 760 1517 774 1506L776 1524C760 1532 738 1532 720 1524Z" fill="#dcc3a1"/>
    <ellipse cx="748" cy="1452" rx="38" ry="44" fill="#2e1f1a"/>
    <path d="M714 1440C722 1408 772 1404 784 1436" fill="none" stroke="#4a3329" stroke-width="3" opacity="0.7"/>
    <ellipse cx="710" cy="1462" rx="6" ry="11" fill="#b9856a"/>

    <!-- the bride: lehenga train spread on the floor -->
    <path d="M572 1575C552 1650 520 1720 470 1780C430 1830 370 1880 300 1920H770C760 1860 740 1790 720 1720C705 1660 690 1610 676 1575Z" fill="url(#lehenga)"/>
    ${motifs}
    ${dots}
    <path d="M300 1920C370 1880 430 1830 470 1780" fill="none" stroke="#c9a77d" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round"/>
    <!-- her back and the dupatta over her head -->
    <path d="M575 1545C580 1510 600 1494 624 1494C650 1494 668 1512 674 1545L690 1640H562Z" fill="#e6cdb0"/>
    <path d="M612 1418C640 1410 668 1428 672 1462C678 1520 700 1600 712 1700C722 1790 712 1860 690 1920H392C450 1860 510 1790 540 1700C560 1630 566 1540 572 1470C576 1440 590 1424 612 1418Z" fill="url(#veil)" opacity="0.93"/>
    <path d="M392 1920C450 1860 510 1790 540 1700C560 1630 566 1540 572 1470" fill="none" stroke="#c9a77d" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round"/>
    <path d="M690 1920C712 1860 722 1790 712 1700C700 1600 678 1520 672 1462" fill="none" stroke="#c9a77d" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round"/>
    ${Array.from({ length: 16 }, () => paisley(between(560, 690), between(1560, 1880), 0.8, between(-20, 20), "#c9a77d")).join("")}
    <ellipse cx="620" cy="1460" rx="31" ry="36" fill="#2f201b"/>
    <ellipse cx="616" cy="1500" rx="20" ry="13" fill="#2f201b"/>
    <ellipse cx="620" cy="1458" rx="37" ry="43" fill="url(#veilHead)" opacity="0.82"/>
    <path d="M584 1470C590 1500 600 1530 598 1560M656 1470C650 1510 660 1540 668 1570" fill="none" stroke="#d2b48f" stroke-width="2" opacity="0.8"/>
    <path d="M588 1452C592 1426 612 1416 628 1418" fill="none" stroke="#c9a77d" stroke-width="3" stroke-dasharray="1 6" stroke-linecap="round"/>
  </g>`;
}

function scene() {
  const outer = { hw: 410, spring: 640, apex: 150, lobes: 7, depth: 0.62 };
  const inner = { hw: 285, spring: 860, apex: 430, lobes: 6, depth: 0.6 };
  const outerPath = cuspedArch(outer);
  const innerPath = cuspedArch(inner);
  const horizon = 1270;
  const poolEnd = 1420;

  const defs = `
  <clipPath id="innerClip"><path d="${innerPath}"/></clipPath>
  <clipPath id="outerClip"><path d="${outerPath}"/></clipPath>
  <linearGradient id="sky" x1="0" y1="${inner.apex}" x2="0" y2="${horizon}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#e7aea6"/><stop offset="0.45" stop-color="#f3c0a8"/><stop offset="0.85" stop-color="#fbdcb9"/><stop offset="1" stop-color="#fde8cc"/>
  </linearGradient>
  <linearGradient id="pool" x1="0" y1="${horizon}" x2="0" y2="${poolEnd}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#f8d5b6"/><stop offset="1" stop-color="#d9a49b"/>
  </linearGradient>
  <linearGradient id="floor" x1="0" y1="${poolEnd}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#f3e2d4"/><stop offset="1" stop-color="#e2c3b0"/>
  </linearGradient>
  <linearGradient id="recess" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3f2628"/><stop offset="0.6" stop-color="#6d4642"/><stop offset="1" stop-color="#8d6556"/>
  </linearGradient>
  <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f7eee5"/><stop offset="0.5" stop-color="#eedfd1"/><stop offset="1" stop-color="#e4cdbd"/>
  </linearGradient>
  <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#dcc5b2"/><stop offset="0.45" stop-color="#f4e8dc"/><stop offset="1" stop-color="#d6bca8"/>
  </linearGradient>
  <linearGradient id="sherwani" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#cdb08c"/><stop offset="0.5" stop-color="#e3caa8"/><stop offset="1" stop-color="#c7a782"/>
  </linearGradient>
  <linearGradient id="lehenga" x1="0" y1="1560" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#e2c6a6"/><stop offset="1" stop-color="#ead7bf"/>
  </linearGradient>
  <linearGradient id="veil" x1="0" y1="1420" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#ecd8bf"/><stop offset="1" stop-color="#f4e6d4"/>
  </linearGradient>
  <radialGradient id="veilHead" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#f3e3cd"/><stop offset="1" stop-color="#d9bd9c"/></radialGradient>
  <radialGradient id="sun" cx="${CX}" cy="${horizon - 20}" r="420" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#fff4dc" stop-opacity="0.95"/><stop offset="0.45" stop-color="#ffe6c4" stop-opacity="0.5"/><stop offset="1" stop-color="#ffe6c4" stop-opacity="0"/>
  </radialGradient>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#marble)"/>`;

  // --- the view through the inner arch: sky, palace, pool, terrace
  body += `<g clip-path="url(#innerClip)">`;
  body += `<rect width="${W}" height="${horizon}" fill="url(#sky)"/>`;
  body += `<rect width="${W}" height="${horizon + 60}" fill="url(#sun)"/>`;
  for (let i = 0; i < 7; i++) body += `<ellipse cx="${r2(between(250, 830))}" cy="${r2(between(560, 1080))}" rx="${r2(between(90, 170))}" ry="${r2(between(10, 20))}" fill="#fbe1d4" opacity="0.55" filter="url(#glow)"/>`;
  body += `<g fill="#b98584" opacity="0.55">${Array.from({ length: 24 }, (_, i) => `<circle cx="${250 + i * 25}" cy="${horizon - between(8, 30)}" r="${r2(between(16, 30))}"/>`).join("")}</g>`;
  body += palace(horizon);
  body += `<g fill="#7d4f53" opacity="0.82">${palm(285, horizon + 10, 330, -26)}${palm(352, horizon + 6, 240, 18, 0.85)}${palm(800, horizon + 10, 340, 22)}${palm(735, horizon + 6, 220, -14, 0.8)}</g>`;
  body += `<rect y="${horizon}" width="${W}" height="${poolEnd - horizon}" fill="url(#pool)"/>`;
  body += `<g transform="translate(0 ${2 * horizon}) scale(1 -1)" opacity="0.28">${palace(horizon)}</g>`;
  for (let i = 0; i < 22; i++) {
    const y = between(horizon + 8, poolEnd - 8);
    body += `<rect x="${r2(between(260, 760))}" y="${r2(y)}" width="${r2(between(30, 110))}" height="2" fill="#fff3df" opacity="${r2(between(0.35, 0.8))}"/>`;
  }
  [500, 540, 580].forEach((x) => (body += `<rect x="${x - 4}" y="${horizon + 4}" width="8" height="120" fill="#ffe2ad" opacity="0.5" filter="url(#glow)"/>`));
  body += `<rect y="${poolEnd - 6}" width="${W}" height="10" fill="#efd9c6"/>`;
  body += `<rect y="${poolEnd + 4}" width="${W}" height="${H - poolEnd}" fill="url(#floor)"/>`;
  for (let i = -8; i <= 8; i++) body += `<path d="M${CX + i * 22} ${poolEnd + 4}L${CX + i * 120} ${H}" stroke="#d2b29e" stroke-width="1.2" opacity="0.5"/>`;
  [1480, 1560, 1670, 1810].forEach((y) => (body += `<path d="M0 ${y}H${W}" stroke="#d2b29e" stroke-width="1.2" opacity="0.45"/>`));
  // the rug
  body += `<path d="M478 ${poolEnd + 24}H602L800 ${H}H280Z" fill="#a85a66"/>`;
  body += `<path d="M488 ${poolEnd + 34}H592L770 ${H}H310Z" fill="none" stroke="#e7c497" stroke-width="5"/>`;
  body += `<path d="M498 ${poolEnd + 48}H582L740 ${H}H340Z" fill="none" stroke="#e7c497" stroke-width="2" stroke-dasharray="3 9"/>`;
  for (let y = poolEnd + 90; y < H; y += 70) {
    const t = (y - poolEnd) / (H - poolEnd);
    const half = 50 + t * 190;
    for (let k = -2; k <= 2; k++) body += `<path d="M${r2(CX + (k * half) / 2.6)} ${y}l${r2(10 + t * 10)} ${r2(14 + t * 10)}l${r2(-10 - t * 10)} ${r2(14 + t * 10)}l${r2(-10 - t * 10)} ${r2(-14 - t * 10)}Z" fill="#e2b47e" opacity="0.65"/>`;
  }
  // floating diyas and petals at the water's edge
  for (let i = 0; i < 9; i++) {
    const x = 280 + i * 65 + between(-10, 10);
    body += `<circle cx="${r2(x)}" cy="${poolEnd - 4}" r="14" fill="#ffd38a" opacity="0.8" filter="url(#glow)"/><path d="M${r2(x - 9)} ${poolEnd - 4}q9 8 18 0z" fill="#b97a52"/><path d="M${r2(x)} ${poolEnd - 16}q-4 6 0 10q4 -4 0 -10z" fill="#ffcf6b"/>`;
  }
  for (let i = 0; i < 46; i++) body += `<ellipse cx="${r2(between(260, 830))}" cy="${r2(between(poolEnd + 20, H))}" rx="${r2(between(4, 8))}" ry="${r2(between(2.5, 4.5))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? "#d9737e" : "#ef9da3"}" opacity="0.85"/>`;
  body += `</g>`;

  // --- the dark carved recess between the two arches, with string lights
  body += `<path d="${outerPath} ${innerPath}" fill="url(#recess)" fill-rule="evenodd"/>`;
  body += `<g clip-path="url(#outerClip)">`;
  body += `<path d="${cuspedArch({ ...inner, hw: inner.hw + 34, apex: inner.apex - 40, spring: inner.spring - 20 })}" fill="none" stroke="#c9a273" stroke-width="2" opacity="0.6"/>`;
  body += `<path d="${cuspedArch({ ...inner, hw: inner.hw + 70, apex: inner.apex - 82, spring: inner.spring - 40 })}" fill="none" stroke="#c9a273" stroke-width="1.4" opacity="0.4" stroke-dasharray="2 8" stroke-linecap="round"/>`;
  for (let k = 0; k < 7; k++) {
    const y0 = 200 + k * 34;
    const sag = between(30, 60);
    body += `<path d="M120 ${y0}Q${CX} ${y0 + sag * 2} 960 ${y0}" fill="none" stroke="#6b4a3c" stroke-width="1"/>`;
    for (let i = 1; i < 18; i++) {
      const t = i / 18;
      const x = 120 + 840 * t;
      const y = y0 + 2 * t * (1 - t) * sag * 2;
      body += `<circle cx="${r2(x)}" cy="${r2(y)}" r="2.6" fill="#ffe3ad"/><circle cx="${r2(x)}" cy="${r2(y)}" r="7" fill="#ffd391" opacity="0.35"/>`;
    }
  }
  // the inner pillars, with a glowing niche each
  [[CX - outer.hw, CX - inner.hw], [CX + inner.hw, CX + outer.hw]].forEach(([x0, x1]) => {
    body += `<rect x="${x0}" y="${inner.spring - 10}" width="${x1 - x0}" height="${H}" fill="url(#pillar)"/>`;
    body += `<path d="M${x0 + 18} 1180V1000q${(x1 - x0 - 36) / 2} -60 ${x1 - x0 - 36} 0V1180Z" fill="#7a5045"/>`;
    body += `<path d="M${x0 + 10} 1190V996q${(x1 - x0 - 20) / 2} -72 ${x1 - x0 - 20} 0V1190Z" fill="none" stroke="${ROSE_GOLD}" stroke-width="2"/>`;
    body += lantern((x0 + x1) / 2, 1060, 0.8, 1010);
    body += `<path d="M${x0} 1240H${x1}M${x0} 1250H${x1}" stroke="${ROSE_GOLD}" stroke-width="2" opacity="0.7"/>`;
  });
  body += chandelier(CX, 150, 330);
  [[318, 470], [405, 545], [675, 545], [762, 470]].forEach(([x, y]) => (body += lantern(x, y, 0.95, 150)));
  [[250, 360], [830, 360]].forEach(([x, y]) => (body += lantern(x, y, 0.8, 150)));
  body += `</g>`;

  // --- the ivory frame around the outer arch
  body += `<path d="M0 0H${W}V${H}H0Z ${outerPath}" fill="url(#marble)" fill-rule="evenodd"/>`;
  body += `<path d="M0 0H${W}V${H}H0Z ${outerPath}" fill="#000" fill-rule="evenodd" filter="url(#paper)"/>`;
  body += `<path d="${outerPath}" fill="none" stroke="${ROSE_GOLD}" stroke-width="5"/>`;
  body += `<path d="${cuspedArch({ ...outer, hw: outer.hw + 22, apex: outer.apex - 26, spring: outer.spring - 10 })}" fill="none" stroke="${ROSE_GOLD}" stroke-width="2"/>`;
  body += `<path d="${cuspedArch({ ...outer, hw: outer.hw + 38, apex: outer.apex - 46, spring: outer.spring - 18 })}" fill="none" stroke="${ROSE_GOLD_LIGHT}" stroke-width="7" stroke-dasharray="0 14" stroke-linecap="round"/>`;
  body += `<path d="${pointedArch({ hw: outer.hw + 60, apex: outer.apex - 76, spring: outer.spring - 30 })}" fill="none" stroke="${ROSE_GOLD}" stroke-width="2"/>`;
  // outer pillars, carved panels
  [[0, CX - outer.hw - 60], [CX + outer.hw + 60, W]].forEach(([x0, x1]) => {
    body += `<rect x="${x0 + 14}" y="720" width="${x1 - x0 - 28}" height="1180" fill="none" stroke="${ROSE_GOLD}" stroke-width="2" opacity="0.8"/>`;
    for (let y = 760; y < 1860; y += 140) body += `<path d="M${(x0 + x1) / 2} ${y}l18 26l-18 26l-18 -26Z" fill="none" stroke="${ROSE_GOLD}" stroke-width="1.6" opacity="0.7"/>`;
  });

  // --- florals: wisteria from the top, bouquets in the corners
  for (let i = 0; i < 9; i++) body += cascade(between(10, 250), between(-20, 60), between(380, 700), { sway: between(-20, 20), tone: i % 3 ? "white" : "pink" });
  for (let i = 0; i < 9; i++) body += cascade(between(830, 1070), between(-20, 60), between(380, 700), { sway: between(-20, 20), tone: i % 3 ? "white" : "pink" });
  body += corner(1, 1.25, -14) + corner(2, 1.25, -14);
  body += `<g>${sprig([CX - 200, 40], [CX - 120, 30], [CX - 60, 60], [CX - 10, 50], { leaves: 5, flowers: 3, size: 0.8 })}${sprig([CX + 200, 40], [CX + 120, 30], [CX + 60, 60], [CX + 10, 50], { leaves: 5, flowers: 3, size: 0.8 })}${rose(CX, 46, 30, 0, "cream")}</g>`;

  // --- in front: floor lanterns, flower urns, the couple
  body += couple();
  const urn = (x, y, s) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0C-80 60 -50 110 -30 130H30C50 110 80 60 70 0Z" fill="url(#goldPetal)" stroke="${ROSE_GOLD_DARK}" stroke-width="2.5"/><path d="M-62 30H62M-50 90H50" stroke="${ROSE_GOLD_LIGHT}" stroke-width="3"/><rect x="-40" y="130" width="80" height="22" fill="${ROSE_GOLD}"/></g>`;
  const floorLantern = (x, y, s) =>
    `<circle cx="${x}" cy="${y - 40 * s}" r="${70 * s}" fill="#ffcf86" opacity="0.6" filter="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0H30L26 -80H-26Z" fill="#fde1a8" stroke="#a37a4c" stroke-width="3"/><path d="M-26 -80Q0 -120 26 -80" fill="#c09464" stroke="#a37a4c" stroke-width="3"/><path d="M0 -122v-10" stroke="#a37a4c" stroke-width="3"/><path d="M-15 0V-80M15 0V-80M-28 -40H28" stroke="#a37a4c" stroke-width="1.6"/><rect x="-7" y="-46" width="14" height="30" fill="#fff6e4"/><path d="M0 -60q-6 8 0 13q6 -5 0 -13Z" fill="#ffc861"/></g>`;
  // left arrangement
  body += urn(150, 1600, 1);
  body += `<g>${Array.from({ length: 8 }, () => leaf(between(40, 260), between(1430, 1600), between(180, 360), between(40, 60))).join("")}</g>`;
  body += rose(110, 1530, 60, 0) + rose(200, 1500, 52, 30, "cream") + rose(70, 1610, 44, 60, "cream") + rose(230, 1585, 42, 10) + rose(160, 1450, 40, 80);
  for (let i = 0; i < 22; i++) body += blossom(between(20, 290), between(1400, 1640), between(9, 14), rand() > 0.35 ? "white" : "blush");
  body += cascade(60, 1600, 160, { width: 18 }) + cascade(255, 1600, 140, { width: 18 });
  body += floorLantern(300, 1900, 1.1) + floorLantern(60, 1880, 0.9);
  for (let i = 0; i < 4; i++) body += `<circle cx="${380 + i * 34}" cy="${1890 - (i % 2) * 14}" r="22" fill="#ffd38a" opacity="0.7" filter="url(#glow)"/><rect x="${373 + i * 34}" y="${1860 - (i % 2) * 14}" width="14" height="30" fill="#fbf1df"/><path d="M${380 + i * 34} ${1848 - (i % 2) * 14}q-5 7 0 11q5 -4 0 -11Z" fill="#ffc861"/>`;
  // right arrangement, behind the settee
  body += urn(990, 1560, 0.9);
  body += rose(960, 1470, 54, 15) + rose(1040, 1430, 46, 40, "cream") + rose(1020, 1530, 40, 0) + rose(915, 1540, 36, 70, "cream");
  for (let i = 0; i < 16; i++) body += blossom(between(880, 1080), between(1380, 1600), between(9, 13), rand() > 0.35 ? "white" : "blush");
  body += cascade(900, 1560, 150, { width: 16 }) + cascade(1060, 1540, 170, { width: 16 });
  body += floorLantern(1000, 1900, 1);

  return svg(body, defs);
}

// ---------------------------------------------------------------- the envelope

// The top flap: an arch shaped top, straight sides, then a V down to the seal.
const SEAL = { x: CX, y: 1080, r: 104 };
const flapTop = { hw: 470, spring: 600, apex: 210, lobes: 7, depth: 0.6 };
function flapOutline(inset = 0) {
  const arch = cuspedArch({ ...flapTop, hw: flapTop.hw - inset, apex: flapTop.apex + inset, spring: flapTop.spring + inset * 0.4, bottom: 780 - inset * 0.4 });
  // cut the closing "bottom" corners off the arch path and finish with the V
  const open = arch.replace(/L[\d.]+ [\d.]+Z$/, "");
  const side = 780 - inset * 0.4;
  return `${open}L${CX + flapTop.hw - inset} ${side}L${CX} ${SEAL.y - inset * 1.4}L${CX - flapTop.hw + inset} ${side}Z`;
}

function envelopeDefs() {
  return `
  <linearGradient id="envPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAPER_LIGHT}"/><stop offset="1" stop-color="${PAPER}"/></linearGradient>
  <linearGradient id="envSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ecd0c3"/><stop offset="1" stop-color="#e3c2b3"/></linearGradient>
  <linearGradient id="envSideR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ecd0c3"/><stop offset="1" stop-color="#e3c2b3"/></linearGradient>
  <linearGradient id="envBottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3dccf"/><stop offset="1" stop-color="#ead0c2"/></linearGradient>
  <filter id="lift" x="-10%" y="-10%" width="120%" height="125%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="10"/><feOffset dy="12" result="b"/>
    <feFlood flood-color="#7a4638" flood-opacity="0.28"/><feComposite in2="b" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}

/** The rose gold border with beads, along the edge of the card. */
function border(inset) {
  return (
    `<rect x="${inset}" y="${inset}" width="${W - 2 * inset}" height="${H - 2 * inset}" rx="6" fill="none" stroke="${ROSE_GOLD}" stroke-width="3"/>` +
    `<rect x="${inset + 14}" y="${inset + 14}" width="${W - 2 * inset - 28}" height="${H - 2 * inset - 28}" fill="none" stroke="${ROSE_GOLD_LIGHT}" stroke-width="6" stroke-dasharray="0 13" stroke-linecap="round"/>` +
    `<rect x="${inset + 26}" y="${inset + 26}" width="${W - 2 * inset - 52}" height="${H - 2 * inset - 52}" fill="none" stroke="${ROSE_GOLD}" stroke-width="1.6"/>`
  );
}

function envelope() {
  const windowPath = flapOutline(0);
  const bottomFlap = `M30 ${H - 30}V1640L${CX} ${SEAL.y + 20}L${W - 30} 1640V${H - 30}Z`;
  let body = `<path d="M0 0H${W}V${H}H0Z ${windowPath}" fill="url(#envPaper)" fill-rule="evenodd"/>`;
  // side flaps (a little darker) and the bottom flap over them
  body += `<path d="M0 760L${CX} ${SEAL.y}L0 1700Z" fill="url(#envSide)"/>`;
  body += `<path d="M${W} 760L${CX} ${SEAL.y}L${W} 1700Z" fill="url(#envSideR)"/>`;
  body += `<g filter="url(#lift)"><path d="${bottomFlap}" fill="url(#envBottom)"/></g>`;
  body += `<path d="M0 0H${W}V${H}H0Z ${windowPath}" fill="#000" fill-rule="evenodd" filter="url(#paper)"/>`;
  body += `<path d="M60 1640L${CX} ${SEAL.y + 60}L${W - 60} 1640" fill="none" stroke="${ROSE_GOLD}" stroke-width="2" opacity="0.8"/>`;
  body += `<path d="M84 1650L${CX} ${SEAL.y + 92}L${W - 84} 1650" fill="none" stroke="${ROSE_GOLD_LIGHT}" stroke-width="5" stroke-dasharray="0 12" stroke-linecap="round"/>`;
  body += border(22);
  // the arch shaped window edge, seen once the flap has lifted
  body += `<path d="${windowPath}" fill="none" stroke="${ROSE_GOLD}" stroke-width="5"/>`;
  body += `<path d="${cuspedArch({ ...flapTop, hw: flapTop.hw + 18, apex: flapTop.apex - 22, spring: flapTop.spring - 8, bottom: 790 })}" fill="none" stroke="${ROSE_GOLD_LIGHT}" stroke-width="6" stroke-dasharray="0 13" stroke-linecap="round"/>`;
  // a small finial over the arch
  body += `<path d="M${CX} 92l14 26l-14 34l-14 -34Z M${CX} 160v28" fill="none" stroke="${ROSE_GOLD}" stroke-width="2.4"/>`;
  // florals: hanging jasmine on the side flaps, bouquets in every corner, sprigs up the bottom flap
  for (let i = 0; i < 5; i++) body += cascade(between(50, 150), between(820, 900), between(320, 520), { width: 22, sway: between(-10, 10), tone: i === 2 ? "pink" : "white" });
  for (let i = 0; i < 5; i++) body += cascade(between(930, 1030), between(820, 900), between(320, 520), { width: 22, sway: between(-10, 10), tone: i === 2 ? "pink" : "white" });
  body += `<path d="M50 815H170M910 815H1030" stroke="${ROSE_GOLD}" stroke-width="3"/>`;
  body += sprig([90, 1840], [180, 1720], [300, 1640], [430, 1500], { leaves: 8, flowers: 4 });
  body += sprig([990, 1840], [900, 1720], [780, 1640], [650, 1500], { leaves: 8, flowers: 4 });
  body += corner(1, 1.05, 0) + corner(2, 1.05, 0) + corner(3, 1.25, 0) + corner(4, 1.25, 0);
  body += `<path d="M${CX} ${H - 70}l14 -24l-14 -32l-14 32Z" fill="none" stroke="${ROSE_GOLD}" stroke-width="2.4"/>`;
  return svg(body, envelopeDefs());
}

function flap() {
  let body = `<g filter="url(#lift)"><path d="${flapOutline(0)}" fill="url(#envPaper)"/></g>`;
  body += `<path d="${flapOutline(0)}" fill="#000" filter="url(#paper)"/>`;
  body += `<path d="${flapOutline(16)}" fill="none" stroke="${ROSE_GOLD}" stroke-width="3"/>`;
  body += `<path d="${flapOutline(32)}" fill="none" stroke="${ROSE_GOLD_LIGHT}" stroke-width="6" stroke-dasharray="0 13" stroke-linecap="round"/>`;
  body += `<path d="${flapOutline(46)}" fill="none" stroke="${ROSE_GOLD}" stroke-width="1.4"/>`;
  // sprays along the V, either side of the seal
  body += sprig([CX - 120, SEAL.y - 120], [CX - 220, SEAL.y - 190], [CX - 320, SEAL.y - 230], [CX - 420, SEAL.y - 300], { leaves: 9, flowers: 5 });
  body += sprig([CX + 120, SEAL.y - 120], [CX + 220, SEAL.y - 190], [CX + 320, SEAL.y - 230], [CX + 420, SEAL.y - 300], { leaves: 9, flowers: 5 });
  body += rose(CX - 250, SEAL.y - 220, 42, 20) + rose(CX - 330, SEAL.y - 250, 28, 60, "cream") + rose(CX - 170, SEAL.y - 150, 26, 10, "cream");
  body += rose(CX + 250, SEAL.y - 220, 42, 50) + rose(CX + 330, SEAL.y - 250, 28, 0, "cream") + rose(CX + 170, SEAL.y - 150, 26, 30, "cream");
  // a fine sprig under the arch top
  body += sprig([CX - 180, 330], [CX - 120, 300], [CX - 60, 320], [CX - 10, 300], { leaves: 5, flowers: 2, size: 0.8 });
  body += sprig([CX + 180, 330], [CX + 120, 300], [CX + 60, 320], [CX + 10, 300], { leaves: 5, flowers: 2, size: 0.8 });
  body += rose(CX, 300, 24, 0, "gold");
  return svg(body, envelopeDefs());
}

function seal() {
  const S = 400;
  const c = S / 2;
  // an uneven wax blob
  const N = 18;
  const rim = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 166 + (i % 2 ? 9 : -4) + between(-4, 4);
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  // smooth curve through the midpoints, using the rim points as controls
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let blob = `M${mid(rim[N - 1], rim[0]).map(r2).join(" ")}`;
  rim.forEach((p, i) => (blob += `Q${p.map(r2).join(" ")} ${mid(p, rim[(i + 1) % N]).map(r2).join(" ")}`));
  const relief = (x, y, r, rot) => rose(x, y, r, rot, "gold");
  const body = `
    <defs>${DEFS}
      <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#e4b8a2"/><stop offset="0.55" stop-color="#bd8670"/><stop offset="1" stop-color="#8e5a49"/></radialGradient>
      <radialGradient id="waxIn" cx="0.6" cy="0.65" r="0.7"><stop offset="0" stop-color="#d9a891"/><stop offset="1" stop-color="#a86f5b"/></radialGradient>
      <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dy="8" result="b"/><feFlood flood-color="#5b2f25" flood-opacity="0.4"/><feComposite in2="b" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g filter="url(#sealShadow)"><path d="${blob}Z" fill="url(#wax)"/></g>
    <circle cx="${c}" cy="${c}" r="132" fill="url(#waxIn)" stroke="#8e5a49" stroke-width="3"/>
    <circle cx="${c}" cy="${c}" r="120" fill="none" stroke="#e8c4b0" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
    ${leaf(c - 30, c + 40, 150, 60, "rose")}${leaf(c + 30, c + 40, 30, 60, "rose")}${leaf(c - 20, c - 50, 230, 48, "rose")}${leaf(c + 22, c - 50, -50, 48, "rose")}
    ${relief(c, c, 52, 0)}${relief(c - 62, c + 22, 28, 30)}${relief(c + 62, c + 22, 28, 60)}${relief(c, c - 72, 22, 10)}
    <ellipse cx="${c - 60}" cy="${c - 70}" rx="40" ry="18" transform="rotate(-35 ${c - 60} ${c - 70})" fill="#fff" opacity="0.18"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${body}</svg>`;
}

// ---------------------------------------------------------------- write the files

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [
    ["scene", scene(), { quality: 82 }],
    ["envelope", envelope(), { quality: 84, alphaQuality: 90 }],
    ["flap", flap(), { quality: 84, alphaQuality: 90 }],
    ["seal", seal(), { quality: 88, alphaQuality: 95 }],
  ];
  for (const [name, source, opts] of jobs) {
    if (process.argv.includes("--svg")) fs.writeFileSync(path.join(OUT, `${name}.svg`), source);
    await sharp(Buffer.from(source)).webp(opts).toFile(path.join(OUT, `${name}.webp`));
    console.log(`${name}.webp written`);
  }
})();
