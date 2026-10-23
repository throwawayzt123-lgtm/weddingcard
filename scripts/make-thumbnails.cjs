/**
 * Re-creates the phone thumbnails used on the homepage and /designs.
 * Needs: the dev server running (npm run dev), Google Chrome installed, and
 *   npm install --no-save playwright-core
 * Run:  node scripts/make-thumbnails.cjs [baseUrl] [designKey ...]
 */
const { chromium } = require("playwright-core");
const sharp = require("sharp");
const fs = require("fs");
const waits = {
  "shahi-darwaza": 1800, gulzar: 1800, "mehndi-rang": 1800, noor: 4800,
  "nikah-nama": 1800, chandni: 1800, "siyah-taj": 1800, "neelam-kashi": 1800, chambeli: 1800,
  bazm: 1800, aasmani: 1800, sunehri: 1800, kesar: 1800, farman: 1800, jharoka: 1800, "mor-pankh": 1800, "gulab-mahal": 1800,
  "laal-gulab": 1800, mahtab: 1800, chaman: 1800, mehfil: 1800,
};
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
  const only = process.argv.slice(3); // optional: node scripts/make-thumbnails.cjs http://localhost:3000 kesar sunehri
  for (const [key, wait] of Object.entries(waits).filter(([k]) => !only.length || only.includes(k))) {
    const page = await ctx.newPage();
    await page.goto(`${process.argv[2] || "http://localhost:3000"}/preview/${key}?embed=1`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}.inv-music-btn{display:none!important}" });
    await page.waitForTimeout(wait);
    const dir = `${__dirname}/../public/templates/${key}`;
    fs.mkdirSync(dir, { recursive: true });
    const save = async (name) => { const b = await page.screenshot(); await sharp(b).resize({ width: 480 }).webp({ quality: 74 }).toFile(`${dir}/${name}.webp`); };
    await save("thumb");
    await page.getByRole("button", { name: /tap to open/i }).click({ force: true });
    await page.waitForTimeout(4200);
    await save("thumb-2");
    console.log(key, "ok");
    await page.close();
  }
  await browser.close();
})();
