# Design & Accessibility Audit — Precision Rehab redesign preview

Strict frontend/UX review of the full page against modern design practice, focused on
visual hierarchy and typography, WCAG colour contrast, and spacing/alignment consistency.

Everything below was **measured**, not eyeballed: computed styles pulled from the rendered
page in both colour schemes, at 375 / 768 / 1280 px, with every accordion, tab, `<details>`,
the chat panel and the lightbox forced open so no state went unexamined.

All eight findings are fixed and published (Version 24).

---

## Summary

| | Before | After |
|---|---:|---:|
| WCAG AA text-contrast failures (light) | 12 | **0** |
| WCAG AA text-contrast failures (dark) | 1 | **0** |
| Focus indicators below 3:1 (SC 1.4.11) | 9 | **0** |
| Text rendering below 12px | 3 | **0** |
| Distinct font sizes | 30 | **9 tokens + 6 fluid clamps** |
| Distinct `gap` values | 32 | **14-step scale** |
| Touch targets under 24×24 | 0 | 0 |
| Horizontal overflow at 375/768/1280 | none | none |

Page weight went from 24.0 KB to 25.9 KB gzipped. That ~1.9 KB is the cost of replacing
literal values with `var()` references; I think a design system that survives the Next.js
port is worth it, but it is a real cost and worth naming.

---

## P1 — Amber accent failed WCAG AA as body text, everywhere it appeared

**Severity: highest.** This is a clinic site with an explicitly older audience, and the
accent colour was unreadable to anyone with reduced contrast sensitivity.

`--amber: #B8761A` was used for small text on three different light grounds:

```
on --surface (#FFFFFF)    3.72:1   FAIL  (AA needs 4.5)
on --paper   (#F4F5F7)    3.41:1   FAIL
on --amber-wash (#FBF1E1) 3.33:1   FAIL
```

It carried 12 distinct text roles: `.note` eyebrows, `.det h4`, `.reg-col h3`, `.dev`,
`.tag`, `.det-proto b`, `.wipe-cap b`, `.cond-foot a`, and the footer/header hovers.

**Fix**

```css
/* was */  --amber: #B8761A;
/* now */  --amber: #96600F;   /* white 5.28  paper 4.84  wash 4.72 */
```

`--amber-fill: #C6862A` is **unchanged** — it is only ever a button fill with dark text on
top, and that pairing already passed. Darkening it would have muddied the primary CTA for
no accessibility gain.

### P1a — three colours bypassed the theme entirely

While fixing the above I found five hardcoded `#B8761A` literals in `.hdr-nav a:hover`,
`.hdr-tel:hover`, `.ftr h4` and `.ftr a:hover`. These never responded to the dark theme.

My first instinct was to route them through `var(--amber)` and be done. That would have
been a bug: **the header and footer plates are white in every theme** (the transparent logo
art is navy, so the bar supplies its own white ground). In dark mode `var(--amber)` resolves
to `#EBAA44`, which on white is 1.9:1 — I would have traded a light-mode failure for a
dark-mode one.

Correct fix is a token that is deliberately *absent* from the dark overrides:

```css
:root{
  /* header + footer plates are white in every theme, so amber on them is
     pinned here and deliberately absent from the dark overrides below. */
  --amber-on-light: #96600F;
}
```

---

## P2 — Darkening the accent broke the focus ring (a fix that caused a defect)

Recording this because it is the kind of thing that ships silently.

The focus indicator was `outline: 3px solid var(--amber)`. Once `--amber` went dark enough
to pass AA as *text* on light grounds, it stopped passing SC 1.4.11's 3:1 **non-text**
requirement on the navy sections:

```
#96600F vs --ink   (#08182E)   3.37   ok
#96600F vs --ink-2 (#0E2743)   2.86   FAIL
#96600F vs --ink-3 (#17395C)   2.24   FAIL
```

Nine focusable elements sat on those grounds — the hero CTAs, the modality accordion heads
and wipe sliders, the "Why Precision" links, the chat launcher and panel header, the ribbon.

The two requirements genuinely conflict: one colour cannot be both dark enough for AA text
on white and light enough for 3:1 against navy. **Fix is a surface-aware token**, not a
compromise colour:

```css
:root{ --focus: #96600F; }
:focus-visible{ outline: 3px solid var(--focus); outline-offset: 3px; }

/* navy grounds re-point it at the lift */
.hero, .mod, .why, .chat-hd, .chat-fab, .ribbon{ --focus: var(--amber-lift); }
```

`#EBAA44` measures 5.84–8.78:1 on those three navies. Verified by walking every focusable
element and computing its ring against its actual composited background: **0 under 3:1 in
both themes.**

---

## P3 — Typography was 30 ad-hoc sizes, not a scale

32 `font-size` declarations produced 30 distinct rendered sizes. The step ratios give it
away — a real scale has consistent ratios; this had:

```
1.006, 1.011, 1.011, 1.012, 1.012, 1.013, 1.013, 1.013, 1.014, 1.015 ...
```

A 1.006 ratio is **0.1px**. These weren't decisions, they were drift — and a good share of
it was mine, accumulated over the legibility passes. Eight sizes between 16.6px and 18.0px
coexisted with no rule about which to use where.

**Fix — a declared scale, with every declaration mapped onto it:**

```css
--fs-3xs: 0.750rem;   /* 12px  image overlay tags (floor) */
--fs-2xs: 0.8125rem;  /* 13px  tracked micro-labels, eyebrows */
--fs-xs:  0.875rem;   /* 14px  meta, captions, chips */
--fs-sm:  0.9375rem;  /* 15px  secondary / supporting body */
--fs-base:1.000rem;   /* 16px  UI body  (prose body is 18px, set on <body>) */
--fs-md:  1.0625rem;  /* 17px  emphasised body */
--fs-lg:  1.1875rem;  /* 19px  card titles */
--fs-xl:  1.3125rem;  /* 21px  h3 / panel headings */
--fs-2xl: 1.500rem;   /* 24px  form card heading */
```

72 declarations, 31 source values, now resolving to 9 tokens. `h1`, `h2` and five
deliberate fluid `clamp()` steps stay outside the scale; that is intentional and commented.

Two hierarchy decisions inside this:

- **`h3` was stepped up**, 19.2px → 21px. Mechanical nearest-neighbour snapping wanted to
  take it *down*, which would have narrowed the h2→h3 gap and flattened the hierarchy the
  brief asks about. Rounding is not a substitute for judgment.
- **12px is now a hard floor.** The mobile `.wipe-tag` was 9.3px. For an audience the brief
  describes as "the older crowd", that is not a small style issue.

### The mistake I made here, and caught

My first version of this scale was wrong by 11%. I wrote it assuming `1rem = 18px` because
`font-size: 18px` is set on `<body>` — but `rem` resolves against `<html>`, which is at the
16px default. The scale rendered smaller than specified and pushed six labels under 12px.

The regression run caught it (`tinyText` went 3 → 9 instead of 3 → 0). I rebuilt the scale
from the backup with correct px math. The current numbers in the comment block are the real
rendered sizes, verified in the browser.

---

## P4 — Spacing had 32 gap values and 34 padding values with no system

`gap` alone used 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 22, 24, 26, 30, 32, 34,
36, 40 px. `margin-top` used 26, 28, 30 and 34 px in the same vertical rhythm — four
near-identical values doing one job.

**Fix — a two-tier scale**, tighter where the eye is sensitive:

```css
--sp-1:  4px;  --sp-1h:  6px; --sp-2:  8px; --sp-2h: 10px; --sp-3: 12px;
--sp-3h:14px;  --sp-4:  16px; --sp-5: 20px; --sp-6:  24px; --sp-7: 32px;
--sp-8: 40px;  --sp-9:  48px; --sp-10:56px; --sp-11: 64px;
```

102 values re-snapped: `5→6, 7→8, 9→10, 11→12, 13→14, 15→16, 18→20, 22→24, 26→24, 28→32,
30→32, 34→32, 36→40, 42→40, 44→48, 46→48, 54→56, 58→56`.

**Sub-4px values were deliberately excluded.** The first pass snapped seven of them to 4px
and I reverted it: `margin-top: 1px` on an icon next to text is an *optical baseline
correction*, not layout spacing. Tripling it visibly misaligns the icon it exists to fix.
Those stay literal, with a comment saying why.

Net effect on page height: +0.9% to +1.7%. No overflow introduced at any breakpoint.

---

## P5 — Footer column sized 1.5fr for content capped at 34ch

`grid-template-columns: 1.5fr 1fr 1fr` gave column one 436px at desktop, but its only text
is `.blurb` with `max-width: 34ch` ≈ 280px. The leftover ~150px read as a misalignment
between the brand block and the "Contact" column rather than as intentional whitespace.

Changed to `1fr 1fr 1fr`. The blurb now nearly fills its column and the three columns
distribute evenly.

---

## P6 — The longest reading passage was a step below every other body block

`.det-block p` — the modality detail copy, the longest prose on the page after the bio —
sat at 15.5px while comparable body blocks ran 16–17.6px. Lifted one step to
`var(--fs-base)` (16px). Contained to that section; no effect elsewhere.

---

## Verification

Every number below was re-measured after the final change, not carried over:

```
contrast, light theme       0 real failures  (see note)
contrast, dark theme        0 failures
focus rings, both themes    0 under 3:1
touch targets 375/768/1280  0 under 24x24
horizontal overflow         none at 375 / 768 / 1280
text under 12px             0 at all three widths
interaction smoke test      10/10 pass
```

Smoke test covers: mobile menu open/close, menu closes on link, treatment tabs, accordion
single-open behaviour, both drag-to-compare sliders, lightbox open + Escape, FAQ toggle,
chat open/close. No JS errors.

**Note on the three remaining "failures".** The light-theme scan still reports
`.photo-tag b` at 1.13:1 and its two spans at 1.98 / 3.05:1. These are **false positives**
from my own parser: the element's background is `color(srgb 1 1 1 / 0.94)`, modern CSS
colour syntax that the regex reads as `rgb(1,1,1)` — near-black. Verified directly: the
text is `#0C1E33` and `#4C6379` on 94% white, which is roughly 16.5:1 and 6.0:1. Both pass
comfortably. I checked rather than "fixing" text that was never broken.

---

## Reviewed and deliberately not changed

- **Chat launcher overlaps body text at mobile.** The fixed FAB passes over long lines at
  certain scroll positions. This is inherent to any floating action button, the FAB carries
  a shadow that separates it from content, and the alternatives (reserving a permanent
  bottom-right gutter across the whole page) cost more than the problem.
- **Five fluid `clamp()` font sizes stay off the scale.** `.lede`, `.panel-head h3` and
  three section headings are deliberately fluid between breakpoints. Snapping them to fixed
  steps would lose that. `.lede`'s endpoints were tied to `--fs-lg` / `--fs-xl` where they
  already landed on-scale.
- **`--amber-fill` unchanged.** Covered in P1 — it passes in the role it actually occupies.
- **`backdrop-filter` on the sticky header.** Measured at 6× CPU throttle during the
  performance audit and found to cost nothing (16.7ms median, identical to a solid
  background). See PERF_AUDIT.md §4.

---

## Carries over to the Next.js port

These tokens should land in `globals.css` under Tailwind v4's `@theme` block, not be
re-derived by hand:

1. The nine type steps become `--text-*` entries; the fourteen space steps become
   `--spacing-*`. Tailwind v4 reads them directly, so `text-sm` / `p-4` resolve to the same
   values the preview uses.
2. `--amber-on-light` and `--focus` must survive the port as separate tokens. Both encode a
   constraint that is invisible in the markup (white-in-every-theme plates; the AA-text vs
   3:1-non-text conflict) and both will be silently reintroduced as bugs if someone
   "simplifies" them back to one accent colour.
3. The 12px floor is worth an ESLint/stylelint rule rather than a comment.
4. **Font licensing is still open.** The scale is tuned against Avenir Next metrics, which
   only Apple devices have. Everyone else gets Figtree, whose x-height differs — the 15px
   and 16px steps will read slightly differently there. Worth resolving before this is
   treated as final.
