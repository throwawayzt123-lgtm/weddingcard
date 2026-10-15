/**
 * Draws the jasmine sprig used by the "Chambeli" design and saves it as
 * public/templates/chambeli/sprig.svg  (and flower.svg, a single open flower).
 * Run:  node scripts/make-chambeli-sprig.cjs
 * Change the colours or flower positions below and run it again.
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "templates", "chambeli");
const r2 = (n) => Math.round(n * 100) / 100;

const SAGE = "#86a086";
const LEAF = "#b9ccb4";
const LEAF_DARK = "#8aa588";
const PETAL_EDGE = "#a8b9a5";
const GOLD = "#d9bd78";

// A cubic Bézier: point and direction at t
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  const x = u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0];
  const y = u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
};

const SEG1 = [[8, 232], [70, 214], [118, 152], [172, 118]];
const SEG2 = [[172, 118], [226, 84], [272, 62], [312, 18]];
const seg = (s, t) => bez(s[0], s[1], s[2], s[3], t);

const leaf = (x, y, angle, scale, dark = false) =>
  `<path transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)}) scale(${scale})" d="M0 0C6 -8 20 -8 30 0C20 8 6 8 0 0Z" fill="${dark ? LEAF_DARK : LEAF}" stroke="${SAGE}" stroke-width="0.6" opacity="0.95"/>` +
  `<path transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)}) scale(${scale})" d="M2 0H26" stroke="${SAGE}" stroke-width="0.5" opacity="0.7"/>`;

// One open jasmine flower: five pointed petals, a soft shadow under them, a gold heart
const PETAL = "M0 0C-7 -6 -6.5 -17 0 -23C6.5 -17 7 -6 0 0Z";
const flower = (x, y, r, rot) => {
  const s = r / 22;
  const petals = (extra) => [0, 72, 144, 216, 288].map((a) => `<path d="${PETAL}" transform="rotate(${a})" ${extra}/>`).join("");
  return (
    `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${r2(s)})">` +
    `<g transform="translate(1.2 2)" fill="rgba(90,110,92,0.16)">${petals("")}</g>` +
    `<g fill="#ffffff" stroke="${PETAL_EDGE}" stroke-width="0.7">${petals("")}</g>` +
    `<g fill="#f4f1e8" opacity="0.9">${[0, 72, 144, 216, 288].map((a) => `<path d="M0 -2C-3 -6 -3 -11 0 -14C3 -11 3 -6 0 -2Z" transform="rotate(${a})"/>`).join("")}</g>` +
    `<circle r="2.6" fill="${GOLD}"/><circle r="1" fill="#b99a4d"/>` +
    `</g>`
  );
};

// A jasmine bud: a slim white teardrop, tipped with a blush of pink
const bud = (x, y, len, rot) =>
  `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${rot}) scale(${r2(len / 16)})">` +
  `<path d="M0 0C-3 -4 -3.4 -11 0 -17C3.4 -11 3 -4 0 0Z" fill="#ffffff" stroke="${PETAL_EDGE}" stroke-width="0.7"/>` +
  `<path d="M0 -12C-1.4 -14 -1 -16 0 -17C1 -16 1.4 -14 0 -12Z" fill="#efd3d3"/>` +
  `</g>`;

function sprig() {
  const parts = [];
  // stems
  parts.push(`<path d="M${SEG1[0]} C${SEG1[1]} ${SEG1[2]} ${SEG1[3]} C${SEG2[1]} ${SEG2[2]} ${SEG2[3]}" fill="none" stroke="${SAGE}" stroke-width="1.7" stroke-linecap="round"/>`);
  parts.push(`<path d="M122 150C130 116 150 86 180 56" fill="none" stroke="${SAGE}" stroke-width="1.2" stroke-linecap="round"/>`);
  parts.push(`<path d="M204 100C216 128 240 142 268 140" fill="none" stroke="${SAGE}" stroke-width="1.2" stroke-linecap="round"/>`);

  // leaves along both stems, in pairs, growing and shrinking
  [SEG1, SEG2].forEach((s, si) => {
    [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.94].forEach((t, i) => {
      const p = seg(s, t);
      const size = 0.55 + 0.4 * Math.sin(((i + 1) / 8) * Math.PI);
      parts.push(leaf(p.x, p.y, p.angle - 58 - (i % 2) * 6, size, si === 1));
      parts.push(leaf(p.x, p.y, p.angle + 62 + (i % 2) * 6, size * 0.92, si === 1));
    });
  });
  // leaves on the side shoots
  [[126, 146, -78], [140, 124, -62], [158, 96, -50], [210, 108, 38], [232, 130, 20], [252, 138, 4]].forEach(([x, y, a], i) => parts.push(leaf(x, y, a, 0.5 + (i % 3) * 0.08)));

  // flowers (sit slightly off the stem, so it reads as a real sprig)
  const f = (s, t, off, r, rot) => {
    const p = seg(s, t);
    const nx = -Math.sin((p.angle * Math.PI) / 180) * off;
    const ny = Math.cos((p.angle * Math.PI) / 180) * off;
    parts.push(flower(p.x + nx, p.y + ny, r, rot));
  };
  f(SEG1, 0.2, 13, 17, 14);
  f(SEG1, 0.58, -15, 22, -20);
  f(SEG1, 0.9, 14, 17, 36);
  f(SEG2, 0.3, -14, 20, 8);
  f(SEG2, 0.68, 13, 16, -30);
  parts.push(flower(180, 54, 15, 24));
  parts.push(flower(270, 142, 15, -12));

  // buds
  const b = (s, t, off, len, rot) => {
    const p = seg(s, t);
    const nx = -Math.sin((p.angle * Math.PI) / 180) * off;
    const ny = Math.cos((p.angle * Math.PI) / 180) * off;
    parts.push(bud(p.x + nx, p.y + ny, len, rot));
  };
  b(SEG1, 0.06, -8, 16, -30);
  b(SEG1, 0.4, 10, 18, 150);
  b(SEG2, 0.52, 12, 17, 120);
  b(SEG2, 0.84, -10, 17, 30);
  parts.push(bud(312, 18, 19, 38));
  parts.push(bud(184, 44, 15, -20));
  parts.push(bud(276, 150, 14, 105));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 250">${parts.join("")}</svg>\n`;
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "sprig.svg"), sprig());
fs.writeFileSync(path.join(OUT, "flower.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -30 60 60">${flower(0, 0, 24, 0)}</svg>\n`);
console.log("wrote", path.join(OUT, "sprig.svg"), "and flower.svg");
