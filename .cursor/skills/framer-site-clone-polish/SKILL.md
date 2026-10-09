---
name: framer-site-clone-polish
description: >-
  Clone and polish ANY site in this workspace against the live page: Framer,
  agency, portfolio, landing, Next.js/React conversions, MyOS desktop OS (iPod,
  windows, dock). Probes live with Playwright, fixes layout/motion, then appends
  new problem→fix lessons. Use for every clone going forward — open/clone/theek
  karo, match live, convert to Next, overflow, sticky, cursor, Music/iPod, or any
  clone section that looks wrong. Do not skip this skill on new clone folders.
---

# Framer site clone polish

Match the **live site**, not a guess. Probe, measure, fix, re-check. After every
new class of bug, **update this skill** (do not wait for the user to say so).

## When this skill applies

**Every clone in this workspace, now and going forward.** Not only Framer or MyOS.

- Open / clone / convert any live site (Framer, agency, portfolio, landing, Next.js)
- Desktop-OS templates (MyOS): Music, iPod, windows, dock, cats toggle
- User says match live, theek karo, same as live, video/audio on iPod
- A section looks off: overflow, sticky, cursor, CTA, cards, motion

## After every clone (mandatory)

When you learn something that is **not already in** [section-playbooks.md](section-playbooks.md):

1. Add a playbook: **Problem → Verify → Fix** (site name + section).
2. If it is a frequent bug, add one row to the quick-rules table in this file.
3. Keep SKILL.md short; put details in the playbook file.
4. Do this yourself. Do not ask “should I update the skill?”

Skip updates that are one-off copy/numbers for a single client unless they are a **pattern**.

## Workflow (every section)

1. Serve the clone (`npx serve -l 4173 .` or `npm run dev` for Next).
2. Playwright probe live + clone at **1440×900** (also 1280 / 1366 if layout is absolute).
3. Measure: box, font, z-index, sticky/fixed, transform, border, gap.
4. Screenshot both at the same scroll Y (and the same click path for overlays).
5. Fix to live metrics. Cache-bust `css?v=` / `js?v=` (Ctrl+F5).
6. Re-screenshot. Only then move on.

Windows: Playwright as `.cjs`, not `node -e` with nested quotes.

If the user sends a **screen recording**, treat it as ground truth for click flow (Music/iPod), even when live is hard to probe.

## Owner accounts

Rehan’s own deploys and repo links use these. Do not use the old handles.

- GitHub: https://github.com/Mrehankamboh
- Vercel: https://vercel.com/muhammadrehankamboh

## Defaults

- Skip Framer “Buy Template” chrome unless asked.
- Stack: HTML + CSS + small JS (or Next/React if the user asked). No Framer runtime.
- Design canvas is often 1440×900. Absolute `left: 1036px` will clip on narrower widths.
- Probe scripts (`_probe-*.cjs`, `_qa-*.cjs`) are **not** the site. Do not leave them in the folder you hand over.
- Music must not be a YouTube link. Localhost YouTube embeds **Error 153** — use local `<video>` on iPod LCD.

## Self-QA (no prompting)

**Marketing / scroll sites**

- [ ] Header / burger hit area
- [ ] Hero: no overflow; wordmark not covering copy
- [ ] Sticky contact vs footer paint order
- [ ] Cards, hover overlays, CTA bars (centered label + divider)
- [ ] Dual-layer motifs, toggles, custom cursor
- [ ] 1280 / 1366: no clipped right-side type

**Desktop OS (MyOS)**

- [ ] Music opens iPod, not a YouTube tab
- [ ] All Songs → Select → Loading → video on LCD
- [ ] MENU tree + Next/Prev match the recording
- [ ] LCD has video **and** unmuted audio (local file, not YT embed)
- [ ] YouTube-red overlay plays **on the iPod**, does not leave the page

## Quick rules

| Area | Break | Fix |
|------|--------|-----|
| Hero absolute | Right label clipped `<1440` | 1440 stage, `--hero-scale = min(1, vw/1440)` |
| Wordmark | Covers subtitle | Place under scaled subtitle; JS `top` if inline |
| Sticky contact | Footer never covers it | Contact **outside** `main`, sibling of footer |
| Cursor | System cursor visible | `cursor: none` + fixed follower; shrink on links |
| CTA bar | Label left, buttons right | `justify-content: center; gap: 40px` |
| CTA divider | No line before buttons | `padding-left: 40px` + `::after` border |
| Toggle | Flat, no track border | `::after` `1px solid` from live |
| Dual SVG motif | Looks like two shapes | One clipped box; stack at same origin |
| Buttons | Too small | Probe live font/padding/width |
| Music | Opens YouTube | `data-open="ipod"`; never `window.open` YT |
| iPod A/V | No video/voice on localhost | HTML5 `<video>` on LCD; overlay play in same click |
| QA scripts | Mixed into site folder | Ship only html/css/js/assets (or Next app) |
| 3D card fan | Cards pile / front one huge | 4-spoke cylinder: `perspective(500px) rotateY` on handle, cards at ±90° on 1400px arms |
| Sticky works stack | Tint slides up with cards | One pinned 800px tint; crossfade when slot `top<=0` |
| Expertise tool cards | Flat grey, no ring | 2px inset inner panel; 687×484 orange-gold glow clipped |
| Bento cards | 3-col auto; peach craft fill; fake wreaths | 6×4 190/166; cream face + blob wash; 44×106 masked gold wreaths; in-view count-up |
| Scroll artboard | Static tilt, no flatten | `perspective()` on the card; intro 20°→6° then scroll 6°→0 |
| Ticker pills | Small 56px chips, outer ring | Live chips fill 90px; 28px type; 12px dot; inset peach glow |
| Testimonials globe | Static peach; flags float; 4-col quotes | 1200×540 pill; rotating cream→peach conic; flag scale+fade; quote marquee |
| FAQ heading | Wraps `Frequently Asked / Questions` | Explicit `<br>` after Frequently; 365×189 column; 48/57.6 |
| Contact form card | Tall 48px Submit, all-black behind peach | 800px band; cream top 400 + black bottom; 1200×672 peach; form mid on seam |
| Footer typewriter | Wrong pad/type; 18s seal; `↗` text | 503px pad 96/40; 60/78 type; seal **4.56s**; 24px arrow icons |
| Contact→footer reveal | Footer below only, no underlap | `.footer-pin { sticky; bottom: 0; z:1 }` under Contact `z:2` |
| Navbar pill | Soft/wide gap; grayscale avatar | **538×58** pad 8 gap 24 radius 29; color avatar; CTA gradient |
| Navbar scroll | Pill never hides | `translateY(-90px)` on scroll-down; show on scroll-up |
| Site smooth scroll | Native wheel jumps | Lenis `ReactLenis root` lerp 0.09 / duration 1.15 |
| Works foot CTA | Button under sticky cards / wrong arrow | Foot `z-index: 6`; live **More Case Studies** + 20px ↗ SVG |
| Hero load lines | Static / wrong whole-line fade | Per-char blur(10)+ty(20) sync; sub per-word opacity ~80ms |
| Prop ticker | Text chips instead of art | Fixed gold bar; duplicate the live PNG strip; `translateX(-50%)` |
| Horizontal Framer | Page scrolls down at 1440 | Track is `100vh` wide in measured px; wheel drives `translateX` |
| Display serif | “Playfair Display” looks lighter and wider | Framer family is often `Playfair` (weight 500). Copy computed `font-family`, `letter-spacing`, and `line-height` in px |
| Video wordmark | Canvas mask, letters sit flat | Black type under a video with `mix-blend-mode: lighten`. Copy the live rotation |
| Display numbers | 12px instead of script | Don’t let `.section p` beat `.count` on specificity |

Full recipes: [section-playbooks.md](section-playbooks.md)

## Probe skeleton

```js
const { chromium } = require("playwright");
const LIVE = "https://example.framer.website/";
const CLONE = "http://127.0.0.1:4173/";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(LIVE, { waitUntil: "networkidle", timeout: 120000 });
  // measure + screenshot
  await page.goto(CLONE, { waitUntil: "domcontentloaded" });
  // same measure + screenshot
  await browser.close();
})();
```

## Don't

- Guess sizes or sticky structure without a live probe
- Put sticky Contact last inside `main` if footer must cover it
- `justify-content: space-between` on centered Framer CTA rows
- Music as `<a href="youtube">` or `window.open` to “fix” audio (closes iPod)
- `youtube.com/embed` on localhost (Error 153)
- Ask the user whether to record a new lesson — just append it
