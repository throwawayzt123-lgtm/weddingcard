# Aesthetic Wedding Cards

A website for selling **digital wedding invitations**. Customers pick one of **sixteen** animated designs (royal doors, a sealed envelope, mehndi curtains, an emerald arch, a crimson book, a silver moon-dial, a black roller shutter, blue Multani tiles, a pure-white jasmine design, a wine-red royal decree, a sandstone lattice window a peacock-feather fan **Bazm**, a sky-blue cloud design (Aasmani), a champagne-gold gift box (Sunehri) and a saffron diya (Kesar)). Every design is a set of **full-screen chapters**: as you scroll, swipe or use the menu, the background picture, the colours and the layout all change), you create their invitation from the admin panel, and they fill in the rest from their own portal. Every guest gets a personal link (“Dear Mr & Mrs Ali”) to share on WhatsApp, with RSVP, maps, music and a countdown.

**The most important rule:** the groom and bride names are entered only by you (the admin) and are **locked**. A customer can never change them, so one purchase cannot be reused for another wedding. [Proof it works](#the-locked-names-and-the-proof) · [Where to read more](#more-guides)

| Part | What it is |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript (strict) |
| Look | Tailwind CSS 4, **GSAP + ScrollTrigger** (scroll animations), Framer Motion (small interactions) |
| Database | PostgreSQL on **Neon**, Prisma 6 |
| Login | Auth.js v5, passwords hashed with bcrypt, roles `ADMIN` / `CLIENT` |
| Validation | Zod, on every form and every server action |
| Uploads | Cloudinary (and a local fallback while developing) |
| Hosting | Vercel |

> Next.js 16 replaced the file called `middleware.ts` with **`src/proxy.ts`**. If you read older tutorials, that is the only big difference you will meet.

---

## 1. Run it on your computer (Windows)

You need **Node.js 20.9 or newer** (`node -v`) and **Git**.

1. **Create a free database.** Go to <https://neon.tech> → sign up → *Create project* (region *AWS Asia Pacific (Singapore)*). Click **Connect**:
   - with *Connection pooling* **ON**, copy the string → this is `DATABASE_URL`
   - with *Connection pooling* **OFF**, copy the string → this is `DIRECT_URL`
2. **Create your settings file** (PowerShell, inside the project folder):
   ```powershell
   Copy-Item .env.example .env
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Open `.env` and fill in `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (the long text printed above), `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. **Install and set up:**
   ```powershell
   npm install
   npm run db:deploy
   npm run db:seed
   npm run dev
   ```
4. Open <http://localhost:3000> (or the address `npm run dev` prints).

**Logins after seeding**

| Who | Login | Password |
|---|---|---|
| You (admin) | your `ADMIN_EMAIL` | your `ADMIN_PASSWORD` |
| Demo customer | `demo` | `demo12345` |

The seed also creates the demo invitation **Ahmad & Sara** at `/i/ahmad-weds-sara` (personal link: `/i/ahmad-weds-sara/demosara`).

---

## 2. Your daily routine

1. A customer opens `/designs`, watches the live demos and taps **Order This Design** (opens WhatsApp with the message ready).
2. They pay you (bank transfer / JazzCash / EasyPaisa).
3. **Admin → New invitation.** Choose the design, type the two names carefully (they become locked), the date, plan and payment. Press the button.
4. You get a ready-made WhatsApp message with their **username, password and invitation link**. Tap *Send on WhatsApp*. The password is shown once; we only store a scrambled version.
5. The customer logs in at `/login` and fills in events, families, photos, music and guests, then sends personal links to each guest on WhatsApp.
6. Later you can: correct a spelling (**Admin → the invitation → Correct names**, recorded in the audit log), extend the expiry, change the plan or design, suspend, reset a password, or open the customer's portal to help them (**Open customer portal**).

**Where to change things**

| What | Where |
|---|---|
| Brand name, WhatsApp number, default expiry days, the guest WhatsApp message, logo, your admin password | **Admin → Settings** |
| Plan limits (events, guests, photos, RSVP, own music) | `src/lib/plans.ts`, one file |
| Which music tracks each design offers | `src/templates/registry.ts` |
| Brand defaults used before you save settings | `src/lib/site.ts` |

---

## 3. The locked names, and the proof

- Names, web address (slug), design, plan, expiry and status are **never** written by any customer code. Customer forms are *strict*: if a request contains any extra field such as `groomName`, it is **rejected**, not ignored.
- The wedding date is locked by default (you can unlock it per invitation).
- Every portal action re-checks on the server: who is logged in, that the invitation belongs to them, and that it is not suspended or expired. The id sent by the browser is never trusted on its own.
- Every admin change to a locked field is saved in **Admin → Audit log** (old value, new value, who, when).

**Run the proof yourself:**
```powershell
npm run test:name-lock
```
It creates a temporary customer and invitation, tries 30+ ways to cheat, prints ✔ or ✖ for each, and deletes everything it made. Expect `ALL CHECKS PASSED`.

---

## 4. Photos and music

All sixteen designs are built with CSS and SVG, so they work with no images at all. See [docs/ASSETS.md](docs/ASSETS.md) for the list of included photos, **AI prompts** for better ones, and what music to use.

- ⚠️ The four MP3s in `public/music/` were *generated* as placeholders. Replace them with royalty-free music (same file names) before launch.
- The demo photos (Pexels) appear only on the demo preview pages.

**Uploads (customer photos, couple photo, own music, your logo).**
While developing, files are saved in `public/uploads/` (ignored by git). On the live site they go to **Cloudinary**: create a free account at <https://cloudinary.com>, open *Dashboard → Product Environment → API Keys*, and put the three values in `.env` (and in Vercel): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
Photos are shrunk in the customer's browser before uploading (so uploads are fast on mobile data), and music goes straight to Cloudinary (so it is not limited by Vercel's 4.5 MB request size).

> I could test the **local** upload path end to end. The **Cloudinary** path is written and its signing is standard, but it has not been run against a real Cloudinary account. After adding your keys, upload one photo and one MP3 from a test customer portal to confirm (see the launch checklist).

---

## 5. Put it online: Vercel + Neon + your domain

**A. Put the code on GitHub**
1. Create a free account at <https://github.com> and a **private** repository (for example `wedcard`).
2. In PowerShell, inside the project folder:
   ```powershell
   git add -A
   git commit -m "First version"
   git branch -M main
   git remote add origin https://github.com/YOUR-NAME/wedcard.git
   git push -u origin main
   ```
   (`.env` is in `.gitignore`, so your passwords are **not** uploaded.)

**B. Deploy on Vercel**
1. Sign up at <https://vercel.com> with GitHub → *Add New → Project* → pick the repository → *Import*.
2. Open **Environment Variables** and add (same values as your `.env`, except the last two):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled string |
   | `DIRECT_URL` | Neon direct string |
   | `AUTH_SECRET` | the long random text (use a **new** one for the live site) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` (or the `…vercel.app` address at first) |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | from Cloudinary |
   | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | only needed for the seed (step C) |
   | `SEED_DEMO` | `false` |

3. Click **Deploy**. Vercel runs `npm run vercel-build`, which installs, **applies the database migrations automatically**, and builds.

**C. Create your admin account on the live database** (once)
If the live site uses the **same Neon database** you already seeded, you are done: log in with the same admin.
For a **new, empty** database, run in PowerShell (use the live strings):
```powershell
$env:DATABASE_URL="postgresql://...pooled..."
$env:DIRECT_URL="postgresql://...direct..."
$env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="a-strong-password"; $env:SEED_DEMO="false"
npm run db:deploy
npm run db:seed
```
(Open a **new** PowerShell window afterwards so these temporary values disappear.)

**D. Connect your own domain**
1. Vercel → your project → *Settings → Domains* → *Add* `your-domain.com` (and `www.your-domain.com`).
2. At the company where you bought the domain, add the DNS records Vercel shows. Usually: type **A**, name **@**, value **76.76.21.21**, and type **CNAME**, name **www**, value **cname.vercel-dns.com**. It can take from a few minutes to a few hours.
3. Change `NEXT_PUBLIC_SITE_URL` in Vercel to `https://your-domain.com` and **Redeploy** (*Deployments → … → Redeploy*). Invitation links and WhatsApp previews use this address.

**E. After launch: checklist**
- [ ] Log in as admin on the live site and change your password (**Admin → Settings**).
- [ ] **Admin → Settings:** brand name, WhatsApp number, logo.
- [ ] Create one **test invitation** for yourself, log in as that customer on your phone, add an event, a guest and a photo, send the link to yourself on WhatsApp.
- [ ] Paste an invitation link into WhatsApp and check the **preview card** shows the names.
- [ ] Upload one photo and one MP3 (confirms Cloudinary).
- [ ] Replace the placeholder music in `public/music/`.
- [ ] Delete the test invitation (it is the same as deleting any invitation).
- [ ] Walk through [docs/MOBILE-TESTING.md](docs/MOBILE-TESTING.md) on a real phone.

---

## 6. Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the site locally |
| `npm run build` / `npm start` | Make and run the production version |
| `npm run typecheck` | Check the code for TypeScript errors |
| `npm run test:name-lock` | Prove customers cannot change the locked fields |
| `npm run db:deploy` | Apply database migrations |
| `npm run db:seed` | Create/refresh your admin account (and the demo data unless `SEED_DEMO=false`) |
| `npm run db:studio` | Browse the database visually |
| `npm run db:migrate` | (Developer) create a migration after editing `prisma/schema.prisma` |
| `node scripts/make-farman-corners.cjs` | Re-draws the gold corner flourishes of the Farman design (change the colour inside the file) |
| `node scripts/make-chambeli-sprig.cjs` | Re-draws the jasmine artwork of the Chambeli design (change its colours inside the file) |
| `node scripts/make-thumbnails.cjs` | Re-take the design thumbnails (needs `npm i --no-save playwright-core` and Chrome) |

> After changing the database schema, **stop `npm run dev` first** (Windows locks a Prisma file while the server runs), then run `npm run db:deploy` and `npx prisma generate`, then start `npm run dev` again.

---

## 7. How the code is organised

```
prisma/                 schema.prisma (tables), migrations/, seed.ts
public/
  templates/<design>/   photos + thumbnails for each design
  music/                the four MP3s
  demo/                 demo photos (preview pages only)
scripts/                test-name-lock.ts, make-thumbnails.cjs, make-placeholder-music.cjs
docs/                   ASSETS.md, MOBILE-TESTING.md
src/
  proxy.ts, auth.ts, auth.config.ts      login + route protection
  app/
    page.tsx, designs/                   public marketing pages
    preview/[templateKey]/               live demos
    i/[slug]/ and i/[slug]/[guestCode]/  the real invitations (+ share-preview images)
    login/, dashboard/                   login and role redirect
    admin/                               your panel
    portal/                              the customer portal
    api/                                 login endpoints, local upload (dev only)
  templates/
    registry.ts                          the list of designs and music tracks
    shahi-darwaza/ gulzar/ mehndi-rang/ noor/   one folder per design (opening screen + colours)
    demo-data.ts, template-host.tsx, types.ts
  components/
    invite-shared/                       sections every design shares (events, RSVP, gallery…)
    marketing/ admin/ portal/ ui/        screens and small building blocks
  lib/
    dal.ts                               "who is logged in" checks (the real security)
    plans.ts, site.ts, settings.ts       limits, defaults, saved settings
    invitations.ts                       admin-only rules (create, correct names, expiry…)
    portal.ts, portal-ops.ts, portal-schemas.ts   what a customer may change (strict)
    guests.ts, uploads.ts, storage.ts    guests/import, uploads, Cloudinary
    rate-limit.ts, audit.ts, og.tsx …
```

**Add a seventeenth design:** copy a folder in `src/templates/`, change its colours and opening screen, add it to `registry.ts` and `template-host.tsx`, and take a thumbnail. Nothing else changes.

---

### Animations (GSAP)

- **Full-screen chapters (every design):** the invitation is a set of chapters (blessings, each celebration, families, moments, RSVP). Scroll, swipe, use the arrow keys or the menu: the picture, the colours and the layout change. The engine is in `src/components/invite-shared/chapters/`; each design only supplies a small `chapters.tsx` with its own pictures, colour schemes and layouts (`split`, `flip`, `overlay`, `arch`, `poster`). Each guest's name is free text (for example Mr & Mrs Ali, or Mr Ali and his family) and appears on the cover of every design as well as in the greeting. The first chapter always shows the same generic picture (`hands-wedding.webp`, no couple); the couple's own photo goes first in their Moments gallery. The pictures are in `public/templates/photos/` (replace any file with your own, same name; list in `CREDITS.md`). The older single-page layout is still in `invite-shared/content.tsx`: a design uses it when it does not pass `loadContent`.
- **Invitations:** the hero names appear just as the opening screen finishes and drift away as you scroll; sections rise into place; the two families arrive from opposite sides; the couple photo has parallax depth; the **event cards pile on top of each other**; the **gallery is pinned and slides sideways** while you scroll down. The code is in `src/components/invite-shared/use-invite-motion.ts`.
- **Website:** the four "How it works" cards pile up, the designs sit in a simple 3-column grid, the hero phones drift at different speeds, and cards rise in. See `src/components/marketing/page-motion.tsx`.
- Shared helpers (`stackCards`, `horizontalScroll`, `riseIn`, `parallax`) are in `src/lib/motion.ts`: use them to add the same effects anywhere.
- Everything is switched off for visitors who set **Reduce motion** on their phone or computer; they get the plain page. The animation code is downloaded only after the opening screen (invitations) or at the first scroll (website), so the first screen stays fast.
- Each design needs a solid card colour for the pile: it is the `--inv-stack-bg` line near the top of every design's CSS file.

## 8. Security notes

- Passwords are hashed with bcrypt. Login is rate-limited (10 tries per account and 20 per internet connection every 15 minutes); RSVP replies are rate-limited too.
- `/admin` and `/portal` are guarded twice: quickly in `src/proxy.ts` and properly on the server in every page and action (`src/lib/dal.ts`). When you reset a password or a customer changes theirs, they are logged out everywhere immediately.
- Guest codes are 8 random characters (about 850 billion possibilities), so they cannot be guessed or listed.
- All text is cleaned of HTML. Uploaded images are checked by their real content (not their file name), size-limited (5 MB images, 10 MB MP3), and re-encoded to remove hidden data such as GPS location.
- CSV downloads neutralise spreadsheet formulas. Link-preview robots (WhatsApp, Facebook…) are **not** counted as “guest opened the invitation”.
- Invitations, previews, the portal and the admin are marked `noindex` and blocked in `robots.txt`; only the homepage and `/designs` are for Google.
- Adding a strict Content-Security-Policy header is a good future step; it was left out to avoid breaking the animations.

---

## 9. Troubleshooting

| You see | Do this |
|---|---|
| “Missing settings in .env” in the terminal | Fill in `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, then restart `npm run dev` |
| Login page says “Can't connect to the database” | Check `DATABASE_URL`; run `npm run db:deploy` and `npm run db:seed` |
| “Server configuration” error page on login | `AUTH_SECRET` is missing in `.env` |
| `EPERM … query_engine` when running Prisma | Stop `npm run dev` first (see the note under Commands) |
| Invitation says “not found” | Check the link; the invitation may be a draft or deleted |
| Uploads say “not set up yet” (on the live site) | Add the three Cloudinary values in Vercel and redeploy |
| WhatsApp preview shows the old picture | WhatsApp caches links; add `?v=2` to the end of the link to refresh |

---

## 10. Honest limits of this version

- No emails are sent (everything goes through WhatsApp messages you send yourself).
- Payments are manual (you mark an invitation Paid).
- The Cloudinary upload path needs your keys to be tested (see section 4).
- Automatic Urdu translation is not included; customers type Urdu themselves and it is shown right-to-left.
- The music files are placeholders.

## More guides

- [docs/ASSETS.md](docs/ASSETS.md): photos, AI image prompts, music
- [docs/MOBILE-TESTING.md](docs/MOBILE-TESTING.md): checklist to test on real phones
