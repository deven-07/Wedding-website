# DEVEN & ADITI — Wedding Invitation Website

A royal Rajasthani wedding invitation. Guests break a gold wax seal, an ivory scroll unrolls, and the invitation appears: a hero arch, a timeline of the three celebrations, a live countdown and a closing blessings page.

It is a static site (Vite + React + TypeScript + Tailwind + Framer Motion). The `dist/` folder deploys to Netlify or Vercel as it is.

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install        # first time only
npm run dev        # opens a live preview at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Type-checks and builds the production site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally to check it |
| `npm run lint` | Lint check (zero warnings allowed) |
| `npm run assets` | Re-generates the WhatsApp preview image, the iPhone icon and the venue QR code |
| `npm run fonts:subset` | Re-builds the small Devanagari font if you change the invocation text |

> **Tip:** the opening animation plays once per visit. To see it again, use **Replay opening** in the footer or open the page in a new tab.

---

## 2. Edit text, dates and venues

**Every word on the site lives in one file: [`src/config/wedding.ts`](src/config/wedding.ts).** Edit it, save it and the site updates.

### Venue, map link and QR code

The venue is set once at the top of `wedding.ts` and used by all three events:

```ts
const VENUE = {
  name: "Jai Chandragarh Palace",
  address: "Mandor II, Before Mandore Police Station, Jodhpur.",
  mapUrl: "https://maps.app.goo.gl/tvnQx9Tcj1kFTa986?g_st=ac",
};
```

- Each event card shows the venue and a **View Location** button.
- Below the timeline, a **Venue** card shows the address, a QR code and a **Get Directions** button. Guests can tap the QR code as well as scan it.
- The venue is also added to the Google Calendar and `.ics` entries.
- The QR code (`public/images/venue-qr.svg`) is generated from `mapUrl`. If you change the link, run `npm run assets`, then rebuild.
- If one event is at a different place, set that event's own `venue` / `mapUrl` instead of `VENUE_LINE` / `VENUE.mapUrl`. Leave them as `""` to hide them.

### Changing a date or time

Update the visible `date` / `time` **and** the `isoStart`. Always keep the Indian time offset `+05:30`:

```ts
isoStart: "2026-12-10T12:00:00+05:30",
```

The countdown target is `countdown.target`, in the same format. Because the offset is part of the value, the countdown and calendar entries are correct for guests anywhere in the world.

If you change the names or dates, also update `meta.dates` and run `npm run assets` so the WhatsApp preview image matches.

---

## 3. Background music

1. Put an MP3 at **`public/audio/wedding-music.mp3`**. One is already there.
2. Rebuild (`npm run build`). The music button only appears if the file existed at build time. If there is no file, the site works normally with no button and no errors.

Music **never autoplays**. It starts only after the guest taps *Open Wedding Invitation*, fades in over 2 seconds, loops, pauses when the guest switches tabs, and remembers if they muted it.

**Where to get music you are allowed to use:**

- [Pixabay Music](https://pixabay.com/music/): search "shehnai", "indian wedding" or "bansuri flute". Free to use; no attribution needed.
- [YouTube Audio Library](https://studio.youtube.com) (YouTube Studio → Audio Library): filter by "Attribution not required".
- Avoid film songs or other commercial tracks; those need a licence.

**Keep it small (≤ 1.5 MB, 96–128 kbps).** With [ffmpeg](https://ffmpeg.org/download.html):

```bash
# trim to 2 minutes, fade the ending, encode at 112 kbps
ffmpeg -i original.mp3 -t 120 -af "afade=t=out:st=115:d=5" -b:a 112k -ac 2 -ar 44100 public/audio/wedding-music.mp3
```

---

## 4. Your own Ganesha image (optional)

The site uses a hand-drawn gold line Ganesha. To use your own artwork instead:

1. Save it as **`public/images/ganesha.png`**: a square PNG (about 512 × 512) with a transparent background. Gold or light artwork works best on the maroon background.
2. Rebuild. It replaces the drawing everywhere on the site automatically.

---

## 5. Personalised guest links

Add `?guest=` to the link and the envelope greets the guest by name:

```
https://your-site.com/?guest=Sharma%20Family
```

- The envelope shows **"Dear Sharma Family,"**.
- The blessings page shows **"We would be honoured by your presence, Sharma Family"**.
- Names are cleaned (letters and simple punctuation only, at most 40 characters), so a typo or a pasted link can't break the page.

**The easy way:** open **`https://your-site.com/#/create-link`**. This hidden page is not linked from anywhere and is hidden from search engines. Type a name and you get a ready-made link, a **Share on WhatsApp** button and a preview.

When guests use the share button on the site, the link they send never includes their own name.

---

## 6. The WhatsApp / social preview

When the link is pasted in WhatsApp, guests see the title **"DEVEN & ADITI | Wedding Invitation"**, the quote, and `public/og-image.jpg`. That is a 1200 × 630 maroon-and-gold card with the Ganesha, "DEVEN & ADITI" and "10 – 12 December 2026".

- The image is generated from the site's own artwork. After changing names or dates, run `npm run assets` to regenerate it, then rebuild.
- **WhatsApp needs the full web address of the image.** Netlify and Vercel supply it automatically when they build the site for you. If you build on your own computer (e.g. for drag-and-drop), tell the build your address. See §7.
- To check the preview after deploying, paste your link into [opengraph.xyz](https://www.opengraph.xyz) or the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/). WhatsApp caches previews for a while. If you change the image, share the link with `?v=2` on the end to force a fresh preview.

---

## 7. Put it online

### Option A — Netlify drag-and-drop (no account setup needed)

1. Build with your site's address, so link previews work. Use your Netlify address, e.g. `https://deven-weds-aditi.netlify.app`, or your custom domain.
   - macOS / Linux / Git Bash:
     ```bash
     SITE_URL=https://deven-weds-aditi.netlify.app npm run build
     ```
   - Windows PowerShell:
     ```powershell
     $env:SITE_URL="https://deven-weds-aditi.netlify.app"; npm run build
     ```
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** and drag the **`dist`** folder onto the page.
3. Netlify gives you a link straight away. To pick a nicer name, go to **Site configuration → Change site name**. If the address changes, rebuild with the new `SITE_URL` and drag `dist` in again.

> Don't know the final address yet? Deploy once, note the address Netlify gives you, then rebuild with that `SITE_URL` and drag `dist` in again. Use **Deploys → drag and drop** on the same site.

### Option B — Netlify from GitHub (updates on every push)

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub**, then pick the repository.
3. Build command: `npm run build`. Publish directory: `dist`. Netlify fills these in automatically.
4. **Deploy.** Netlify provides the site address to the build automatically, so you don't need to set `SITE_URL`.

### Option C — Vercel

1. Push this folder to GitHub, then on **[vercel.com/new](https://vercel.com/new)** import the repository.
2. Vercel detects **Vite**: build `npm run build`, output `dist`. Click **Deploy**.
   (Or from the terminal: `npx vercel --prod`.)
3. Vercel provides the production address to the build automatically. If you use a custom domain, add `SITE_URL=https://your-domain` under **Settings → Environment Variables** and redeploy.

### Custom domain (e.g. `devenwedsaditi.com`)

1. Buy the domain from any registrar (GoDaddy, Namecheap, Google Domains/Squarespace, Hostinger…).
2. **Netlify:** Site → **Domain management → Add a domain**. **Vercel:** Project → **Settings → Domains → Add**.
3. Follow the on-screen DNS instructions at your registrar. Usually this is an `A` record for the root domain and a `CNAME` for `www`. HTTPS is set up for you once DNS has updated, which can take from a few minutes to a few hours.
4. Rebuild and redeploy with `SITE_URL=https://devenwedsaditi.com` so link previews use the new domain.

---

## 8. What's inside

```
src/
  config/wedding.ts      ← all text & event data (edit this)
  components/
    intro/               sealed envelope, wax seal, scroll unroll
    hero/                jharokha arch hero, couple names
    events/              timeline, event cards, Add to Calendar
    countdown/           live IST countdown
    blessings/           closing page, "touch the lotus" blessing
    ambient/             petals, gold dust, parallax, mandala
    ornaments/           hand-drawn SVG artwork (Ganesha, arch, toran, lotus, event art…)
    ui/                  buttons, music, share, progress, toast
  hooks/ lib/ styles/
scripts/
  generate-assets.mjs    builds og-image.jpg + apple-touch-icon.png
  subset-devanagari.mjs  shrinks the Devanagari font to the invocation
public/
  audio/ images/ og-image.jpg favicon.svg apple-touch-icon.png robots.txt _headers
PLAN.md                  design plan (colours, type, storyboard, animation timeline)
```

**Good to know**

- **Phones first:** checked at widths from 320 px to 1920 px, in portrait and landscape.
- **Reduced motion:** visitors who have "reduce motion" switched on get a gentle fade instead of the seal-and-scroll animation, and no falling petals or rotation.
- **Touch the lotus to send a blessing:** the bloom is remembered on the guest's own phone only. There is no server or database.
- **Calendar:** *Add to Calendar* offers a Google Calendar link and an `.ics` file (Apple Calendar, Outlook) in India time, with a default length of 2 hours.
