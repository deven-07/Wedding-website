# Build Brief: "DEVEN Weds ADITI" — Royal Rajasthani Wedding Invitation Website

You are a senior creative director, UI/UX designer and frontend engineer who specialises in luxury Indian wedding experiences. Build a complete, production-ready, mobile-first wedding invitation website from this brief. Take creative ownership: where this brief leaves room, make tasteful, premium choices — but never change the fixed content in Section 3.

The finished site should feel like a guest is unsealing and unrolling a hand-crafted royal Rajasthani invitation — not like a generic wedding template. Most guests will open it from a WhatsApp link on a phone, so the mobile experience is the primary experience.

---

## 1. How to work (follow this order)

Work in phases. After each phase, run `npm run build` and `npm run lint`, fix every error and warning, then give me a 3–5 line summary of what was done and **stop for my review** before starting the next phase.

- **Phase 0 — Plan (no code yet).** Write `PLAN.md` containing: visual hierarchy, colour tokens, type scale, the full scroll storyboard (what the guest sees at each scroll position on a phone), the opening-animation timeline (step by step with durations), the component tree, and the list of SVG assets you will hand-draw. Stop and wait for my approval.
- **Phase 1 — Foundation.** Project setup, design tokens, fonts, the content config file, global layout, texture backgrounds, reduced-motion handling.
- **Phase 2 — Opening experience.** The sealed invitation, wax-seal break, scroll unrolling, music start. This is the most important phase — polish it until it feels magical.
- **Phase 3 — Hero + Events timeline.**
- **Phase 4 — Countdown, Blessings, interactive extras (Section 7).**
- **Phase 5 — Polish & QA.** Performance, accessibility, cross-device checks, SEO / WhatsApp preview, the acceptance checklist in Section 11.

Never leave TODOs, lorem ipsum, broken imports or empty image boxes. If an asset doesn't exist, draw a beautiful SVG/CSS alternative.

---

## 2. Tech stack (fixed)

- **Vite + React 18 + TypeScript (strict mode)**
- **Tailwind CSS** with the colour palette defined as theme tokens
- **Framer Motion** for animation (use `LazyMotion` + `domAnimation` to keep the bundle small)
- **Lucide React** only for functional icons (music, calendar, share, map) — never as decoration
- **Google Fonts** (self-hosted via `@fontsource` packages so there's no flash of unstyled text):
  - `Cinzel` / `Cinzel Decorative` — royal headings, "WEDS", event titles
  - `Cormorant Garamond` (incl. italic) — the couple's names, quotes, elegant body
  - `Lato` — small UI text, buttons, countdown labels
  - `Tiro Devanagari Sanskrit` (or `Noto Serif Devanagari`) — "|| श्री गणेशाय नमः ||"
- No other UI libraries. No jQuery, no heavy particle libraries — build particles/petals yourself with CSS or a light canvas.

Output must be a static build (`dist/`) that deploys to Netlify or Vercel with zero configuration.

---

## 3. Fixed content — single source of truth

Create `src/config/wedding.ts` holding ALL text and event data. Every component reads from this file; no wedding text is hard-coded anywhere else. Reproduce the strings below **exactly** (spelling, capitalisation, punctuation).

```ts
export const wedding = {
  invocation: "|| श्री गणेशाय नमः ||",
  blessingLine: "With the blessings of Lord Ganesha",
  teaser: "A wedding celebration awaits...",
  groom: "DEVEN",
  bride: "ADITI",
  weds: "Weds",
  openButton: "OPEN WEDDING INVITATION",

  hero: {
    familiesLine: "Together with our families,",
    inviteLine: "We joyfully invite you to celebrate the wedding of",
    quote: "Two hearts, one beautiful journey, and a lifetime of togetherness.",
  },

  eventsHeading: "Wedding Celebrations",
  eventsSubheading: "Three beautiful occasions, countless unforgettable memories.",

  events: [
    {
      id: "haldi",
      title: "HALDI CEREMONY",
      date: "10 December 2026",
      time: "12:00 PM",
      isoStart: "2026-12-10T12:00:00+05:30",
      quote: "An afternoon filled with colours, laughter, blessings and the warmth of turmeric.",
      theme: "haldi",
      venue: "",      // leave empty — I will fill in later
      mapUrl: "",     // leave empty — I will fill in later
    },
    {
      id: "reception",
      title: "WEDDING RECEPTION",
      date: "10 December 2026",
      time: "6:30 PM",
      isoStart: "2026-12-10T18:30:00+05:30",
      quote: "An evening of celebration, love, happiness and togetherness.",
      theme: "reception",
      venue: "",
      mapUrl: "",
    },
    {
      id: "baarat",
      title: "BAARAT PRASTHAN",
      date: "12 December 2026",
      time: "7:00 PM",
      isoStart: "2026-12-12T19:00:00+05:30",
      quote: "With music, celebration and blessings, the journey towards a beautiful new beginning begins.",
      theme: "baarat",
      venue: "",
      mapUrl: "",
    },
  ],

  countdown: {
    heading: "Counting Down to Forever",
    target: "2026-12-12T19:00:00+05:30", // Baarat Prasthan, Indian Standard Time
  },

  blessings: {
    heading: "Your Presence Will Make Our Celebration Even More Special",
    message: "With love, joy, and the blessings of our families, we look forward to celebrating these beautiful moments with you.",
    signOff: "With Love & Warm Regards",
    footer: "Made with Love",
  },
};
```

Rules:
- Do **not** invent venues, family names, phone numbers, or any other details. If `venue` / `mapUrl` are empty, simply hide those UI elements (no "TBA" or placeholder text).
- Always compute times in IST (`+05:30`) so the countdown is correct for guests anywhere in the world.

---

## 4. Art direction

**Mood:** royal, warm, candle-lit, hand-crafted. Rich in detail but calm — generous empty space, ornament at the edges, text always clearly readable. Think a ₹1 lakh+ letterpress invitation brought to life, not a festive banner.

**Colour tokens** (use only these, plus transparent/opacity variants):

| Token | Hex | Use |
|---|---|---|
| maroon | `#641B2B` | primary backgrounds, Reception & Baarat cards |
| burgundy | `#3D101D` | deepest backgrounds, vignettes, shadows |
| gold | `#C9A45C` | borders, ornaments, headings on dark |
| champagne | `#E8D6A3` | soft highlights, text on maroon |
| ivory | `#FFF8E9` | the invitation paper |
| cream | `#F5EBD8` | secondary paper, card interiors |
| saffron | `#D88B36` | Haldi accents, diya flames, small highlights only |

- Alternate sections between **dark maroon "velvet"** and **ivory "handmade paper"** so the page feels like layered materials.
- Paper texture: subtle SVG `feTurbulence` noise + soft deckled edges — no large texture images.
- Gold should look like **foil**, not flat yellow: use a multi-stop linear gradient (dark antique gold → champagne → gold) on headings and borders, with a slow shimmer sweep on the most important ones only (names, section headings).
- Contrast: all body text must meet WCAG AA against its background.

**Typography hierarchy**
- Names "DEVEN" / "ADITI": Cormorant Garamond, very large (clamp ~3rem → 7rem), wide letter-spacing, gold-foil gradient.
- "Weds": Cormorant Garamond italic or a script-like treatment, smaller, flanked by tiny ornamental flourishes.
- Section headings: Cinzel, uppercase, tracked out, with an ornamental divider below.
- Quotes: Cormorant Garamond italic, champagne on dark / burgundy on light.
- Use fluid sizes with `clamp()` everywhere.

**Hand-drawn SVG asset set** (create as React components in `src/components/ornaments/`, all using `currentColor` / theme tokens so they can be recoloured):
1. Ganesha motif — a minimal, elegant, respectful line-art Ganesha in gold (think fine-line temple engraving, not a cartoon). If you cannot make it look genuinely refined, use an equally elegant fallback: a decorated kalash or an "ॐ" within a lotus medallion. Also support an optional user-supplied image at `/public/images/ganesha.png` that replaces the SVG automatically if the file exists.
2. Rajasthani jharokha / scalloped arch frame (for the hero)
3. Corner filigree (one SVG, mirrored for all four corners)
4. Mandala (layered, so rings can rotate at different speeds)
5. Lotus, paisley (buta), marigold flower, rose petal
6. Marigold toran / garland (hanging across the top of sections)
7. Diya with an animated flame
8. Ornamental horizontal divider (with a centre motif)
9. Wax seal with a "D ❀ A" monogram
10. Event illustrations: Haldi (turmeric bowl + marigolds), Reception (palace arch + hanging lanterns), Baarat (decorated horse silhouette with dhol & shehnai accents)

No emojis or clip-art anywhere.

---

## 5. Page flow, section by section

### 5.1 Opening screen — the sealed invitation (most important)

Full-screen (`100dvh`, no scrolling until opened), deep maroon velvet background with a faint gold damask/mandala pattern, slow-drifting gold dust particles, and a few falling petals.

In the centre: a royal invitation **envelope or scroll case** in maroon with gold filigree edges, sealed with the gold wax seal. On/above it:
- Ganesha motif (gently glowing)
- `|| श्री गणेशाय नमः ||`
- "With the blessings of Lord Ganesha"
- "A wedding celebration awaits..."
- **DEVEN** / *Weds* / **ADITI**
- If a guest name is present (see 7.1): "Dear {Guest Name}," above the names.
- The gold button **OPEN WEDDING INVITATION** with a soft pulsing glow (and a hint that the seal can be tapped).

**Opening animation** (tap button or wax seal; total ~2.5–3.5 s, skippable by tapping again):
1. Wax seal cracks into 2–3 pieces that fall away with slight rotation (≈0.5 s).
2. Envelope flap lifts in 3D (`rotateX` with perspective) OR the scroll case's ribbon unties (≈0.6 s).
3. An ivory paper scroll slides up and **unrolls vertically** with rolled wooden/gold rods at top and bottom; the paper reveals top-to-bottom using a clip-path, the rods carry a subtle shadow (≈1.2 s).
4. A burst of marigold & rose petals plus a soft gold light flare (≈0.6 s).
5. The scroll expands to fill the screen and becomes the Hero section; normal page scrolling unlocks.
6. Background music fades in over 2 s (see Section 8).

Must run at 60 fps on a mid-range Android phone: animate only `transform`, `opacity` and `clip-path`. If the visitor has `prefers-reduced-motion`, replace the whole sequence with a gentle 0.6 s crossfade.

Remember in `sessionStorage` that the invitation was opened, so a page refresh during the same visit goes straight to the hero (with a small "Replay opening" link in the footer).

### 5.2 Hero — the royal arch

Ivory paper section framed by the jharokha arch with a marigold toran hanging across the top and filigree corners. Behind the arch, a large mandala rotates very slowly (one turn per ~120 s), with light rays fanning behind it.

Content, revealed in a staggered sequence:
`|| श्री गणेशाय नमः ||` → "Together with our families," → "We joyfully invite you to celebrate the wedding of" → **DEVEN** (letters reveal one by one) → ornamental *WEDS* with flourishes that draw themselves in (SVG stroke animation) → **ADITI** (letters reveal one by one) → divider → the quote.

Add a subtle "scroll down" indicator: a small gold diya or paisley that gently bobs.

### 5.3 Wedding Celebrations — event timeline

Heading "Wedding Celebrations", subheading "Three beautiful occasions, countless unforgettable memories."

**Layout:**
- **Desktop / tablet:** a horizontal or alternating timeline joined by a gold thread with diya "nodes". The thread **draws itself** as the user scrolls (scroll-linked `pathLength`), and each node lights up when its card enters view.
- **Mobile:** a vertical timeline — gold thread down the left side, cards stacked on the right, full readable width.

**Each card** is a small royal invitation in its own right, with a shared structure (ornamental top, illustration, title, date, time, quote, action buttons) but a unique skin:
- **Haldi:** cream/ivory card with saffron & turmeric accents, a marigold garland across the top, turmeric-swirl ornaments; on hover/tap a few marigold petals drift down.
- **Reception:** burgundy card with gold palace-arch frame, hanging lanterns with a soft warm flicker, a gentle glow behind the title.
- **Baarat Prasthan:** maroon & gold card with the decorated horse illustration, dhol/shehnai accents and a small petal-confetti burst when the card first enters view.

Card actions (small, elegant gold-outline buttons with Lucide icons):
- **Add to Calendar** — opens a small menu: Google Calendar link + downloadable `.ics` file (generated client-side from `isoStart`, 2-hour default duration, Asia/Kolkata).
- **View Location** — shown only if `mapUrl` is filled.

Entrance animation: cards rise and unfold slightly (scale 0.96 → 1, small rotateX) with a stagger. Hover (desktop): lift by 4–6 px, gold border glow intensifies. Tap (mobile): same effect briefly.

### 5.4 Countdown — "Counting Down to Forever"

Deep maroon velvet with a slowly rotating mandala watermark. Four gold-foil-bordered boxes: **Days · Hours · Minutes · Seconds**, numbers in Cinzel. Each digit change animates with a subtle vertical flip/slide (seconds only — don't animate everything every second). Target is `countdown.target` in IST.

- Pad numbers to two digits, use tabular numerals so boxes don't jitter.
- Avoid hydration/first-paint flicker (compute on mount, show a skeleton for the first frame).
- After the target passes, replace the boxes with an elegant message: "The celebrations have begun" with a petal shower.
- On mobile, the four boxes fit in one row without overflow (2×2 grid on very small screens < 360 px).

### 5.5 Blessings — closing section

Ivory paper inside a full gold floral border that draws itself in as the section enters view. A glowing diya at the top with an animated flame, mandala faintly behind.

Content: the heading, the message, **DEVEN Weds ADITI** in the hero name style, "With Love & Warm Regards", then a divider and a small footer: "Made with Love".

---

## 6. Ambient motion system

Build reusable, performance-safe ambient layers:
- **Petals:** CSS-animated marigold and rose petals falling with randomised drift, rotation and speed. Max ~12 on mobile, ~25 on desktop. Petals never cover text interactions (`pointer-events: none`).
- **Gold dust:** tiny glowing particles on dark sections, very subtle.
- **Parallax:** background ornaments move at 0.2–0.5× scroll speed (disabled on reduced motion and on low-power devices).
- **Mandalas:** slow continuous rotation, layered rings rotating in opposite directions.
- **Shimmer:** occasional gold-foil sweep on key headings only.
- Pause all ambient animations when the section is off-screen (IntersectionObserver) and when the tab is hidden.
- `prefers-reduced-motion`: disable petals, parallax, rotation and shimmer; keep simple fades.

---

## 7. Creative interactive extras (make these delightful but tasteful)

### 7.1 Personalised guest invitations
Read an optional `?guest=` query parameter (e.g. `?guest=Sharma%20Family`). If present, show "Dear Sharma Family," on the opening envelope and in the blessings section ("We would be honoured by your presence, Sharma Family"). Sanitise the value (text only, max 40 characters). Without the parameter, everything reads normally.

Also create a tiny hidden helper page at `/#/create-link` (or a simple separate route) where I can type a guest name and get a ready-to-share personalised link + a "Share on WhatsApp" button.

### 7.2 Light a diya for the couple
In the Blessings section: an unlit diya with the line "Tap to light a diya and send your blessings". On tap, the flame ignites with a warm glow that spreads across the section, and a short thank-you line fades in. Remember it in `localStorage` so it stays lit for that guest. (Purely client-side — no backend.)

### 7.3 Tap for a petal shower
Tapping/clicking anywhere on the hero or on the names releases a small burst of petals from that point (throttled, max one burst per 600 ms).

### 7.4 Scroll progress thread
A thin vertical gold thread on the right edge (desktop) or a slim bar at the top (mobile) that fills as the guest scrolls, with a tiny diya at the tip. Clicking section markers jumps smoothly to that section.

### 7.5 Share
A floating action group (bottom-right, out of the way of content) with: Music toggle, and Share (uses `navigator.share` on mobile, otherwise copies the link with a small "Link copied" toast; plus a direct WhatsApp share link).

Keep all extras subtle — none of them should distract from reading the invitation.

---

## 8. Music

- Expect a royalty-free instrumental (soft shehnai / flute) at `/public/audio/wedding-music.mp3`. **You cannot download music**, so: create the path, and if the file is missing, hide the music button silently — the site must work perfectly without it. Add a note in the README on where to get licensed royalty-free music (e.g. Pixabay Music, YouTube Audio Library) and how to compress it (≤ 1.5 MB, 96–128 kbps MP3).
- Never autoplay. Start only after "OPEN WEDDING INVITATION" is tapped, fading volume 0 → 0.5 over 2 s. Loop.
- Floating toggle button with Lucide `Music` / `VolumeX` icons, with an animated equaliser or gently rotating ring while playing. Accessible label and `aria-pressed`.
- Remember mute/unmute in `sessionStorage`. Pause when the tab is hidden; resume when visible if it was playing.
- Handle the play() promise rejection gracefully (iOS Safari).

---

## 9. Responsive & device requirements

Test and design for these widths: 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920.

- Mobile first. No horizontal scroll at any width (check `overflow-x` on every section).
- Use `100dvh` (with `100vh` fallback) for full-screen sections so iOS Safari's toolbar doesn't cut content.
- Respect safe-area insets (notches) for floating buttons.
- Decorations scale down or hide on small screens — they must never overlap text.
- Tap targets ≥ 44 × 44 px.
- Works inside the WhatsApp in-app browser on Android and iOS, Chrome, Safari, Samsung Internet, Firefox, Edge.
- Landscape phones: the opening envelope still fits on screen.

---

## 10. Performance, accessibility & SEO

**Performance budget**
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Initial JS ≤ 180 KB gzipped. Lazy-load sections below the hero.
- No large raster images; ornaments are inline/optimised SVG. Any raster image must be WebP with explicit width/height.
- No layout shift from fonts or animations (CLS < 0.05). Preload the two most important font files.

**Accessibility**
- Semantic HTML (`header`, `main`, `section` with headings, `footer`), one `h1` (the couple's names).
- Visible focus styles in gold. All interactive elements are keyboard-operable.
- Decorative SVGs have `aria-hidden="true"`; meaningful ones have titles.
- `lang="en"` on the page and `lang="sa"`/`lang="hi"` on the Devanagari text.

**SEO & WhatsApp link preview** (very important — this is what guests see first in WhatsApp):
- Title: "DEVEN Weds ADITI | Wedding Invitation"
- Meta description using the hero quote.
- Open Graph + Twitter tags with a **1200 × 630 `og-image.jpg`** that you design: maroon background, gold border, Ganesha motif, "DEVEN Weds ADITI", "10 – 12 December 2026". Generate it from an SVG during the build (or provide the SVG and a script to export it), keep it < 300 KB.
- Favicon and apple-touch-icon: the gold "D ❀ A" monogram.
- `theme-color` meta = maroon.

---

## 11. Acceptance checklist (verify every item in Phase 5 and report results)

- [ ] All text matches Section 3 exactly; no invented details; empty venue fields are hidden.
- [ ] Opening animation is smooth on a mid-range phone, skippable, and replaced by a fade under reduced motion.
- [ ] Music never autoplays, starts after opening, toggle works, missing file doesn't break anything.
- [ ] Countdown is correct in IST, updates every second, handles the post-wedding state.
- [ ] Add-to-Calendar produces correct Google links and valid `.ics` files in Asia/Kolkata time.
- [ ] `?guest=` personalisation works and is sanitised; the link-creator helper works.
- [ ] No horizontal scrolling or overlapping text at any width listed in Section 9.
- [ ] `npm run build` and `npm run lint` pass with zero errors and zero warnings; `tsc --noEmit` passes; no console errors or warnings in the browser.
- [ ] Lighthouse mobile scores meet the budget.
- [ ] WhatsApp preview image and title display correctly (check with an Open Graph preview tool).

---

## 12. Project structure & deliverables

```
src/
  config/wedding.ts
  components/
    intro/        WeddingIntro, InvitationEnvelope, WaxSeal, ScrollUnroll
    hero/         HeroSection, CoupleNames
    events/       EventTimeline, EventCard, AddToCalendar
    countdown/    WeddingCountdown, CountdownBox
    blessings/    BlessingsSection, LightADiya
    ambient/      PetalLayer, GoldDust, ParallaxLayer, RotatingMandala
    ornaments/    Ganesha, JharokhaArch, CornerFiligree, Mandala, Lotus, Paisley,
                  Marigold, Toran, Diya, Divider, HaldiArt, ReceptionArt, BaaratArt
    ui/           GoldButton, MusicToggle, ShareButton, ScrollProgress, Toast
  hooks/          useCountdown, useReducedMotion, useInView, useGuestName, useMusic
  lib/            ics.ts, calendarLinks.ts, sanitize.ts
  styles/         globals.css (tokens, textures, keyframes)
public/
  audio/          (wedding-music.mp3 — added by me)
  images/         (optional ganesha.png — added by me)
  og-image.jpg, favicon.svg, apple-touch-icon.png
README.md
PLAN.md
```

**README.md must include:** how to run locally, how to edit text/venues in `wedding.ts`, how to add the music file and Ganesha image, how to create personalised guest links, and step-by-step deployment to Netlify (drag-and-drop `dist/`) and Vercel, plus how to connect a custom domain.

---

## Final standard

When a guest taps the WhatsApp link, the very first second should make them feel they are holding a precious royal Rajasthani invitation. Traditional yet sophisticated, royal yet restrained, rich in detail but never cluttered, buttery-smooth on a phone, and emotionally memorable. The four things that matter most: **the seal-and-scroll opening, the DEVEN Weds ADITI typography, authentic Rajasthani ornamentation, and the event timeline.**

Begin with Phase 0 now.
