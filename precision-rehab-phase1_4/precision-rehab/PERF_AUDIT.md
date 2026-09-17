# Performance Audit — Precision Rehab redesign preview

Measured on the published preview page, throttled to **1.6 Mbps / 150 ms RTT / 4× CPU**
(roughly a mid-range Android on regular 3G) at a 430 px viewport.

---

## 0. Scope correction, up front

The brief asked about bundle size and unnecessary re-renders. This preview has **no bundle
and no component tree** — it is one static HTML file with inline CSS and ~100 lines of vanilla
JavaScript. There is no framework, no dependency graph, and nothing that re-renders, so those
two metrics have no literal equivalent here.

What they translate to on this page, and what I actually audited:

| Asked about | Equivalent here | Verdict |
|---|---|---|
| Bundle size | Page weight + asset payload | **Was the problem.** 1.15 MB → 149 KB |
| Unnecessary re-renders | Wasted paint / layout on interaction and scroll | No issue found (measured) |
| Unoptimized assets | Image format, dimensions, load strategy | **Was the problem.** Fixed |
| Layout shift risk | CLS | Already 0, and stays 0 |

The Next.js port is a different story and gets its own section at the end.

---

## 1. Results

| Metric | Before | After | Change |
|---|---:|---:|---|
| Transferred on load | 1152.5 KB | **149.2 KB** | **−87%** |
| Requests on load | 14 | **4** | −10 |
| LCP | 2172 ms | **988 ms** | **−55%** |
| FCP | 488 ms | 552 ms | ~flat |
| CLS | 0 | **0** | held |
| Total image weight | 1266 KB | **539 KB** | −57% |
| Page HTML | 104.4 KB | 101.5 KB (**24 KB gzipped**) | −3% |

The headline number is the 87% cut to initial transfer. It comes from two things: images that
were massively over-sized for their slots, and every image loading eagerly whether or not it
was anywhere near the screen.

---

## 2. What was wrong, and what I changed

### 2.1 Thumbnails were shipping ~95× more pixels than they displayed

The worst offender: `svc-shockwave.jpg` was **820 × 820** for a slot that renders at
**84 × 84**. Three accordion thumbnails alone accounted for 135 KB to paint 21,000 pixels
of actual screen area.

Every image is now sized to roughly **2× its largest rendered size** (retina-sharp, nothing
beyond that):

| Asset | Was | Now | Saved |
|---|---:|---:|---:|
| `svc-shockwave` | 60.2 KB @ 820px | 4.3 KB @ 190px | −56 KB |
| `svc-needling` | 41.4 KB @ 900px | 3.0 KB @ 190px | −38 KB |
| `svc-laser` | 33.6 KB @ 560px | 4.3 KB @ 190px | −29 KB |
| `patel` | 181.2 KB @ 900px | 107.7 KB @ 840px | −74 KB |
| `band-needling` | 57.1 KB | 8.5 KB | −49 KB |
| `logo` / `mark` | 95.5 KB | 38.9 KB | −57 KB |
| `dn-panel-before/after` | 256.6 KB | 119.3 KB | −137 KB |
| `laser-classiii/iv` | 245.0 KB | 118.4 KB | −127 KB |
| `dn-diagram` (lightbox) | 218.4 KB | 108.3 KB | −110 KB |

`band-needling` deserves a note: it is a decorative background rendered at **20% opacity
behind a grayscale filter**. It was being served at full photographic quality for something
nobody can actually resolve. Dropped to quality 62 at 820 px — visually identical in situ.

### 2.2 Everything loaded eagerly, including images inside collapsed panels

All 15 images fetched on first paint, including the six inside accordion panels that are
closed by default and the lightbox diagram nobody had clicked.

Added `loading="lazy"` + `decoding="async"` to everything below the fold, and
`fetchpriority="high"` to the two images that are actually in the first screen.

Because collapsed panels are `hidden` (`display: none`), lazy images inside them have no
layout box and are never "near the viewport" — so they genuinely don't download until opened.
Verified waterfall:

```
on first paint  : logo.webp, mark.webp, band-needling.webp   (47 KB)
after scroll    : svc-*.webp, patel.webp
on opening panel: dn-panel-before.webp, dn-panel-after.webp
on lightbox open: dn-diagram.webp
```

### 2.3 JPEG/PNG throughout

Converted all 14 images to **WebP**. Same visual quality, 57% less weight, universally
supported. Alpha preserved on the logo and mark.

### 2.4 No intrinsic dimensions on any image

All 15 `<img>` tags lacked `width`/`height`. CLS measured 0 anyway — the `aspect-ratio`
containers on the comparison frames and the fixed-size thumbnails were already reserving
space. But that protection is incidental, not declared: any future change to those containers
would silently reintroduce shift. Explicit `width`/`height` now on every image, so the
browser reserves the box from the markup regardless of CSS.

---

## 3. Code removed

**20 dead CSS rules**, verified by matching every selector against the live DOM with all
panels, tabs, menus, the chat and the lightbox forced open:

- `.cond-list`, `.cond-row`, `.cond-row:hover`, `.cond-idx`, `.cond-name`, `.cond-region`
  — the numbered conditions list, superseded when that section became pills.
- `.flip`, `.flip-tabs`, `.flip-tabs button`, `:hover`, `[aria-pressed="true"]`,
  `.flip-stage`, `.flip-stage img`, `.flip-stage img.on`, `.flip-badge`, plus its
  reduced-motion block — the two-state toggle built and then reverted back to the drag.
- `.det-unit.photo` ×3 — the laser photo card, removed when the device became the thumbnail.

**One dead JS block**: the entire `[data-flip]` cross-fade handler, ~20 lines bound to
elements that no longer exist.

**11 orphaned assets** were sitting in the published artifact unreferenced
(`dn-before/after.jpg`, `laser-action.jpg`, `laser-unit.jpg`, `svc-laser-unit.jpg`,
`logo-white.png`, `mark2.png`, `wordmark*.png`, `word-primary*.png`) — ~580 KB of dead
weight. Removed from the artifact.

A caution for anyone repeating this: a naive "unused selector" scan flagged **13 false
positives** — `[hidden]`, `:focus-visible`, `.chat-open`, `:root[data-theme="dark"]`,
`.burger[aria-expanded="true"] i:nth-child(n)` and similar. Those only match in states a
static scan can't reach. Deleting them would have broken theming, focus rings and the
hamburger animation. Every removal above was checked by hand.

---

## 4. Tested and found NOT to be a problem

Worth recording so nobody "optimizes" these later on principle:

**`backdrop-filter: blur(16px)` on the sticky header.** The usual advice is that
backdrop-filter is expensive to repaint on scroll. I measured it at **6× CPU throttle**
across a 6000 px scroll:

```
WITH backdrop-filter     median=16.7ms  p95=16.8ms  frames>32ms=1/147
WITHOUT (solid #fff)     median=16.7ms  p95=16.7ms  frames>32ms=0/147
```

Identical, both pinned at 60fps. **Leave it alone.** I was ready to recommend removing it
and the data said otherwise.

**Layout shift.** 0 before and after, on both fast and throttled connections.

**JavaScript cost.** 4.8 KB, no dependencies, no framework. Not worth touching.

---

## 5. Recommendations for the Next.js port

These are the items that matter when this becomes the real site, and which I could not
fix in a static preview:

1. **Use `next/image` for every image.** It replaces all the manual work above — sizing,
   WebP/AVIF negotiation, lazy loading, and the `width`/`height` reservation — and will do
   it better, because it can serve per-breakpoint sizes rather than one fixed 2× asset.
   Set `priority` on the header logo and hero mark only.

2. **Self-host Figtree rather than linking Google Fonts.** The preview uses a
   `<link>` to `fonts.googleapis.com`, which is render-blocking and costs a third-party
   DNS + TLS round trip. The existing site already self-hosts via `@fontsource-variable/*`
   — do the same with `@fontsource/figtree` and drop the external link. Worth roughly
   200–400 ms on a cold mobile connection.

3. **Keep the modality accordion as the only `"use client"` component in that section.**
   The wipe sliders and accordion are the sole interactive parts; everything else in
   "Advanced Recovery Technology" is static and should stay a server component. This is
   the closest thing to the "unnecessary re-render" concern in the brief — the fix is
   drawing the client boundary tightly rather than marking the whole section client-side.

4. **Consider `content-visibility: auto`** on the below-fold sections. It lets the browser
   skip layout and paint for off-screen content on a page this long. Real win, but it needs
   `contain-intrinsic-size` set per section or the scrollbar jumps — test before shipping.

5. **Bake the grayscale into `band-needling.webp`** rather than applying
   `filter: grayscale(.35)` in CSS. Trivial, and removes a compositing filter on a
   full-section element. Low impact; do it if convenient.

---

## 6. Current shape

```
HTML    55.9 KB
CSS     40.8 KB  (364 rules, inline)
JS       4.8 KB  (vanilla, zero dependencies)
-----------------
page   101.5 KB  ->  24.0 KB gzipped
images 539.0 KB  total, of which 47 KB loads on first paint
```
