# PLAN — "DEVEN Weds ADITI" Royal Rajasthani Invitation

Phase 0 deliverable. No code has been written yet. Everything below follows `WEDDING_PROMPT.md`; where I made a creative or technical call, it is marked **Decision**.

---

## 1. Concept & visual hierarchy

**Concept: "The Sealed Letter of the Haveli."** The guest receives a maroon velvet envelope sealed in gold wax. Breaking the seal releases an ivory scroll that unrolls into the whole site. After that, the page reads as layered materials: velvet, paper, velvet, paper. Each section is a different "sheet" from the same royal stationery set.

**Hierarchy, in the order the eye should land**

1. **The couple's names**: DEVEN / *Weds* / ADITI. Largest element on every screen where they appear, in gold foil and the only element with a continuous shimmer.
2. **Sacred invocation**: Ganesha motif + `|| श्री गणेशाय नमः ||`. Always above the names, smaller and glowing softly, so the blessing comes first as tradition requires.
3. **Section headings**: Cinzel caps, tracked out, with an ornamental divider beneath.
4. **Event facts**: title → date → time. These need to be scannable in under 2 s on a phone.
5. **Quotes & body**: Cormorant italic, set as quiet supporting text.
6. **Ornament**: frames, corners, toran, mandala. Kept at the edges and never placed behind text at more than 8–10 % opacity.
7. **Functional UI**: music, share, progress thread. Small and peripheral, gold outline on transparent backgrounds.

**Layout rules**
- Content column: max 34 rem for text and 72 rem for the events grid. Side padding is `clamp(1.25rem, 5vw, 3rem)` plus the safe-area insets.
- Ornaments live in a separate absolutely positioned, `aria-hidden` layer inside each section with `overflow: clip`, so they can never cause horizontal scroll or overlap text.
- Below 360 px, corner filigree shrinks to 48 px and the toran drops from 9 flowers to 5. The mandala stays behind content at 6 % opacity.

---

## 2. Colour tokens

Only the seven brief tokens are used. **Decision:** the darker and lighter "foil" stops are *derived* from tokens with `color-mix()` (with a precomputed hex fallback). No new hues are introduced.

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| maroon | `#641B2B` | `maroon` | velvet sections, Reception/Baarat cards, envelope |
| burgundy | `#3D101D` | `burgundy` | deepest bg, vignettes, shadows, body text on paper |
| gold | `#C9A45C` | `gold` | borders, ornaments, headings on dark |
| champagne | `#E8D6A3` | `champagne` | text on maroon, foil highlight |
| ivory | `#FFF8E9` | `ivory` | invitation paper |
| cream | `#F5EBD8` | `cream` | secondary paper, card interiors |
| saffron | `#D88B36` | `saffron` | Haldi accents, diya flames (never text) |

**Derived variables (CSS custom properties)**
- `--gold-deep` = `color-mix(in srgb, gold 55%, burgundy)` ≈ `#8E6A3F`. This is the dark foil stop and gold text on ivory.
- `--foil` = `linear-gradient(100deg, gold-deep 0%, gold 22%, champagne 45%, gold 62%, gold-deep 100%)`.
- `--foil-on-paper`: the same gradient shifted darker (gold-deep → gold → gold-deep), so large gold type on ivory reaches ≥ 3:1.
- `--velvet` = `radial-gradient(ellipse at 50% 35%, maroon, burgundy 85%)` plus a noise overlay.
- `--paper` = ivory with a `feTurbulence` noise overlay at 5 % opacity and a warm cream radial edge burn.

**Contrast checks (WCAG AA)**

| Pair | Ratio | Use allowed |
|---|---|---|
| champagne on maroon | ≈ 8.4 : 1 | all body text on velvet ✅ |
| gold on maroon | ≈ 5.1 : 1 | headings and small text on velvet ✅ |
| burgundy on ivory | ≈ 15 : 1 | body text on paper ✅ |
| maroon on ivory | ≈ 11 : 1 | headings on paper ✅ |
| gold-deep on ivory | ≈ 4.6 : 1 | foil headings/names on paper ✅ |
| gold on ivory | ≈ 2.2 : 1 | ❌ ornaments only, never text |
| saffron on ivory | ≈ 2.5 : 1 | ❌ ornaments only, never text |

---

## 3. Type scale

Self-hosted via `@fontsource`, Latin subsets only, `font-display: swap` with metric-matched fallbacks (`size-adjust`) to keep CLS near 0. **Preloaded:** Cormorant Garamond 500 and Cinzel 500, the two fonts visible on the opening screen. Devanagari is loaded only for the invocation glyphs through `unicode-range`.

| Role | Font | Size (`clamp`) | Weight / tracking | Notes |
|---|---|---|---|---|
| Names (DEVEN / ADITI) | Cormorant Garamond | `clamp(3rem, 13vw, 7rem)` | 500 / `0.18em` | foil + shimmer, `h1` |
| "Weds" | Cormorant Garamond *italic* | `clamp(1.5rem, 5vw, 2.75rem)` | 400 / `0.04em` | flanked by drawn flourishes |
| Section heading | Cinzel | `clamp(1.375rem, 4.5vw, 2.5rem)` | 500 / `0.16em`, uppercase | foil, `h2` |
| Event title | Cinzel Decorative | `clamp(1.125rem, 4vw, 1.625rem)` | 700 / `0.12em` | `h3` |
| Countdown numbers | Cinzel | `clamp(2rem, 9vw, 4rem)` | 500, `tabular-nums` | |
| Invocation | Tiro Devanagari Sanskrit | `clamp(1rem, 3.6vw, 1.375rem)` | 400 / `0.06em` | `lang="sa"` |
| Quote | Cormorant Garamond *italic* | `clamp(1.125rem, 3.8vw, 1.5rem)` | 400, line-height 1.5 | |
| Body / lead | Cormorant Garamond | `clamp(1.0625rem, 3.4vw, 1.3125rem)` | 500, line-height 1.6 | |
| Date / time | Lato | `clamp(0.875rem, 2.8vw, 1rem)` | 700 / `0.14em`, uppercase | |
| Buttons / labels | Lato | `0.8125rem`–`0.9375rem` | 700 / `0.18em`, uppercase | |
| Micro (footer, toast) | Lato | `0.75rem` | 400 / `0.1em` | |

---

## 4. Scroll storyboard (phone, 390 × 844, portrait)

`y` = scroll offset. Sections marked **lazy** are loaded with `React.lazy` once the hero is mounted.

| Scroll pos. | Material | What the guest sees |
|---|---|---|
| **Opening, locked** | velvet | Full `100dvh`, scrolling locked. Faint gold damask/mandala pattern at 7 %, gold dust drifting upward, 4–6 petals falling slowly. Top third: glowing Ganesha (64 px), invocation, "With the blessings of Lord Ganesha". Centre: envelope (≈ 86 vw wide, 3:2) with gold filigree edges and a diamond flap point resting on the **wax seal (D ❀ A)**, which has a soft breathing glow. On the envelope face: "A wedding celebration awaits...", then (if `?guest=`) "Dear Sharma Family,", then **DEVEN / Weds / ADITI**. Below the envelope: **OPEN WEDDING INVITATION** with a pulsing glow and the micro-hint "or tap the seal". |
| *Opening animation* | → paper | See §5. Ends with the scroll filling the screen, which becomes the hero. |
| **y = 0** (Hero) | paper | Marigold toran hangs across the top. Jharokha arch frames the screen, with filigree in the four corners. Behind it, a mandala (≈ 120 vw) rotates once every 120 s with soft rays. Staggered reveal: invocation → "Together with our families," → "We joyfully invite you…" → **DEVEN** letter by letter → *Weds* with flourishes drawing in → **ADITI** → divider → quote. A bobbing diya at the bottom serves as the scroll cue. Tapping anywhere releases a petal burst. The top progress bar appears (2 px gold, diya at the tip). |
| **y ≈ 0.9 vh** | paper → velvet | A deckled paper edge overlaps the maroon velvet below it, like a torn edge on cloth. |
| **y ≈ 1–1.3 vh** (Events, lazy) | velvet | Toran at the top, then the "WEDDING CELEBRATIONS" heading with a divider and the subheading. The gold thread starts at the left gutter (x = 28 px) with the first diya node. |
| **y ≈ 1.3–2 vh** | velvet | **Haldi card** (cream paper, saffron swirls, marigold garland, turmeric-bowl art). The node diya lights as the card enters, and the thread draws down with scroll. Buttons: Add to Calendar (View Location hidden until `mapUrl` exists). |
| **y ≈ 2–2.7 vh** | velvet | **Reception card** (burgundy, gold palace arch, flickering lanterns, glow behind the title). Node 2 lights. |
| **y ≈ 2.7–3.4 vh** | velvet | **Baarat card** (maroon and gold, horse with dhol and shehnai). Node 3 lights and a small petal confetti burst fires once. |
| **y ≈ 3.5–4.3 vh** (Countdown, lazy) | deep velvet | "COUNTING DOWN TO FOREVER". A mandala watermark rotates. Four foil-bordered boxes sit in one row (2×2 below 360 px). Seconds flip; other units change without animation. |
| **y ≈ 4.4–5.5 vh** (Blessings, lazy) | paper | Gold floral border draws itself around the sheet. A glowing diya sits at the top and a mandala at 6 % behind. Below: heading, message, (guest line if present), **DEVEN Weds ADITI**, the **Light a diya** interaction, "With Love & Warm Regards", divider. |
| **Bottom** | burgundy footer | "Made with Love", plus a small "Replay opening" link. |
| **Always** | — | Floating action group, bottom-right and safe-area-aware: Music (hidden if the file is missing), Share (with an expandable WhatsApp option). Top progress bar with tappable section markers. |

**Desktop (≥ 1024 px):** the hero arch is a fixed 4:5 frame centred on the screen with a flanking paisley parallax. Events use an **alternating timeline**: the thread runs down the centre and cards alternate left and right. **Decision:** I chose this over a horizontal timeline so the scroll-linked thread drawing keeps a natural vertical feel. The progress thread moves to the right edge as a vertical bar with three section markers. Up to 25 petals.

**Landscape phone:** the opening switches to a two-column layout, with the invocation and names on the left and the envelope on the right (fit to `85dvh`).

---

## 5. Opening animation timeline

Triggered by the button **or** the seal (both are `<button>`s). A second tap at any time **skips** to the final state (all running animations jump to their end values and the hero mounts). Only `transform`, `opacity` and `clip-path` are animated. Total: **≈ 3.3 s**.

| t (ms) | Duration | Step |
|---|---|---|
| 0 | 150 | Button presses in (scale 0.96) and its glow flashes. The `<audio>` element is created and `play()` is called at volume 0 inside the tap handler, which satisfies iOS's user-gesture rule. |
| 0 | 120 | The seal shakes slightly (rotate ±3°). |
| 120 | 480 | **Seal cracks.** An SVG crack line draws in over 120 ms, then the seal splits into **3 shards** (pre-cut SVG paths). Each shard falls with `y +120–180 px`, `rotate ±25–60°` and opacity → 0, using an ease-in curve. A few gold flecks scatter. |
| 500 | 600 | **Flap lifts.** The envelope flap does `rotateX(0 → -178°)` with `perspective: 1200px` and `transform-origin: top`. The flap's back face (cream lining with filigree) becomes visible after 90°. The names on the envelope fade to 0. |
| 900 | 350 | The envelope body sinks (`y +8 vh`, scale 0.94) and darkens slightly. |
| 1050 | 450 | **Scroll emerges.** The rolled scroll, with both gold-capped rosewood rods together, slides up out of the envelope (`y` from +20 vh to 0). The envelope then fades out. |
| 1500 | 1200 | **Scroll unrolls vertically.** The top rod stays fixed and the bottom rod travels down (`y` 0 → +70 dvh). The paper reveals top-to-bottom with `clip-path: inset(0 0 100% 0 → 0 0 0 0)`, synced to the bottom rod. The rods carry a soft drop shadow, and a thin gradient band just above the bottom rod fakes the paper curl. The paper shows the faint invocation and toran (the hero preview). Easing: `cubic-bezier(.65,.05,.36,1)`. |
| 2500 | 600 | **Celebration burst.** About 18 marigold and rose petals burst from the centre, and a radial gold flare reaches opacity 0.55 → 0 with scale 0.6 → 1.6. |
| 2700 | 600 | **Become the hero.** The rods slide off-screen (top `y -12 vh`, bottom `y +12 vh`). The paper scales from the scroll's width to full-bleed (scale on the X axis, then the real hero crossfades in underneath; a crossfade avoids animating width). Velvet fades out. |
| 3300 | — | The intro unmounts and scroll unlocks. `sessionStorage['dw-opened']=1` is set and focus moves to the hero `h1`. The hero's staggered reveal starts (≈ 2.4 s more). |
| 3300 | 2000 | **Music fades in**, volume 0 → 0.5 over 2 s (rAF ramp; if the file is missing, nothing happens). |

- **Reduced motion:** a 600 ms opacity crossfade from the opening screen to the hero, with no petals or flare. Music still starts (with a fade) because the guest tapped.
- **Return visit in the same session:** the hero renders directly. "Replay opening" in the footer clears the flag and remounts the intro.
- **Performance:** the intro is part of the main chunk. Lower layers are promoted with `will-change` only during the sequence, petals use pooled DOM nodes, and nothing below the hero is mounted until the intro finishes.

---

## 6. Component tree

```
<App>
  <MotionConfig reducedMotion="user"> <LazyMotion features={domAnimation} strict>
    <GuestProvider>  (useGuestName → sanitised ?guest=)
    <MusicProvider>  (useMusic → audio element, availability probe, fade, visibility pause)
      Router (tiny hash switch, no library)
      ├─ #/create-link → <CreateLinkPage>       (lazy chunk)
      └─ default
         ├─ <WeddingIntro>  (if not opened this session)
         │    ├─ <VelvetBackground> + <GoldDust> + <PetalLayer density="low">
         │    ├─ <Ganesha/>  invocation, blessingLine
         │    ├─ <InvitationEnvelope>
         │    │    ├─ envelope body + <CornerFiligree ×4> + flap (3D)
         │    │    ├─ teaser, "Dear {guest},", <CoupleNames variant="envelope">
         │    │    └─ <WaxSeal onBreak/>  (intact | cracking | shards)
         │    ├─ <GoldButton>OPEN WEDDING INVITATION</GoldButton>
         │    └─ <ScrollUnroll>  (rods, paper clip-path, curl band) + <PetalBurst> + flare
         ├─ <header> <ScrollProgress markers=[hero, events, countdown, blessings]/>
         ├─ <main>
         │    ├─ <HeroSection>
         │    │    ├─ <Toran/> <JharokhaArch/> <CornerFiligree ×4/>
         │    │    ├─ <RotatingMandala/> (rays) <ParallaxLayer><Paisley/></ParallaxLayer>
         │    │    ├─ invocation, familiesLine, inviteLine
         │    │    ├─ <CoupleNames variant="hero">  (h1, per-letter reveal, drawn flourishes)
         │    │    ├─ <Divider/> quote
         │    │    ├─ <TapPetals/>  (petal burst on tap, throttled 600 ms)
         │    │    └─ <ScrollCue/> (bobbing Diya)
         │    ├─ <Suspense> <EventTimeline>                      (lazy)
         │    │    ├─ heading + <Divider/> + subheading
         │    │    ├─ <TimelineThread/>  (scroll-linked pathLength, <Diya lit/> nodes)
         │    │    └─ <EventCard skin="haldi|reception|baarat"> ×3
         │    │         ├─ ornamental top (<Toran mini/> | arch + lanterns | horse frieze)
         │    │         ├─ <HaldiArt/> | <ReceptionArt/> | <BaaratArt/>
         │    │         ├─ title, date, time, quote, venue? (hidden if empty)
         │    │         └─ <AddToCalendar/> (Google link + .ics)  <MapButton/>? 
         │    ├─ <Suspense> <WeddingCountdown>                    (lazy)
         │    │    ├─ <RotatingMandala watermark/>
         │    │    ├─ <CountdownBox unit="days|hours|minutes|seconds" animate={unit==='seconds'}/> ×4
         │    │    └─ (after target) "The celebrations have begun" + <PetalLayer shower/>
         │    └─ <Suspense> <BlessingsSection>                    (lazy)
         │         ├─ <FloralBorder draw/>  <Diya glow/>  <Mandala faint/>
         │         ├─ heading, message, guest line?, <CoupleNames variant="compact">
         │         ├─ <LightADiya/>  (localStorage 'dw-diya-lit')
         │         └─ signOff, <Divider/>
         ├─ <footer> "Made with Love" · Replay opening
         └─ <FloatingActions> <MusicToggle/> <ShareButton/> </FloatingActions>  <Toast/>
```

**Hooks:** `useCountdown`, `useReducedMotion` (Framer + a low-power heuristic using `hardwareConcurrency ≤ 4` or `saveData`), `useInView` (IntersectionObserver that also pauses ambient layers), `useGuestName`, `useMusic`, `usePageVisible`.
**Lib:** `ics.ts` (RFC 5545 output with a `VTIMEZONE` for Asia/Kolkata, CRLF line endings, 75-octet folding, `DTSTART;TZID=Asia/Kolkata`, 2 h duration), `calendarLinks.ts` (Google `dates=…/…` in UTC `Z` plus `ctz=Asia/Kolkata`), `sanitize.ts` (NFC normalisation, strips control characters, tags and URLs, allows letters, marks, spaces and `& . , ' -`, trims, ≤ 40 chars), `assetProbe.ts`.

**Technical decisions**
- **Routing:** a ~20-line `hashchange` switch serves `#/create-link`. No router dependency is needed, and it works on any static host with zero config.
- **Missing assets:** the music file is probed with `fetch(HEAD)` and must return 2xx with a `content-type` starting `audio/`. This guards against SPA fallbacks that return HTML. `ganesha.png` is probed with `new Image()`, and on `load` it replaces the SVG.
- **OG image:** `scripts/generate-og.mjs` builds a 1200 × 630 SVG (maroon velvet, foil border, Ganesha, "DEVEN Weds ADITI", "10 – 12 December 2026"), renders it with `@resvg/resvg-js` using fonts decoded from the fontsource woff2 files, and encodes it to JPEG with `sharp` (target < 300 KB). The same script exports `apple-touch-icon.png` (180 px) from the monogram. It runs as `prebuild`, and its outputs are committed so the build also works if native deps are unavailable.
- **Lint:** ESLint flat config (typescript-eslint strict, react-hooks, jsx-a11y) with `--max-warnings 0`.

---

## 7. Hand-drawn SVG assets (`src/components/ornaments/`)

All are React components using `currentColor` or a `--foil` gradient `<defs>` id passed in. They are decorative by default (`aria-hidden`, `focusable="false"`) and accept an optional `title` prop to become meaningful.

| # | Component | Description |
|---|---|---|
| 1 | `Ganesha` | Fine-line temple-engraving Ganesha built from about 12 strokes: crown (mukut), ears as broad leaf curves, trunk curling to his left, single tusk, third-eye tilak, a modak and a small lotus seat, inside a thin halo ring. Stroke-only with a soft glow filter. **Fallback (if the line art isn't refined enough):** `OmMedallion`, an "ॐ" set in a 16-petal lotus medallion. **Auto-replaced** by `/images/ganesha.png` when present. |
| 2 | `JharokhaArch` | Rajasthani scalloped (cusped, 7-lobe) arch with chhatri finial, fluted pillars, lotus capitals and a small hanging bell pair. Scales responsively through `viewBox` and `preserveAspectRatio`. |
| 3 | `CornerFiligree` | Acanthus scroll with paisley tip and dot beading. One path set, mirrored via `scale(-1,1)` / `scale(1,-1)` for the four corners. |
| 4 | `Mandala` | 4 concentric `<g>` rings (lotus petals, bead ring, paisley ring, fine-line star). Each ring is exposed separately so `RotatingMandala` can spin them in alternating directions at 120 s / 180 s / 240 s. |
| 5a | `Lotus` | Seven-petal frontal lotus. |
| 5b | `Paisley` | Buta with inner scrollwork and a dotted outline. |
| 5c | `Marigold` | Layered ruffled bloom (saffron/gold), also used as a petal sprite. |
| 5d | `RosePetal` | Single curled petal (maroon → champagne tint) for the petal layers. |
| 6 | `Toran` | Swagged string of marigolds alternating with mango leaves, plus hanging bead tassels. `count` prop for responsive density. |
| 7 | `Diya` | Clay lamp with incised pattern. The flame has 2 layers (outer saffron, inner champagne) with CSS flicker keyframes (scale/skew), plus `lit` / `unlit` states and a glow halo. |
| 8 | `Divider` | Tapered gold rule with lotus centre motif and bead terminals. Optional `draw` stroke animation. |
| 9 | `WaxSeal` | Irregular blob seal with raised rim, embossed "D ❀ A" monogram (Cinzel-style letters drawn as paths, five-petal flower), specular highlight, and 3 pre-split shard paths for the crack. |
| 10a | `HaldiArt` | Brass urli bowl of turmeric paste with swirl texture, marigolds floating around it, and mango leaves. |
| 10b | `ReceptionArt` | Palace arch silhouette with three hanging lanterns (flame glow flickers) and a string of lights. |
| 10c | `BaaratArt` | Decorated horse in side profile with plumed headdress, embroidered saddle cloth and jhalar tassels, plus a dhol at lower left and a crossed shehnai at lower right. |
| + | `FloralBorder` | Full rectangular vine-and-bud border for the Blessings sheet, drawn with `pathLength` as it enters view. |
| + | `Monogram` | "D ❀ A" in a circle for the favicon, apple-touch-icon and OG image. |
| + | `Damask` | Repeating pattern tile (as an inline SVG `<pattern>`) for the velvet backgrounds. |
| + | `Lantern`, `MangoLeaf` | Small helpers used inside the toran and Reception art. |

---

## 8. Ambient motion system (summary)

- **PetalLayer:** pooled DOM petals with CSS `@keyframes` fall/sway/spin and randomised custom properties for duration, delay and drift. 12 on mobile, 25 on desktop, 0 under reduced motion.
- **GoldDust:** one `<canvas>` per velvet section, capped at 40 particles at 30 fps, paused off-screen or when the tab is hidden.
- **ParallaxLayer:** `useScroll` + `useTransform` at 0.2–0.5×, turned off for reduced motion and low-power devices.
- **Shimmer:** `background-position` sweep on the foil `background-clip:text`, every 7 s, applied to names and section headings only.
- **Global pause:** `[data-ambient="paused"]` on a section sets `animation-play-state: paused` on its children. It is driven by IntersectionObserver and `visibilitychange`.

---

## 9. Phase roadmap

| Phase | Output | Gate |
|---|---|---|
| 1 Foundation | Vite/React/TS strict, Tailwind tokens, fontsource and preloads, `wedding.ts`, textures, layout shell, reduced-motion and low-power hooks, ESLint | build + lint clean, then stop |
| 2 Opening | Envelope, seal, shards, flap, scroll unroll, burst, music start, session memory, skip | build + lint clean, then stop |
| 3 Hero + Events | Arch hero and reveals, timeline thread, 3 skinned cards, calendar (Google + .ics) | build + lint clean, then stop |
| 4 Countdown + Blessings + Extras | Countdown, blessings, light-a-diya, guest personalisation, create-link page, tap petals, progress thread, share/toast | build + lint clean, then stop |
| 5 Polish & QA | OG/favicon generation, SEO meta, lazy-loading and bundle check, a11y pass, 10-width sweep, README, §11 checklist report | final report |

**Awaiting your approval before starting Phase 1.**
