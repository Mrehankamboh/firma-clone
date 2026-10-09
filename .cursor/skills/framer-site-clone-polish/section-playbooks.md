# Section playbooks

Use with [SKILL.md](SKILL.md). Format for every lesson: **Breaks → Probe → Fix**.

When a **new** failure mode shows up on a clone, append a numbered section here
(site + widget). Keep numbers; do not rewrite history.

---

## 1. Header / nav

**Breaks:** Wrong padding; burger too small; logo not optically balanced.

**Probe:** Header height, logo box, burger size, top inset at `y=0`.

**Fix:** Match live padding and hit targets. Header `z-index` above hero, below modals. Do not invent sticky unless live is sticky.

---

## 2. Hero (absolute Framer stage)

**Breaks:** Right-side labels clipped; wordmark overlaps subtitle; positions wrong under 1440px.

**Probe:** Bounding boxes of wordmark, subtitle, watch-reel, hero media vs viewport width.

**Fix — 1440 design stage:**
```html
<section class="hero">
  <div class="hero-stage"><!-- absolute Framer children --></div>
</section>
```
```css
.hero { position: relative; overflow: hidden; }
.hero-stage {
  position: absolute;
  inset: 0;
  width: 1440px;
  height: 100%;
  transform-origin: top left;
  transform: scale(var(--hero-scale, 1));
}
```
```js
document.documentElement.style.setProperty(
  "--hero-scale",
  String(Math.min(1, window.innerWidth / 1440))
);
```

Hero primary CTA: measure live width/height/font (example class of sizes ~390×103, label ~72px — always confirm).

Wordmark: below scaled subtitle with a measured gap. If JS sets `element.style.top` for scroll morph, update that path (inline beats CSS).

---

## 3. Sticky scroll (cards → CTA → footer)

**Breaks:** Footer never covers contact; sticky dies inside `main`.

**Live pattern:** content scrolls; Contact `position: sticky`; Footer is the **next sibling** and paints over Contact.

```html
<main>…</main>
<section id="contact" class="sticky-cta">…</section>
<footer>…</footer>
```

Contact and Footer must share a parent. Contact `z-index: 1`, Footer `z-index: 2` (or as measured). Do not leave Contact as last child of `main` if Footer is outside `main`.

---

## 4. Section CTA bars

**Breaks:** Label flush left, buttons flush right; missing vertical rule; buttons undersized.

**Live:** one centered row — label | divider | buttons. Not `space-between` unless live is split-edge.

```css
.cta-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px; /* probe */
}
.cta-bar .cta-btns {
  position: relative;
  padding-left: 40px;
}
.cta-bar .cta-btns::after {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  border-left: 1px solid #c0c0c0; /* probe */
}
```

---

## 5. Cards / grids / hover overlays

**Breaks:** Radius, gap, overlay, crop, excerpt visibility.

**Probe:** gap, aspect-ratio, overlay opacity, hover transition.

**Fix:** Match live columns/gap. Reveal meta on hover only if live does. Full-bleed overlay when live is edge-to-edge image + text on top.

---

## 6. Multi-column / membership

**Breaks:** Wrong column count; missing assets; dividers off.

**Fix:** Download live images/SVG. Rebuild live column count (often 3). Side-by-side screenshots at section Y.

---

## 7. Toggle / pills

**Breaks:** Active state looks flat — missing Framer track border.

**Probe:** `border`, `box-shadow`, `::before` / `::after` on the track.

**Fix:** Recreate via `::after`, e.g. `1px solid #333336`. Title sizes from live `font-size`.

---

## 8. Dual-layer SVG motifs (pac-style)

**Breaks:** Two shapes instead of one chomping mouth.

**Wrong:** Two images offset ~14px.

**Right:** One parent, `overflow: hidden`, both SVGs at the same `inset: 0`. Opposite rotations toward a shared angle (~0°↔45° and 90°↔45°, ~0.65s). Measure live.

---

## 9. Custom cursor

**Breaks:** System cursor visible; wrong size/color; no shrink on links.

```css
@media (pointer: fine) {
  html, body, a, button { cursor: none; }
}
.cursor {
  position: fixed;
  width: /* probe ~12–20px */;
  height: /* same */;
  border-radius: 50%;
  background: /* live */;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
}
```

Follow `pointermove`. Shrink class on `a` / `button`.

---

## 10. Overflow under 1440

**Breaks:** Horizontal scroll; right chrome cut off; absolute `left` past the viewport.

**Fix:** Hero-stage scale (section 2), or convert to `%` / `right`. Retest 1280, 1366, 1440.

---

## 11. MyOS desktop OS — Music / iPod

From [myos.framer.website](https://myos.framer.website/) at 1440×900. Prefer a **user recording** of Music over guessing the wheel.

### 11.1 Music opens YouTube

**Breaks:** `<a href="youtube">` or `window.open`. User leaves the clone. Live opens **iPod**.

**Probe:** Live Music is a desktop button. Recording: Music → All Songs, never a YouTube tab.

**Fix:**
```html
<button class="icon i-music" data-open="ipod">…</button>
```
Do not use `window.open` / synthetic `#ytJump.click()` for audio — the click **bubbles and closes iPod**.

### 11.2 Click-wheel flow

**Breaks:** Skips iPod; wrong MENU tree; Next does not load.

**Live / recording:**
1. Music → All Songs
2. Select → Loading… (~500ms) → video on LCD under “Now Playing”
3. MENU: video/now/loading → songs → iPod menu (Music, Extras, Settings, Shuffle Songs, Backlight, Now Playing) → home
4. Next/Prev on now or video → Loading… then next song
5. Paused: `||` in bar, `▶` on wheel. Playing: `▶` in bar, `||` on wheel

**Metrics:** body 200×340, pad 15px, radius 20px, screen 170×125, wheel 170×170, hub 60×60. Video below 21px bar (`top: 21px`, ~168×103). Video mode: `opacity: 1; pointer-events: auto`.

### 11.3 No video / no voice (YouTube 153)

**Breaks:** `youtube.com/embed` on localhost HTTP → Error 153, “video unavailable”. Never playerState 1. Same in headed Chrome. `referrerpolicy`, `origin`, nocookie, IFrame API, Invidious/Piped — all failed.

**Why:** YouTube blocks localhost. Live works only on `https://*.framer.website`.

**Fix:** Local files `assets/video/{id}.mp4`. LCD is `<video playsinline>`, not iframe. Select loads file; red YouTube overlay if paused. Play in the **same click** (`muted=false`, `volume=1`). Overlay **outside** `.ipod-ui` (UI is `pointer-events: none` in video mode).

Do not push ripped commercial videos to a **public** GitHub repo unless the user asks.

### 11.4 Overlay click leaves the site

**Breaks:** Red YouTube button opens youtube.com or does nothing.

**Fix:** `<button>` → local `play()`. Hide overlay while playing. Never `window.open` YouTube.

### 11.5 Other MyOS windows

| Section | Break | Fix |
|---------|--------|-----|
| About Me | Too narrow / incomplete | Wide about window; services, cards, favorites |
| Resources | Fake covers, dead links | 16px white covers; real hrefs |
| Cats toggle | Size off | Probe live (this template 163×38) |
| Project thumbs | Wrong crop | Probe (~168px here) |
| Phone | Placeholder | Live number |
| Hello intro | Timing off | Live SVG `pathLength` draw, then dismiss |

### 11.6 QA files in the site folder

**Breaks:** `_probe-*.cjs` / `_qa-*.cjs` sit beside `index.html`. User thinks they are the site.

**Fix:** Hand over only the app (`index.html` + css/js/assets, or Next `app/` + `public/`). Delete probe scripts from that folder.

---

## Verification

1. Live measure → clone measure → diff  
2. Screenshot pair (same scroll / same click)  
3. Fix → re-screenshot  
4. Check neighbors (hero↔next, contact↔footer, iPod click-outside)

Done when 1440×900 matches and 1280 does not clip.

---

## 12. Nuance 2.0 — 3D service fan + sticky works

**Site:** [nuance-portfolio-v2.framer.website](https://nuance-portfolio-v2.framer.website/) (Next.js clone).

### 12.1 Service cards cluster instead of a wall

**Breaks:** Eight cards pile in the middle; the front card is huge and the back cards are tiny. Or a shallow *fan* (`translateX(sin) + small Z`) that never goes edge-on.

**Probe:** Live is a **4-spoke cylinder**, not a per-card fan. `Arm Handle` 1400×240, `transform: perspective(500px) rotateY(t)` (m34 ≈ -0.002), `preserve-3d`. Four `Arm N` at 45° / 90° / 135° / 180°. Each arm holds **two** 400×300 cards at the left/right ends with `rotateY(±90deg)` so they sit on the drum wall (radius 500). Handle spins **~14.4°/s** (~25s/turn). Wrap `#262626`, radius 24px, pad 32px, peach shadow `0 1px 50px #ffdbca`. Body **18px/28.8** Merriweather. Icon wrap 26×26 with **four** corner brackets. Section overflow **visible**. No per-card opacity fade.

**Fix:** Don’t animate each card’s `translateX/Z`. Spin the handle; spokes + opposite cards do the 3D. `animation: 25s linear infinite` of `perspective(500px) rotateY(360deg)`. Pin the handle with `position: absolute; left: 50%; margin-left: -700px` inside a full-bleed stage (`100vw` + `margin-left: calc(50% - 50vw)`). Do **not** `margin: auto` on the spinning handle — its transformed bbox drifts and the ring leaves center.

### 12.2 Selected Works sticky stack + back-card scale

**Breaks:** Cards sit in a column with no overlap, or sticky never engages. Live shows later cards sliding over earlier ones, with previous cards shrinking and peeking as a rounded cap.

**Probe (1440×900):** `Works` 1440×3960. Heading ~180px then `Sticky` ~3780. Each wrapper **1440×900, `position: sticky; top: 0; z-index: 1`**. Inner white card **1000×630**, pad 24, radius 24, copy column 357 / media 571. Per-slot tint **1440×800** (FlowPay `rgb(238,240,255)`, MunchRun `rgb(255,237,230)`, PulseHR `rgb(230,230,230)`, Roamly `rgb(238,255,235)`). Back cards scale down as later wrappers cover: after 3 stacked ~**889×560 (~0.89)**; transform often lives on a parent (inner `a` transform may be `none`). `html/body { overflow-x: hidden }` **kills sticky** (it forces a body scrollport). Use `overflow-x: clip`.

**Fix:** Sticky the **900px slot**, not the inner card. `top: 0` (not 96px). Pin **one** 900px tint (`position: sticky; top: 0; margin-bottom: -900px; z-index: 0`) and **crossfade `background-color`** when a card’s slot hits `top <= 200` (card has arrived; color does not travel). Do **not** give each card its own sliding tint. Cards stay `z-index: 1+` with transparent slots. Scale from *all* later slots: fully stuck `+0.05`, incoming `+(1-y/900)*0.011`, plus `translateY((s-1)*200)` origin 50% 0. `html/body { overflow-x: clip }` — `hidden` kills sticky. Mobile: `position: relative`; no scale.

### 12.3 Expertise black cards — gradient ring hover

**Breaks:** Dark tool cards are flat grey tiles with a colored badge. Live cards are **384×232** with a **2px orange→gold gradient ring** that appears on hover and shifts with the pointer. Heading is 48/57.6 two-line; logos are **90×90** circles.

**Probe:** `Skills` 1440×731, `bg rgb(20,20,20)`, wrap pad 64. Cards `rgb(15,17,18)` outer radius 16, inner `rgb(38,38,38)` 380×228 radius 14 pad 24. Icon 44×44 radius 32. Gradient layer **687×484** centered, `linear-gradient(180deg, rgb(255,141,74) 12%, rgb(178,173,161) 51%, rgb(244,191,0) 87%)`, opacity 0→1 on hover, clipped by `overflow: hidden` so only the ring shows.

**Fix:** Outer card + inset inner panel. Huge gradient behind, opacity on hover. Track pointer with extra `translate` on the glow. Do not use a colored badge behind a mono icon — the SVG *is* the 44×44 mark.

### 12.4 Bento grid — 6×4 slots, not a 3-col auto grid

**Breaks:** Photo + cards in a 3-column `auto` grid with 16px gap. Live is a **1200×700** board: **6 columns × 190px**, **4 rows × 166px**, **12px gap**, wrap pad **120×64**, section **1440×940**. Photo **392×522** (2×3). Design Thinking / Craftsmanship / Collab / Shipped **392×166**. Experience **392×344** (2×2). Languages **392×166**. Process **796×166**.

**Probe:** Cards `rgb(250,249,245)` radius 24. Craftsmanship hover: salmon wrap `rgb(255,182,144)` → `rgb(255,237,230)`, 172px pastel blobs over the top, black pointer follows the mouse. Experience hover: 364×364 orange radial `opacity 0.42`. Hobbies are a **99px-pitch marquee**, not a 3-icon swap. Olivia/John **float** over the collab copy. Languages use **8px orange bars** (100/80/50/45). Process is a **5-dot stepper** that fills left-to-right, not pills.

**Fix:** CSS grid with explicit 190/166 tracks. Do not stack Languages under the photo in a 3-col auto grid. Keep card hover as glow/pointer/count-up — not scale.

### 12.5 Bento circled cards — wreath mask, cream face, looping counts

**Breaks:** Craftsmanship fills peach on hover; 4+ uses cartoon ellipses; Olivia/John sit still or clip; 90+ flashes `0+`. Live video shows cream Craftsmanship with a **top blob wash + cursor**, gold **masked wreaths**, drifting name pills, and **count-up that holds at 4 / 90**.

**Probe:** Craft inner article is cream `rgb(250,249,245)` (wrap peach is behind, same box). Blobs `z-index: 1` **after** the article in DOM so they overlay the top. Experience wreaths are **44×106** gold `rgb(237,153,0)` with an **SVG path mask**, not DOM SVG. Glow rest opacity **0.42**. Olivia cursor `rotate(60deg)`. Counts restart after a hold (years ~1.1s + 3.2s pause).

**Fix:** Keep the cream face; move blobs/cursor with the pointer. Use the live wreath path as a 44×106 SVG. CSS-wander Olivia/John inside the collab clip. Start counters when the bento intersects; ease-out; never paint `0`. The section is **transparent cream** with a **1440×940 Wave Gradient shader** at `z-index: 0` (same as hero) — do not fake the orange/lavender with CSS radials on `.bento-wrap`.

---

## 13. Nuance 2.0 — scroll-linked artboard (doodle card)

**Site:** [nuance-portfolio-v2.framer.website](https://nuance-portfolio-v2.framer.website/) hero Artboard.

**Breaks:** White dotted card sits at a static `rotateX`; live **tilts in** then **flattens as you scroll**. Hover does not drive it.

**Probe:** Named `Artboard` at 1440×900. Intro (~1s delay): `perspective(1200px) scale(0.9) rotateX(20deg)` (bbox ~986×524). Rest: `perspective(1200px) scale(1) rotateX(6deg)` (bbox ~997×594, origin 500×307.5). By `scrollY≈280` identity + `perspective(1200px)` (1000×615). Computed `matrix3d` includes perspective on the **element**, not the parent. `scale(0.9)` is 2D (X/Y only) — order is `perspective() scale() rotateX()`, not `rotateX() scale()`.

**Fix:**
```css
.artboard {
  transform: perspective(1200px) scale(0.9) rotateX(20deg);
  transform-origin: 50% 50%;
  animation: artboard-in 0.65s 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes artboard-in {
  to { transform: perspective(1200px) scale(0.9699) rotateX(6.02deg); }
}
```
**Fix:** CSS intro `20° / 0.9 → 6.02° / 0.97`. On scroll, **only** linear flatten (`rotateX` 6.02°→0, `scale` 0.97→1 over 0–185px). Do **not** add extra `translateY` — live `ty` is 0; extra lift pulls the board off the hero bottom. Rest bbox ~489px from top, ~25–46px above the 1129 hero bottom. “Doodle here” gets the same 3D flatten, not a Y parallax. Hero fill is Wave Gradient WebGL.

---

## 14. Nuance 2.0 — ticker chips (heading banner)

**Breaks:** Pills look small and sit tight under the hero. Live chips **fill the 90px ticker** and sit a beat below the hero card.

**Probe:** `[data-framer-name="Web"]` is 90×~268. Font 28px/33.6. Dot named `dot` is **12×12** `#e32e25`. Padding `24px 24px 20px`, gap 16px, radius 93px. Glow is **inset** `0 0 12px rgb(255, 219, 202)` — not an outer ring. Ticker `h: 90` at y=1193 (hero 1129).

**Fix:** Chip `height: 90px; font-size: 28px; gap: 16px`. Dot 12px. Inset peach glow. Track `gap: 20px`. Ticker `margin-top: 64px` (live hero-bottom → ticker). Mask `0% transparent → 14.68% solid → 85.23% solid → 100% 0.07`. Marquee **~15px/s** (`120s` on two copies, `translateX(-50%)`) — 28s is ~6× too fast. Duplicate the chip row **twice**, not three times.

---

## 15. Nuance 2.0 — Testimonials globe (conic CTA wash + flag pulse)

**Site:** [nuance-portfolio-v2.framer.website](https://nuance-portfolio-v2.framer.website/) Testimonials.

**Breaks:** Static peach ellipse; flags bob with `translateY`; four quote cards sit in a grid. Live is a **1200×540 / radius 576** pill whose fill is a **rotating cream→peach conic**, flags **scale+fade**, and quotes **marquee**.

**Probe:** Section 1440×1010, wrap pad 64. Content wrap 1200×800. Globe pill 1200×540 `overflow: clip`. Color is **not** a CSS radial on the pill — a **~2779×2522** layer centered on the pill: `conic-gradient(rgb(250, 249, 245) 0deg, rgb(255, 182, 144) 360deg)` rotating ~28s. Flags 44×44 at Australia 577/73, USA 125/139, Russia 1030/139, China 147/392, India 970/370. Each `Flags` wrapper loops **scale 1→1.1, opacity 1→0.2** (~2.7s). Quotes: 282×236, pad 20, gap 24, radius 20, bg `rgb(244, 243, 238)`, flex track `translateX` ~31px/s. Do not use a 4-column grid.

**Fix:** Clip the conic inside the pill (`translate: -50% -50%` + `transform: rotate()` on the conic only). Pulse the flag wrapper, not a Y-float. Duplicate the four quotes and marquee `translateX(-50%)`. Offset the track (~140px) so a card is always clipped on the left like live.

---

## 16. Nuance 2.0 — FAQ heading wrap + accordion tray

**Breaks:** Title wraps as `Frequently Asked / Questions`. Accordion is a 4:5 grid with white 16px questions. Live is **Frequently / Asked Questions**, 365px column, 17px Inter rows.

**Probe:** FAQ Section 1440×516. Wrap 1200 pad 64. Inner row 1072 gap **64**. Left Content **365×189** at x=184, y=list+64. H2 PP Editorial **48/57.6** `#1a1c1c` with an explicit break after Frequently (365px also fits “Frequently Asked”). Lead 18/28.8 Merriweather 365×58. Tray **643×388** pad 8 gap 8 radius 22 `rgb(244,241,235)`. Rows **627×68** pad 20 radius 16 `rgb(251,249,247)`. Question Inter **17/27.2**. Plus is an **8×8** round-cap stroke `rgb(166,160,155)` in a 28px circle; open = dark fill + 45° X. Answer Inter **15/23.25** `rgb(87,83,77)`.

**Fix:** Force `<br>` after Frequently. Do not rely on width wrap. Copy `padding-top: 64px` so the heading sits 64px below the tray top. Match tray/row numbers; plus is SVG not a text `+`.

---

## 17. Nuance 2.0 — Contact Name/Email form card

**Breaks:** Form sits on cream page with weak peach radials; Submit 48px; copy 40px. Video/live shows white form on a **white→peach** ARTICLE over **black**.

**Probe / video:** Form section pad 64 over Footer `rgb(18,18,18)`. Contact ARTICLE **1200×672** pad **96** radius **52**, `linear-gradient(white → rgb(255,219,202))`, gold layered shadow `rgba(255,201,84,…)`. Absolute Bg canvas (soft peach wash). Inner row **1000** gap **64**. Form **488×480** pad/gap 20 radius 20, cream fields **448×40** radius 12, Submit **448×40**. Copy **448** gap 12: H3 PP Editorial **38/53.2**, body Inter **18/27** `rgb(69,71,71)`. Email placeholder typo `offical`.

**Fix:** Dark band behind the peach card. Match gradient + gold shadow (not random radials). Row gap 64. Keep field box cream separate from the input.

### 17.1 Cream↔black split behind Contact (Name “halfway above” dark)

**Breaks:** Solid black behind the whole peach card. Live shows cream above / black below with the Name form mid on the seam.

**Probe:** Form section **800×1440**, pad **64**. Absolute Bg: named `top` **400px** `rgb(250,249,245)` + named `bottom` **400px** transparent (Footer black shows through). Peach top = band+64; form top = peach+96. Cream|black at band+400 → **formPctAboveDark = 50**, **peachPctAboveDark = 50**.

**Fix:** `.contact-band { height: 800px; padding: 64px; background: rgb(18,18,18) }` with absolute split: `.contact-band-top { height: 400px; background: rgb(250,249,245) }` + transparent bottom. Do **not** pull the form above the peach top — live keeps form **96px inside** peach; “halfway” means halfway above the **dark half**, not above the peach card.

---

## 18. Nuance 2.0 — Footer typewriter + seal spin

**Breaks:** Footer shorter (pad 80/64/40), headline 64px, slow 18s seal, Unicode `↗`, wrong cycle colors/words.

**Probe (1440):** Desktop FOOTER **1440×503**, pad **96px 40px**, bg `rgb(18,18,18)`. Inner **1200**, column gap **128**. Heading row gap **36** (text **1015** + seal **149**). Type **PP Editorial 60/78**, letter-spacing **-0.04em**: “Let’s” white; cycle word `rgb(234,108,21)`; rest `rgb(130,130,130)`. Typewriter words **Shape → Design → Elevate**; caret `|` `rgb(255,140,75)` with `twBlink 1s steps(1)`. Seal **Cirle Text** rotates ~**4.56s**/turn; textPath `* I AM AVAILABLE * FOR WORK`, Uncut Sans 12px, letter-spacing **0.42em**; envelope **32×23**. Links Inter **18/27** `rgb(171,171,171)`, gap **6** + **24×24** arrow icon (default/hover clip swap); nav cluster gap **32**.

**Fix:** Match pad/gap/type. Separate cycle word + blinking cursor (do not use `|` as empty placeholder). Spin the seal wrapper at **4.56s linear**, not 18s. Arrow icons instead of `↗` characters.

### 18.1 Name card scrolls up → footer reveals underneath

**Breaks:** Contact and footer are sequential siblings; footer never sits under the peach card while scrolling.

**Probe:** Outer Footer **1303px**. Child Form section **800px**, `z-index: 2`, `position: relative`. Sibling pin `.framer-*-container` **503px**, `position: sticky; bottom: 0; z-index: 1` wrapping Desktop footer. While scrolling, peach Y decreases; desk stays pinned at viewport bottom (~397); `deskUnderPeach` true until peach clears.

**Fix:** Wrap Contact + Footer in `.footer-shell`. Pin footer: `.footer-pin { position: sticky; bottom: 0; z-index: 1 }`. Keep `.contact-band { z-index: 2 }`. Do not raise `.site-footer` above the pin. Preserve existing cream/black split, typewriter, and seal spin.

---

## 19. Nuance 2.0 — Navbar pill

**Breaks:** Soft translucent pill, gap 4, radius 99, grayscale avatar, flat CTA, white border on green dot.

**Probe (1440):** `navbar` fixed h **82**, pad **24px 16px 0**, z **4**. Desktop pill **538×58**, pad **8**, gap **24**, radius **29**, white, shadow `rgba(97,91,83,0.08)…`. Avatar **40** color (no grayscale). Green status: cream ring **8** + core **6** `rgb(49,197,60)`. Menus **300** = three **100×42** links, Inter **18/18 w500**; active `rgb(196,86,0)`. CTA **134×42**, gap **8**, gradient `rgb(64,64,62)→rgb(38,38,38)`, cream **16** mail icon.

**Fix:** Match pad/gap/radius/shadow. Group links in `.nav-menus`. CTA uses gradient + cream icon fill. Dot is ring+core, not a bordered circle.

### 19.1 Navbar hide on scroll-down / show on scroll-up

**Breaks:** Pill stays fixed while scrolling; live slides away.

**Probe:** Wrapper under navbar uses `will-change: transform; translateY(0 ↔ -90px)`. Scroll **down** → hide (`ty ≈ -90`, pillY ≈ -66). Scroll **up** → show (`ty → 0`, pillY 24). Always show near top (`scrollY < ~12`).

**Fix:** `.nav-motion` with `transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)`. On scroll: `dy > 4` → `translateY(-90px)` + `.is-hidden`; `dy < -4` → `translateY(0)`. Drive via ref/DOM (not only React state) so it keeps up with scroll.

---

## 20. Nuance 2.0 — Site-wide Lenis smooth scroll

**Breaks:** Native wheel jumps; `scroll-behavior: smooth` only helps hash/programmatic scroll. Live feels buttery on every wheel tick.

**Probe:** Live `html` gets classes `lenis lenis-scrolling lenis-smooth` (Lenis CSS present). A synthetic `wheel` deltaY 400 eases ~299→376→390→398→400 over ~1.2s (not an instant jump). Framer bundle defaults `wheelMultiplier` / `touchMultiplier` to 1.

**Fix:** Install `lenis`. Wrap the app in `ReactLenis root` with `lerp: 0.09`, `duration: 1.15`, `smoothWheel: true`, multipliers 1. Import `lenis/dist/lenis.css`. Keep native scroll listeners (nav hide, works pin, hero tilt) — root Lenis still updates `window.scrollY`.

---

## 21. Nuance 2.0 — Portfolio “More Case Studies” CTA

**Breaks:** CTA missing or buried under the sticky works stack; text arrow `→` instead of live ↗ icon.

**Probe:** After last sticky card, 180px foot. Link **213×50**, pad **12×24**, gap **4**, radius **32**, bg `rgb(26,28,28)`. Label Merriweather Sans **16/600** white “More Case Studies”. Icon **20×20** northeast arrow (two stroked paths). Sticky slots use `z-index: 1+` and can paint over a plain foot.

**Fix:** `.works-foot { position: relative; z-index: 6 }`. Button matches live metrics; SVG ↗ not a text arrow. Keep foot background transparent so the last project tint shows through.

---

## 22. Nuance 2.0 — Hero lines load entrance (blur + rise)

**Breaks:** Static hero copy, whole-line fade, opacity-only sub/sticker, or guessed delays that feel “close but off.”

**Probe (Framer bundle + live):** Scrape `effect:du` / `mu` / sticker `Hc→Vc` from the site `.mjs` — do not guess.

| Layer | Framer config |
|-------|----------------|
| **I** + **Products** (`du`) | `blur(10px)`, `y:20`, `opacity:.001`; `tokenization:line` (chars sync); `delay:.05`, `duration:.6`, `ease:[.44,0,.56,1]` tween; `onInView` |
| **Design** sticker (`Hc→Vc`) | Initial `opacity:.001`, `y:-13` → rest `y:0`; spring `bounce:.2`, `duration:.4`, `delay:0` |
| **Sub** (`mu`/`fu`/`pu`) | Per-word `y:10` + opacity (no blur); `startDelay:.5`; stagger `delay:.075`; spring `bounce:0`, `duration:.4`; `onMount` |

**Fix:** Match those numbers in CSS/JS. Clear sticker entrance animation after it ends so `.is-swap` rotate/scale still works. Trigger enter after client mount (SSR otherwise finishes CSS anim early).

---

## 23. Nuance 2.0 — Design/Build/Ship sticker vertical pad

**Breaks:** Word looks top-heavy or bottom-heavy inside the cycling sticker; top/bottom gaps jump vs live.

**Probe:** Live `[data-framer-name=Content]` inside Design/Build/Ship: **`padding: 12px 16px 0`**, `height: 84px`, flex center, h1 `60/72`. Caps get top air; descenders sit on the bottom edge. Clone `8px 16px 4px` inverts that balance.

**Fix:** Sticker `padding: 12px 16px 0`; keep `height: 84` + h1 `line-height/height: 72`. Do not “equalize” top/bottom — live is intentionally asymmetric.

---

## 24. Nuance 2.0 — Artboard toolbar tools (draw / text / fill / color)

**Breaks:** Pencil strokes miss the cursor under `rotateX`; Text uses `prompt()`; bucket draws a fake rect; color only cycles 5 swatches.

**Probe (live):** Tools are Select → Draw → Eraser | Shape → Text → **Fill** → Color | Undo → Redo → Clear. Text opens an inline `input` (`placeholder: Type here...`). Color toggles a 12-swatch palette (`#EA602C`…`#F09F39`). Fill is flood-fill (tolerance ~32). Draw uses strokeWidth 3.

**Fix:** Map pointer with `offsetX/Y` (not AABB) under 3D artboard. Text → absolute input commit on Enter/blur. Fill → canvas flood fill. Color → palette popup with live swatches. Do not regress artboard tilt/scroll.

---

## 25. Nuance 2.0 — Artboard tools from screen recording

**Breaks:** Shape tool drops a sticky note; no shape submenu; no blue dashed selection; pencil has default crosshair.

**Probe (`Screen Recording 2026-09-23 162117` / `20260923-1120-…`):** Live opens a **7-shape strip** under the toolbar (rounded rect, square, circle, hexagon, star, arrow, pill). Drag draws the outline. Strokes/shapes get a **blue dashed** selection box. Draw uses a **pencil cursor**. Text shows `Type here…`. Color opens the 12-swatch strip.

**Fix:** Object-layer doodle (`DoodleBoard`): path/shape/text objs + select/drag, shape submenu, selection overlay, tool cursors. Keep scroll/tilt artboard untouched.

---

## 26. Forge of Traders — sign-in card

**Breaks:** LOGIN stays on the marketing page. Auth card is a few pixels short, so the gold button sits high.

**Probe:** Live app is `https://app.forgeoftraders.com/sign-in` at 1440×900. Card is centered (`450×579`, `rgb(54, 32, 5)`), not a right-hand panel. Empty `.invalid-feedback` nodes under each field add ~4.8px.

**Fix:** Serve `/sign-in` as its own HTML page. In the homepage click trap, `return null` for `/sign-in` before `preventDefault`. Keep the empty feedback nodes so the card height matches. Password visibility is one 18px Material `eye-off-outline` / `eye-outline` glyph. `display: block` on the svg overrides the `hidden` attribute, so hide with `svg[hidden] { display: none }`.

---

## 27. Forge of Traders — register card

**Breaks:** REGISTER stays on the marketing page. The sign-up card is the login card with three fields, not a new layout.

**Probe:** `https://app.forgeoftraders.com/sign-up` at 1440×900. Card `450×619`. Fields: First name, Last name, Email. Button text is `Next` (CSS uppercases it). Empty submit: red `rgb(230, 69, 66)` border and `rgb(255, 13, 0)` 12.75px messages.

**Fix:** Serve `/sign-up` with the same auth CSS. Allow `/sign-up` through the homepage click trap the same way as `/sign-in`. Empty `.invalid-feedback` stays 4.8px; put the live message in it only after Next.

---

## 28. Forge of Traders — dashboard shell

**Breaks:** Logged-in dashboard is a fixed 260px menu plus a padded page, not a centered auth card.

**Probe:** `https://app.forgeoftraders.com/dashboard` at 1440×900 while signed in. Menu `rgb(18, 22, 24)`. Page `rgb(12, 16, 17)`. Active item is a 236×42 gold pill. Challenge banner is an inline PNG, 1125×200, not a CSS background.

**Fix:** Save the banner `img.src` data URLs out of the logged-in DOM. Serve `/dashboard` with the same menu, navbar avatar, feed, and affiliate banner. Allow `/dashboard` through the homepage click trap. Sidebar items must use the live paths (`/checkout`, `/my-challenges`, `/competitions`, `/advanced-chart`, `/certificates`, `/achievements`, `/profile`, `/security`, `/billing`, `/affiliate-suite`). External traders (MT, DXTrade, Forge Web, Android) stay on their real URLs. A made-up local path 404s.

---

## 29. Forge of Traders — support chat is a saved YourGPT shell

**Breaks:** Logged-in pages show a ForgeBot panel that does not answer. The marketing footer button is a different entry, and a custom dashboard has no bubble at all.

**Probe:** Live marketing chat is YourGPT widget `c8844fe4-0c66-413c-9fa0-8029c7ca35d2` from `https://widget.yourgpt.ai/script.js`, opened by `#chat-launcher` in `forge-runtime-*.js`. A saved app DOM keeps `div#yourgpt_root` and `chatbot.css` after the script tag is stripped, so the panel is inert. Live and the working clone both reply “Please provide the following details: Name”.

**Fix:** Delete the frozen `#yourgpt_root` and the `chatbot.css` link. Load the same widget id with `public/support-chat.js` on the dashboard and saved app pages. Leave the marketing click-to-open runtime alone.

---

## 30. Forge of Traders — New Challenge Next does not record the account

**Breaks:** Selecting an evaluation and pressing Next leaves My Dashboards empty. The saved checkout form is `action="#"` and a capture `submit` listener only cancels the post.

**Probe:** Checkout step is Select Evaluation Type, account size, platform, then Next. Live would continue Forge checkout. This clone must not post payment to Forge. The signed-in user is only known after login sets an httpOnly `fot_session` cookie.

**Fix:** On Next, read the checked challenge, size, and platform and `POST /api/challenges`. Store `user_id`, evaluation, size, platform, and status `active`. Stop the submit before Forge’s checkout script. My Dashboards and the overview feed then list that row for the session user.

---

## 31. Forge of Traders — Forgot Password 404

**Breaks:** Sign-in “Forgot Password?” goes to `/forgot-password` and the clone returns 404. The homepage click trap also swallows that path.

**Probe:** Live `https://app.forgeoftraders.com/forgot-password` is the same auth card. Heading “Forgot Password?”, email field, button “Send Password Reset”, link “Back to login”.

**Fix:** Serve that card. On submit, email a one-hour reset link and set `password_hash` to null so the old password stops working. `/reset-password?token=` saves the new password. Allow both paths through the homepage trap. `form { display: grid }` beats the `hidden` attribute, so hide the form with `form[hidden] { display: none }`.

---

## 32. Forge of Traders — admin price edits stay on the frozen checkout

**Breaks:** Challenge prices live in checkout HTML `data-balances`, and the live checkout script replaces `#checkout-card` from Forge. An admin edit in the database never reaches the fee that gets saved.

**Probe:** Change one account-size price in `/admin/pricing`, open `/checkout`, and read `#original-price` plus the fee stored by `POST /api/challenges`.

**Fix:** Keep prices in `challenge_prices`. Checkout `apply-prices.js` rewrites `data-balances` and the total after the Forge card refresh. The save API uses the database price, so the recorded fee matches the edit. The homepage calculator does not read that table: it uses frozen `retail_price` inside `__FORGE_PROGRAMS__`. `site-prices.js` copies the saved price onto the matching plan, sets `window.__FORGE_ADMIN_PRICES__`, and re-clicks the active program. The calculator must treat that flag as a zero promo. Setting `__FORGE_PROMO_PERCENT__` to `0` does not work, because `Number(0) || 50` still applies START50 and the big number stays half the admin price. Hide `.announcement`, `.promo-note`, `.regular-price`, `.discount-context`, and `.sticky-offer-label` so the headline fee is the saved price and the START50 bar is not left on screen. The homepage opens on TWO Phase $10k, so a ONE Phase $5k edit is visible only after that program and size are selected.

---

## 33. CK Capital — fixed promo, bottom image ticker, entry modal

**Breaks:** The homepage looks short because a fixed cream promo bar covers the top and a fixed gold image ticker covers the footer. The first paint is a centered win-$100k modal, so hero screenshots miss the candlestick and headline. Certificate and review marquees jump if the track is not duplicated to exactly 50%.

**Probe:** At 1440×900, close the modal, then measure `scrollWidth` vs `clientWidth`, hero `h1` box, and the ticker `translateX(-50%)` loop. Check 390px: desktop nav hides and the burger drawer opens.

**Fix:** Pad the body by the promo height and ticker height. Trading Objectives is a custom HTML widget, not Elementor cards: centered 150px tabs with a yellow active fill, preference and platform on two centered rows, challenge sizes in one left-aligned row, and a chip table (white teal labels, gray value cells, 10px spacing). The $10k chip carries the “$39-limited only” badge. Hero candles stay a hero `::before` at `right top / 40% auto` on desktop. Do not pin them to the headline: the PNG’s opaque pixels are in the lower half, and top-right is what puts that cluster on the right of the title, matching live. Custom CSS (not the Elementor post file) changes it: `max-width: 1024px` is `52% auto` and `margin-top: -40px`; `max-width: 767px` moves position to `bottom left`; `max-width: 480px` is `250% auto` with the margin cleared. Duplicate marquee children once and animate `-50%`. Step cards lift `translateY(-20px)` on hover. Pricing numbers are not the HTML defaults: the live script overwrites them (for example $5k shows `$19.20` with `$64` struck). Keep the bottom ticker as the three promo PNGs, not rebuilt text chips.

---

## 34. CK Capital — Watch on YouTube carousel

**Breaks:** The center podcast card looks too big, the photo sits tight against the copy, and under 1024px the photo jumps above the text.

**Probe:** `.owl-carousel .slide-item` is 620×400, padding 40, radius 15, `#2e2e2e`, `transform: scale(0.9)` on every card including the active one. Only `.active.center .slide-item` changes opacity to 1. `getBoundingClientRect` is 558×360 because of that scale. Copy column `padding-right: 80px`. Photo `max-height: 300px`. Owl item step is about 662px (visual gap ~104px). At `max-width: 1024px` the card is a column, height 550, text centered, image under the copy.

**Fix:** Keep `scale(0.9)` on `.slide-item.is-center`. Center the track with `offsetWidth` (layout size), not the scaled `getBoundingClientRect`. At 1024px stack text then image. Owl `smartSpeed` is 250ms `ease` on the stage; card opacity stays 500ms `ease-in-out`. Loop by repeating the slides and jumping back one set with the transition off, so Next never rewinds the whole track. Support buttons stay one row at 300px (gap 30, radius 10, border `#757575`); the “CK Capital has been” paragraph is 798px wide so it wraps into two near-equal lines (782 / 759). Let’s Win Together is a 502px band, gradient `152deg #1d1d1d → #4b4b4b`, flags `::before` at `right top / 35%` (40% under 1024). The payment footer is one 450px row on `#1d1d1d`: logo plus “Payment Options” on the left (63.6%), social icons 51px on the right, legal links centered under it in `rgba(153,153,153,.6)`. Nav dropdowns (Evaluations, More) have no background; pin the list with `left: 0` and `width: max-content` so each heading starts on the same left edge as its parent. Centering a fixed-width list (`left: 50%` + `translateX(-50%)`) slides the text out from under the label. Hero stat icons are the live SVGs at 50×50, with 10px under the icon and a 30px gap between boxes. A redrawn 40px stand-in changes the bar, coin, and pie shapes. Log In and Sign Up stay on local `signin.html` / `signup.html` (same dark card, gold left graphic, and right-hand copy). Do not point those buttons at `app.ckcapital.co.uk`. Affiliate, FAQ, and About stay on `affiliate.html`, `faq.html`, and `about.html`. The support “Comprehensive Online FAQ” card uses `faq.html`. Do not send those links to `intercom.help` or `ckcapital.co.uk/about`. About uses the marketing header, gold title band, payment footer, disclaimer, and ticker. FAQ and Affiliate use the help-center gold bar (`ckcapitaluk_` on the right), collection cards, and the gray help footer (“CK Capital Help Center”, “Us vs US”, socials).

---

## 35. CK Capital — user portal

**Breaks:** Log In on the marketing site opens `app.ckcapital.co.uk`. The signed-in app is a separate dark shell, not another marketing page.

**Probe:** Body `#333`, header band `#222`, nav pill 72px radius 50 on `#333`. Active item is `#ffff95`, radius 20, Noto Sans 16/500. Dropdown is 188px, radius 20, shadow `0 0 24px rgba(23,23,23,.6)`, gold row on hover. Plan cards are 600px `#222`, 1px `#404040`, radius 20. Essential badge and Buy Now use the gold gradient `245deg`. Standard 5K rules: phase 1 is 10% of size, phase 2 is 5%, daily loss 4%, max loss 8%.

**Fix:** Keep the portal on `portal.html`. Sign In and Sign Up stay local and then open that page. Sign Up also shows the reCAPTCHA checkbox between Password and the gold button, and Country is a dropdown. The checkbox stays on this site and does not call Google or CK Capital. The card logo is hidden above 980px and shown in the card when the right panel is hidden. Sign-up writes the person into Neon `users` and signs them in. Sign-in rejects an email that is not in that table. Forgot password only continues for a registered email, stores a hashed reset token, and saves the new password hash in Neon. A new sign-up also sends a welcome email to that address through this site’s Gmail mailer. The password is not included. Sign-up is refused when any field is empty, including nick name, country code, contact number, country, city, and the robot box. A paid challenge is loaded from Neon `orders` and shown on the Dashboard, Contract List, and Payment History for that signed-in account. Profile country uses the same country list as sign-up, with the saved country selected. The profile password form checks the current password and stores the new one as a hash. Paying for a challenge writes `orders` with the buyer, plan, size, platform, and price. The window and the gold background stay fixed. Only the sign-up card scrolls, and the 5px yellow bar (`#ffec43`) sits on the card’s right edge, not in the gap beside the right panel. The contact code is a typed field. Country is a typed field that also opens the name list and filters it. The “I’m not a robot” box stays after Password. Buy Now, payouts, KYC, and profile forms never post to the live app. FAQ inside the portal uses `faq.html`. Plan size cards use `repeat(auto-fit, minmax(400px, 1fr))` and `max-width: 600px`. Forcing four columns below that minimum squeezes each card under 400px and no longer matches the live card. Four cards appear on one row once the row is wide enough for the 400px minimum. Settings is the 40px profile icon, not a nav label. TradeLocker and MT5 are the same pill buttons as the challenge names. The homepage Checkout button stays on this site and opens the portal Payments page for the selected challenge, size, and platform. That page is the live Buy Account screen: Step 1, Card / Crypto / Paymid, challenge type, amount, platform, name, address, and the summary with the five terms. Buy Now stays on this site. The Buy Account card uses the live width `calc(100vw - 180px)` (80px under 1180px), centered, with the header padded to the same edges. Payment and amount cells are 224px pills in a row, challenge types use `repeat(auto-fit, minmax(200px, 1fr))`, and Summary is two columns with Buy Now centered at 420px. Payment icons are the live Card, Crypto, and Paymid marks. Add New Address opens a short gold-bordered form on this site and does not post to CK Capital. That form is two columns inside a 900px card, with a yellow scrollbar and Save Information centered at the bottom. The Add New Address box is one column of a three-column row.

Program Objectives is not a two-column goals table. The live page is a title plus gold account selector, a white N/A status pill and Account Info button, then a Financial Performance chart (Balance/Profit and 1D/1W/1M/ALL) beside a Statistic card (max-width 325px), then Goals Overview cards for Max loss, Profit, Daily loss, and Trading days. An empty account shows `$NaN`, `NaN%`, and a gold Reset In timer. Dashboard filter is All / Active / Inactive. Trading History columns follow the platform (TradeLocker vs MT5). Support Ticket is `initialSupportPage`: a `#333` bar with a 1px `#ffff95` border, “Support Center” on the left, and a “Connect on Discord” pill to `https://bit.ly/dc-ckcapital`. Under it, a centered gold Poly Sans heading “How to create Support Ticket?” and the YouTube embed `0_YzykTGzOM` (the live player shows “Video unavailable”). Do not put the case-type grid on that landing view. Content is three pages, not one empty card. Podcasts opens Blogs (`Trade_edu_main`, title “Blogs”, cards on `minmax(250px, 1fr)`). Partnered Educators opens Educational Videos with Price Action / Swing / FNO / Misc pills and a 750×420 rounded player. PDF Materials opens a “PDFs” panel with up to four download cards. The menu labels stay Podcasts, PDF Materials, and Partnered Educators. Affiliate Overview is a muted “Overview” label, a gold “Clicks Statistic” card, and five `#1c1c1c` stat rows (Clicks, Pushed Leads, Commissions, Conversions, AFS Payout Date). Under that is “Financial Performance/Transaction” and “Affiliate code Details:-”. Referral is “Referrals”: Flat 10% for all the Users, a 0% rate, Generate, the coupon field, and the affiliate link. Generate stays on this site and does not call `/affiliates/create-link/`. Copying the coupon or affiliate link always shows a dark success toast at the top right for 2 seconds, even when the field is empty. The live `onCopy` callback is given the message string (“Your Unique Coupon Code Copied!” / “Your affiliate Code link Copied!”), so gating the toast on a non-empty value hides it. Profile is the header “Profile” with Account Details and Billing Details pills. Account Details is a centered 108px avatar, then Personal Details in two columns: Nick Name, First Name, Last Name, and Contact Number (128px `+` code plus number) on the left; Email, Country, and City on the right. Inputs are `#222` pills, 49px tall, radius 29, `.5px` `#333` border, gold border while editing. Password is a separate row of three pills with eye icons, and Log Out is a 194×49 red outline centered under it. Fields stay locked until Edit. Billing Details is one column of Rise and Crypto cards: a full-width “Not Submitted” badge, the method logo and name, the full description lines, then “My details” or a disabled “Coming Soon”. Saves stay on this site.

---

## 36. Firma — horizontal desktop track

**Breaks:** The homepage is built as a vertical page, so the hero, projects, and pricing never sit in one 900px band. Giant counters render at 12px. The video wordmark is a solid block instead of letters.

**Probe:** At 1440×900, `scrollHeight` is 900 and `scrollWidth` is about 33569. Main sections are side by side (Home 2200, Work 5629, About 3960, and so on). Below 1000px the same nodes stack and `scrollHeight` jumps past 19000. The FIRMA wordmark is a video masked to the glyphs.

**Fix:** One flex track, `height: 100vh`, widths in `calc(N * 100vh / 900)`, wheel mapped to `translate3d`. Do not let a later `.counters p` rule override `.count`. Mask the hero video with a canvas filled in Geist Black at the measured size and tracking (540px / -27px on the 900px artboard, scaled by `100vh / 900`); on the phone the wordmark is solid black type, with “Play reel” under it. Project text sits on a white panel that overlaps the photo, not in the gap after it. Quote, services, and story copy scrub from blur to sharp as they enter from the right. “newsletter” is coral `news` plus black `letter`. Fixed chrome uses `mix-blend-mode: difference`. Skip the Framer “Get this template” badge.

## 37. Firma — hero type is Playfair, not Playfair Display

**Breaks:** “Let’s create” is wider, looser, and a different cut than the live heading. `together.` sits too high and too far left. The FIRMA mask is fatter than the live letters.

**Probe:** At 1440×900, scroll 0, computed style on the heading is `font-family: Playfair` (the Google family named Playfair), weight 500, 64px, letter-spacing -3.2px, line-height 57.6px, box x 360 y 163. The cycling word starts at x 652 (10px after “Let’s create”). `together.` is Caveat 400, 180px, letter-spacing -12.6px, line-height 126px, x 621 y 212. The lede is Geist 400, 16px, line-height 26.4px, x 643 y 370, width 412. FIRMA is Geist 900, 540px, letter-spacing -27px, line-height 486px, x 328 y 455. At 390×844 the heading is Playfair 52px / -2.6px / 46.8px at y 120, and `together.` is Caveat 120px / -8.4px / 84px, right-aligned.

**Fix:** Load `family=Playfair:wght@500`, not only Playfair Display. Set letter-spacing and line-height in measured pixels scaled by `--u`, and scope those rules to `.home` so the newsletter script does not inherit the hero position. Draw the video mask with the same 540px / -27px Geist metrics.

## 38. Firma — FIRMA wordmark is rotated black type plus a lighten video

**Breaks:** The letters are level, and a canvas mask cuts a different Geist outline than the live word. The video also sits in the text box instead of the measured film frame.

**Probe:** At 1440×900 the word is Geist 900, 540px, letter-spacing -27px, line-height 486px. The text wrapper’s transform is `rotate(-4deg)` (`matrix(0.997564, -0.0697565, 0.0697565, 0.997564, 0, 0)`). Unrotated layout is about x 343 y 513, 1679×486; the rotated box is x 328 y 455. The film is a separate layer at x 355 y 490, 1700×532, `object-fit: cover`, on a parent with `mix-blend-mode: lighten` and `z-index: 0`. Phone (390) uses the same -4deg rotation, Geist 148px / -7.4px / 133.2px, film at x -44 y 401, 479×150.

**Fix:** Paint real black CSS text, then lay the video on top with `mix-blend-mode: lighten` so it shows only inside the letters. Do not mask the video with a canvas. Give the hero a white background so lighten knocks the film out to white around the word.

On this machine Chrome composites the `<video>` as an opaque layer, so `mix-blend-mode: lighten` draws a tilted rectangle instead of the letters. The frame that matches live is a canvas glyph mask (`Geist` 900 / 540px / -27px) on the video, with the text set transparent after the mask is applied, and the whole word rotated `-4deg`.

## 39. Firma — Our Projects card and View cursor

**Breaks:** The project title is the wrong size, the white card sits on top of the photo, and hovering the image only zooms it. The live page shows a black circle that says VIEW and follows the pointer.

**Probe:** At 1440×900, OUR and PROJECTS are Playfair Display 400, 180px, letter-spacing -10.8px, line-height 144px (OUR y 249, PROJECTS y 409). (8) is Playfair 500, 64px, letter-spacing -3.2px, y 593, coral. Each photo is 1100×900. The white card is 480×441, top 230, and starts at the photo’s right edge. Hovering the photo shows VIEW in Geist 900, 14px, letter-spacing -0.28px, white on a black circle.

**Fix:** Place the card at the photo’s right edge and slide it in from the right (opacity, blur, translateX) as it enters. Drive that progress from the photo edge, not the card’s own transformed box. On the photo, hide the cursor and follow the pointer with a fixed black circle labeled VIEW.

## 40. Firma — pinned chrome, vertical heading scrub, circular type

**Breaks:** Logo, menu, and socials sit in the wrong place, and the vertical WORK / STUDIO / JOURNAL / CONTACT labels stay stuck on every section. “About —”, “Numbers —”, “Pricing —”, and “News —” loop on a timer instead of sliding with the horizontal scroll. “LET’S CREATE THINGS” sits still, too big, and too pale.

**Probe:** At 1440×900 the fixed layer is `nav[data-framer-name="Fixed Navigation (z5)"]`, `position: fixed`, full viewport, `mix-blend-mode: difference`, z-index 5. Logo “FIRMA” is Geist 900, 20px / 18px, letter-spacing -0.6px, white, at x 64 y 45. Burger hit area is 40×40 at x 1336 y 38; both bars are 30×3, y 52 and y 61. Social icons are 24×24 at x 64 and x 136, y 828. The side labels are not in that layer. They live in the home band: parent `transform: matrix(0, -1, 1, 0)`, Geist 900 14px / 12.6px, letter-spacing -0.14px, black. Boxes: WORK x 66 y 250 13×67, STUDIO y 364 h 53, JOURNAL y 466 h 69, CONTACT y 582 h 68. They scroll away with the track.

Each `Ticker` is 340×2250, words Playfair 300, 240px, letter-spacing -12px, color #eee (Pricing white). Each word is 312×905 and sits 14px in from the strip, or the letters hang off the left edge. While the ticker crosses the viewport it moves down by one stage height and then stops: `translateY = min(900, max(0, scroll - (pageX - viewW)) * (900 / (viewW + 340)))`. Pricing’s strip starts at top -1514 so the on-screen word matches live. The Numbers strip is left 235, top -739, and the can is z-index 2 so the word sits behind the tin. Page x of the four strips: About 7829, Numbers 13914, Pricing 19721, News 22147.

`Arc` circles are 450×450. Services visual box is page x 18556, y -153. FAQ is page x 30504, y 612. Text is Geist 900, 10.5px, letter-spacing 1.21px, black. Rotation tracks scroll at -0.25deg per artboard pixel (one turn per 1440px). The second circle lags by 4000px of scroll.

**Fix:** Put logo, burger, and socials in one fixed `mix-blend-mode: difference` layer, painted white so they read black on white. Put the side labels in the home band so they leave with the scroll. Drive ticker `translateY` and circle `rotate` from the same horizontal scroll value. Do not use a free-running CSS marquee for those headings.

## 41. Firma — poster case, project card, service icons

**Breaks:** OUR / PROJECTS and the principles line render in sentence case, so the poster never reads NOT JUST ANOTHER / CREATIVE AGENCY. The white project card covers the portrait too early. Principles shows /01 and “And here’s why” on the video. Service icons are generic strokes instead of the ghost, sailboat, and star.

**Probe:** At 1440×900, OUR and PROJECTS are Playfair Display 400, 180px, letter-spacing -10.8px, line-height 144px, `text-transform: uppercase`. The first photo’s box is page x 2809, 1100×900. The white card is page x 3869, y 230, 480×441. Principles words are Playfair Display 104px, letter-spacing -5.2px, uppercase; CREATIVE is `#ff7a6e`. `/01` and “And here’s why” stay `opacity: 0` while that band is on screen. Service icons are 32×32 SVG symbols (ghost `#3288219287`, sailboat `#1793599557`, star `#1724523750`), stroke 1.5, coral.

**Fix:** Uppercase those display lines. Park the card on the photo’s right edge. Keep the principles index and link out of the poster. Use the measured icon paths. Fade `.rise` blocks in over the last 640px as they enter from the right.

## 42. Firma — cursor is a black dot that grows into a label

**Breaks:** The follower is a 16px white blend-mode dot with the word sitting to its right, and every link grows a VIEW label.

**Probe:** At 1440×900 the live cursor is `data-framer-name="Default"`, a black circle, blend normal. Idle size is 20×20. On the FIRMA wordmark it grows to about 124×124 and shows “Play reel”. On a project photo it grows to about 120×122 and shows “View”. Text links (Case Study, Read Article, Let’s talk, team names) leave it at the small dot. Labels are Geist 900, 14px / 25.2px, letter-spacing -0.28px, white, `text-transform: uppercase`, centered in the circle. Close uses the same circle.

**Fix:** One black circle centered on the pointer. Add `is-hot` only for `data-cursor` targets, and only put that attribute on the wordmark (PLAY REEL), the project photos and cards (VIEW), and the close buttons (CLOSE).

## 43. Firma — plus cursor, white idle dot, scroll hit-test

**Breaks:** Simple portraits stay on the 20px dot. Article photos never grow a VIEW circle. On a black band the dot disappears. Scrolling with the pointer held still leaves PLAY REEL or VIEW stuck on the last hover.

**Probe:** At 1440×900 the live cursor root stays 20×20 and `pointer-events: none`. Its variant name and the Background child change: Default is a 20×20 black circle; Play Reel and View grow the circle to about 124×124 with the centered label; Plus is a 64×64 black circle plus a 24×24 white plus (`viewBox="0 0 256 256"`, path `M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12z`). Plus is the about portrait and the three team portraits. View is the project photos, project cards, and the two journal photos. The numbers photo, eye photo, keycaps, and footer cap stay Default. On the principles poster, the pricing photograph, and the awards band the idle circle is white (`rgb(255, 255, 255)`), still 20×20.

**Fix:** `data-cursor="PLUS"` on those four portraits and `VIEW` on the journal photos. `data-ink="light"` on the principles section, the pricing photo, and the awards section, and paint the idle circle white only while the top element under the pointer is inside that ink. Store the pointer and call the same hit-test from the scroll tick via `elementsFromPoint`, using only the top element, so a still pointer picks up Play reel, View, or Plus as the track slides under it.

## 44. Firma — Our Projects photo window and heading drift

**Breaks:** Each project photo is a full 1100×900 slide, so it covers the white card early and “PROJECTS” / “(8)” leave the screen at the same speed as “OUR”. The case title wraps as “Common Future / Co.”

**Probe:** At 1440×900 the work band starts at page x 2200 and is 5629 wide. OUR is Playfair Display 400, 180px, letter-spacing -10.8px, line-height 144px, at section x 215 y 249, and it scrolls 1:1. PROJECTS is the same type at section x 0 y 409, then `translateX` runs from 0 to 200 across `viewW + 984`. (8) is Playfair 500, 64px, letter-spacing -3.2px, y 593, section x 350, and shifts 0 to 100 across `viewW + 160`. Each photo is a 900×900 overflow clip (section x 769, 2389, 4009). The 1100×900 image inside moves from `translateX(-200px)` to `0` while that clip crosses the viewport (`travel = viewW + 900`). The white card is 480×441 at y 230, flush with the clip’s right edge. Titles break “Common / Future Co.” and “Paper Bloom / Collective”. The case link is a 4px dot, Geist 400 16/26.4, and a 1px underline under the words only.

**Fix:** Clip each photo to 900×900 and drive the image shift from scroll. Leave PROJECTS and (8) in their layout places; do not add the live 0–200 / 0–100 drift, because the recording keeps the heading put and only the white card covers the photo. The white card is not the 480×441 text box. A Background layer sits 64px outside it on every side, 608×569, so the panel overlaps the photo and the type stays inset. The Case Study underline draws across the last 160px as the link enters, and stays full once the card is on screen. A stray `}` before `.shot img` drops that rule, so the photo falls back to its file size (1800×1800) and the face crops into an eye. The image has to stay 1100×900.

## 45. Firma — team portraits drift at different speeds

**Breaks:** All three portraits sit still relative to the band, so Tomas is 100px too far right and Nina’s name lands on her face. Roles use the global kicker tracking (`0.12em`), which blows “DESIGN DIRECTOR” apart.

**Probe:** About band starts at page x 7829. At 1440×900, Nina’s photo is locked: section left 2440, top 108, 502×792, no `translateX`. Tomas’s photo is section left 2202, top 200, 333×700, and shifts 0→100px: `start = 9819 − viewW`, `travel = viewW + 629`. Alma’s photo is section left 3003, top 200, 464×700, and shifts 0→200px: `start = 10828 − viewW`, `travel = viewW + 913`. Each name shares its photo’s X shift and already includes a constant `translateY(-72)`, so do not add another −72. Layout: Tomas name left 1955 top 590; Nina name left 2874 top 178 (overlaps the photo’s right edge and must paint above it); Alma name left 3449 top 289. Names are Playfair 500, 64px, letter-spacing −3.2px, line-height 57.6px. Roles are Geist 400, 12px, letter-spacing 0.12px (not 0.12em), line-height 21.6px, `#757575`, 8px under the 115px name box. The black circle between Nina and Alma is the idle cursor, not a layout dot.

**Fix:** Put `data-team` on the Tomas photo and name together, and on the Alma photo and name together. Leave Nina’s photo and name unshifted. Paint names above the photos. Scope role tracking to the team names so project kickers keep `0.12em`.

## 46. Firma — Our Services heading drifts onto the eye

**Breaks:** “OUR / SERVICES / (3)” sit too high and scroll away together. The eye is parked at the fully shifted position, so the word never runs onto the photo. The service lines blur in as one block.

**Probe:** At 1440×900 the services band starts at page x 16114. OUR is Playfair Display 400, 180px, letter-spacing -10.8px, section x 199 y 249, and it does not shift. SERVICES is the same type at section x 0 y 409 and shifts 0→200: `start = pageX − viewW`, `travel = viewW + 930`. (3) is Playfair 500, 64px, letter-spacing -3.2px, section x 335 y 593, and shifts 0→300 across `viewW + 369`. The eye is a 2048 square shown at 650×900, `object-fit: cover`, layout left 737, and moves from `translateX(-200px)` to 0 across `viewW + 445`. The intro and each service line fade with opacity and `translateY(60px)` over the first 110px after that column enters, staggered about 16 / 38 / 55px. No blur.

**Fix:** Reuse `data-shift` for SERVICES and (3), and `data-drift` for the eye, with those extras. Keep the heading above the photo. The eye stays under the columns (`z-index` 1, columns 3), or the portrait eats the first letters of “From strategy” and “Digital”. Each line fades over about 180px after its column crosses the right edge, staggered 0 / 20 / 40 / 70, with `translateY(60px)` and no blur. A 900px fade leaves Digital ghosted at the scroll where live is already solid. The circle type is Geist 400 at 12px, not black 900.

## 47. Firma — principles heading reveals word by word

**Breaks:** The poster is one left-aligned block that blurs in together, and the video is forced grayscale with an extra veil. `/01` and the footer are already hidden, which matches live.

**Probe:** At 1440×900 the principles band is page x 11789, 2025×900. The heading box is 960×208, centered in the band (left 533, top 294), Playfair Display 400, 104px, letter-spacing -5.2px, line-height 104px, uppercase, `text-align: center`. Words are NOT / JUST / ANOTHER in white, then CREATIVE in `#ff7a6e`, then AGENCY in white. Each word goes from opacity 0, `translateY(10px)`, `blur(10px)` to clear over about 80px of scroll after the box hits the right edge, staggered by a few pixels. The video has no CSS filter; its wrapper is opacity 0.3 over black. `/01`, `/02`, `/03`, “And here’s why”, and the footer line stay opacity 0 on this band.

**Fix:** Split the heading into word spans and drive each one from that enter distance. Center the 960px box. Set the video to opacity 0.3 and drop the grayscale veil.

## 48. Firma — do not pin Our Services

**Breaks:** Pinning OUR / SERVICES / (3), or parking the eye, puts the service card across the face. Live scrolls the heading off to the left. The card stays on the white, to the right of the photo.

**Probe:** At 1440×900, scroll 16400: SERVICES overlaps the eye and is already leaving on the left. The eye is at screen x 355 with `translateX` about −95. Digital is at x 1061. Scroll 17200: the eye is at x −360, Digital at 261, Branding at 1001. (3) `translateX` is 183 / 231 / 300 at scrolls 16114 / 16400 / 17200.

**Fix:** SERVICES shifts 0→200 (`extra` 930) and (3) shifts 0→300 (`extra` 369). The eye drifts −200→0 (`extra` 445). Cards move 1:1 and paint above the photo. No white mask, no `data-stay`, no `data-lag`.

Live markup keeps Our at `transform: none`, Services near `translateX(145px)`, and (3) near `translateX(228px)` in the same frame. The eye is a 650×900 clip; the image is `calc(100% + 200px)` and sits near `translateX(-93px)`. Service lines are `transform: none` once they have entered. The arc type is Geist 900, 10.5px, letter-spacing 0.115em, fill `#eee`. The icon and title sit on a white card that may cover the eye. The intro and each body paragraph stay on the column’s left edge, in line with the title.


---

## 41. Portfolio — Designing 3D spoke carousel (image cards)

**Site:** `portfolio/` (Nuance-style spoke reused for Canva design cards).

**Breaks:** Horizontal scrollbar slices through the cards; shrinking the handle/cards “to fit” makes the drum look worse than Nuance; global `img { max-width:100%; height:auto }` fights card fills; `100vw` stage without `overflow-x: clip` expands `scrollWidth`.

**Probe:** Handle **1400×240**, cards **400×300**, stage **300**, `perspective(500px) rotateY` on the handle, spokes at 45/90/135/180, skill-a/b `rotateY(±90deg)`. `document.documentElement.scrollWidth` should equal `clientWidth`. Card computed size stays 400×300 (projected AABB will look huge — ignore that).

**Fix:** Match Nuance spoke exactly: handle **1400×240**, cards **400×300**, stage **~340**, `perspective(500px)` on the handle spin. Bake art to **800×600**; clip with inner `.skill-face`. `html/body { overflow-x: clip }`. Mobile only: stage `scale(0.48)`. Do not add mid-breakpoint scale stacks — they ruin the drum. No hover pause.

---

## 49. Firma — Pricing headings rise in, ticker is faint

**Breaks:** Starter, Growth, the prices, and the left copy sit fully painted as soon as the band arrives. The vertical “Pricing —” is solid white, so it reads much louder than live.

**Probe:** At 1440×900, hold scroll and watch the plan. The “Name” group (title + price) goes from opacity 0 / translateY(60) to settled in about 1.1s with `cubic-bezier(0.4, 0, 0.2, 1)`. The feature list starts ~180ms later. Copy still off the right edge stays at opacity 0. The Pricing ticker wrapper is opacity 0.2; the glyphs themselves stay white. Column rules are white at opacity 0.2.

**Fix:** `data-rise` plays that curve once the pin’s left edge enters the viewport, and resets if it slides back off the right. Title+price delay 0, list 180, fit line 320, “Not sure” 360, “Let’s talk” 560. Set `#pricing .vmarq { opacity: 0.2 }` and the rules to `rgba(255,255,255,0.2)`. Do not scrub this fade with scroll progress — it finishes even if the wheel stops.

---

## 50. Firma — News photos pan inside a short frame

**Breaks:** Article photos are the full 490×585 with no crop, titles are 64px, and the vertical “News —” repeats on the tall 905px word box so the letters sit in the wrong slice.

**Probe:** At 1440×900 the Articles band is page x 22087. Each photo frame is 390×585 at y 158 (first left 280, second 1378), overflow hidden. The img is 490×585 and `translateX` runs from -100 to 0 across `view + 390`, same math as the project shots. Date is Geist 12/21.6, letter-spacing 0.12px. Title is Playfair 48/48, letter-spacing -1.92px, 480 wide, y 211. Body is 16/26.4 at y 371. “Read Article” sits in a 40px row at the bottom of the 585px column. News words are 312×705, color #eee, and the strip uses the shared ticker scrub (left 60, top -1350).

**Fix:** Clip with `.news-photo` and run it through the shot parallax loop. Do not reuse `.shot` sizes. Override `#journal .article` type so project titles stay 64px. Set `#journal .vmarq span { height: 705px }`. Keep the News strip at `z-index: 0` and the photo at `z-index: 2` so the letters pass behind the picture. The photo has no fade — the live enter is that pan.

---

## 51. Firma — refresh stays on the same section

**Breaks:** The track is moved with `translate3d`, so the browser’s scroll position is always 0. Refresh paints the hero.

**Probe:** Scroll to a band, reload the same tab, and read the scaler’s matrix. It should still be that artboard x. A new tab stays at 0.

**Fix:** Write `target` to `sessionStorage` on `pagehide` and set `current = target` before the first frame. The logo jump `home` sets `target` back to 0. Do not use `localStorage` — a new visit should still open on the hero.

---

## 52. Firma — newsletter keys and trailing cursor

**Breaks:** “Join our” sits too high, “newsletter” is loosely tracked, and the FIRMA keys are pinned. The black cursor sticks to the pointer.

**Probe:** At 1440×900, scroll 24800. Keys are centered with `translate(-50%, -50%)` plus a scroll `translateX` that clamps (F ±50, A ±50, I ±100, M ±100, R stays 0). “Join our” is Playfair 500, 64/57.6, letter-spacing -3.2px, page x 25543 y 158. “newsletter” is Caveat 180/162, letter-spacing -12.6px, page x 25585 y 170. The 20px cursor eases toward the pointer instead of jumping.

**Fix:** Place each key on its layout point and drive `translateX` from `current - 24400`. Lerp the cursor about 15% of the remaining distance each frame. Do not tie the keys to the mouse — their motion is scroll.

---

## 53. Firma — kind words and review copy rise in

**Breaks:** “Kind words” and “Worked with us?” sit in one stacked box, so the review line is too high and the coral bubble is missing. They are fully visible the moment the band arrives.

**Probe:** At 1440×900 both blocks share page x 26484. Kind words is y 160, 360×106, Geist 16/26.4. The bubble is 32×32 at y 545, stroke `#ff7a6e`. “Worked with us?” is y 616, 24/33.6. “Leave a review” is y 732. Each rises from opacity 0 / translateY(60); the review pair starts about 400ms after the first paragraph.

**Fix:** Split them into pins and use `data-rise` (0, 80, 400, 560). Put `data-rise` on an HTML wrapper, not the SVG — an SVG’s `offsetLeft` stays unset and the rise never starts.

---

## 54. Firma — awards list hover arrow

**Breaks:** Award names are bold and stacked tight beside the photo. The rows have no arrow, and hover does nothing. The right-hand copy is bold white in the wrong column.

**Probe:** At 1440×900 the band is page x 27964. The photo is 1100×900 at left -57. Heading is Playfair 500, 64/57.6, letter-spacing -3.2px, at left 870 y 158, so it overlaps the photo. Each row is 360×40, Geist 24/33.6 weight 400, color #ccc, name column 265px, tops 450 then every 63px. Hover turns the row white, fades in a 40px white circle at the right, and slides the arrow in from `translate(-20px, 20px)`. Copy is 480px at left 1590 y 452; the second line is white weight 400.

**Fix:** Place those pins and stagger `data-rise` by 80px. Keep the arrow circle `opacity: 0` until hover. Do not set the names to weight 700.

---

## 55. Firma — FAQ rows and the bottom-left ring

**Breaks:** The FAQ heading sits too low and overlaps the intro. Questions are bold, the index column is too narrow, and the row gap is tight. The bottom-left ring is black, tiny, and spun with a 4000px lag, so the words sit on the wrong part of the circle.

**Probe:** At 1440×900, scroll through the section so the rise can finish. Settled heading is page x 30434, y 158, Playfair Display 400, 104/104, letter-spacing -5.2px. The intro is 400×79 at y 302, 16/26.4, “Have questions?” weight 700 and the rest #757575. “Let’s talk” is a 40px row at y 421, 12/400, with a 4px dot. Question rows start at y 158, then 367, 481, 596, 710: Geist 24/400, letter-spacing -0.24px, index #ccc in an 81px column, 80px between rows, answer 512px at 16/26.4. The open control is the same plus path rotated 135° and grown to 34px. Hover does not change color. The ring is 450×450, viewBox 0 0 100 100, Geist 900, 10.5 user units, letter-spacing 0.115em, fill #eee, and it rotates at -0.25° per scroll pixel with no lag. A jumped scroll leaves the heading at translateY(60) because it never entered; measure after scrolling onto it.

**Fix:** Pin those boxes and rise the heading, intro (160ms), link (320ms), and the list. Draw the plus once and rotate it when `.open`. Give the ring its own class so `.circle-type text` does not force 12px, and set `data-spin="0"`.

---

## 56. Firma — email address and the copy icon

**Breaks:** “copy address” sits under the email as a caption. The phone and the note stack tight underneath, so the cap no longer lines up with the gap.

**Probe:** At 1440×900 the column is page x 32034. “Email:” is Geist 16/26.4 #757575 at y 158. The address is Playfair 500, 48/48, letter-spacing -1.92px, at y 184. A 32px coral copy icon (`#ff7a6e`, stroke 1.5) sits 14px to the right of the address, not a text label. Phone is the same size at y 290. The note is 400px wide at y 579, and “Less noise, more intention.” is weight 400, not bold. The page behind it is white.

**Fix:** Pin the column at left 1600 and rise the rows. Keep the icon as the copy control. Do not put the note directly under the phone.

---

## 57. Firma — footer link columns

**Breaks:** Home / Work are bold and stacked in a tight grid, with no dots. The credit line has no mark, and the copyright is sentence case.

**Probe:** At 1440×900 the block is page x 33094. The Framer mark is 31×31 at y 164. Each link is Geist 16/26.4 weight 400, height 40, with a 4px dot and an underline on the word only. Columns start 177px apart. Rows are Home 449, then about every 57px. The field behind the links is white. Copyright is 12px #757575 at y 731: “© 2026 FIRMA. ALL RIGHTS RESERVED.”

**Fix:** Use a two-column grid with `justify-self: start` so the underline stays on the word. Do not set the links to weight 700.

---

## 58. Firma — contact wash and footer link hover

**Breaks:** The email column and the cap sit on flat white, so the cap disappears. Footer links stay a 4px dot on hover.

**Probe:** At 1440×900 the “Contact Info” box is page x 32034, 940×900. Its background is `linear-gradient(90deg, #fff 0%, #ededed 100%)`. The footer column to the right of that box stays `#fff`. Each link is a flex row, gap 10, with a 4×4 black circle (`overflow: hidden`) and an 18px white arrow parked off the left. Hover sets the circle to 40×40, the gap to 14px, and centers the arrow. The word does not change color.

**Fix:** Paint that gradient on a layer behind the email column and the cap, and stop it before the footer links. Grow the dot into the circle and slide the arrow in. Hide the wash when the page stacks on a phone.

---

## 59. Firma — service copy sits past the eye

**Breaks:** “From strategy to execution” and the Digital paragraph run across the portrait. A white card behind the icon cuts into the cheek.

**Probe:** At 1440×900, scroll 16850. The eye frame is page-aligned at section left 737, but it is 450×900, not 650. The image inside is 650×900 and sits near `translateX(-48px)`. The intro is 480×101 at screen x 611, y 158. Digital’s title and body share that same left edge. The photo’s right edge stays about 160px left of the column, so the type sits on white.

**Fix:** Set the clip to 450px wide and keep the image at `calc(100% + 200px)`. Do not widen the frame to 650 or the paragraph lands on the face.

---

## 60. Firma — services ring is the same type as FAQ

**Breaks:** Above Production, “LET’S CREATE THINGS” is a faint short arc. The letters are about 10px instead of wrapping a 450px circle.

**Probe:** At 1440×900, scroll 18000. The ring is page x 18556, top −153, 450×450, viewBox `0 0 100 100`. The path is the radius-50 circle. Text is Geist 900, font-size 10.5 in user units, letter-spacing 0.115em, fill `#eee`, hanging on the path: “LET'S CREATE THINGS — LET'S CREATE THINGS —”. It rotates −0.25° per scroll pixel. At scroll 18000 that is 180°.

**Fix:** Use the FAQ ring markup. Do not put `font-size: 10.5px` or `12px` on this text, or the letters collapse to CSS pixels inside the 100 viewBox.

---

## 61. Firma — the pointer is the black follower

**Breaks:** The Windows arrow stays on buttons, and the black dot can sit inside the scrolling frame.

**Probe:** At 1440×900 the live cursor root is 20×20, blend normal, and its black circle is centered on the lagged pointer. Play Reel and View grow that circle to 124×124 with Geist 900, 14px, white, uppercase. Plus is 64×64 with a 24px white plus. On the principles poster, the pricing photo, and the awards band the idle circle is white.

**Fix:** Keep one fixed circle outside the scrolling frame, `z-index: 200`. Lerp it about 15% of the remaining distance each frame. Do not put the follower inside the scaled track. Leave the system arrow visible.

---

## 62. Firma — arrow stays with the black dot

**Breaks:** Hiding the system cursor leaves only the black circle. Live shows the arrow and the dot together.

**Probe:** At 1440×900, with the pointer held at the center, the system cursor stays `auto` (the arrow) on type and empty space, and switches to `pointer` on the wordmark, project photos, and portraits. The black circle is separate. It is 20×20 until Play Reel or View (124, white label) or Plus (64, white plus). On the principles poster, the pricing band, and the awards band the idle circle variant is White, `rgb(255, 255, 255)`, still 20×20. Scrolling under a still pointer updates the variant.

**Fix:** Do not set `cursor: none`. Put `cursor: pointer` only on `[data-cursor]`. Mark the whole pricing band `data-ink="light"`, not only its photo, or the dot stays black on the dark plans. The follower keeps updating from the scroll tick.

---
