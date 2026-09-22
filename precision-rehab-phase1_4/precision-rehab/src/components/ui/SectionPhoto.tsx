import Image from "next/image";

/**
 * A photograph dropped behind a navy section.
 *
 * Three layers, always in this order: the photograph, a flat 75% navy tint,
 * and a directional scrim. The tint alone cannot do the job — a single flat
 * overlay has to be dark enough for the worst pixel anywhere behind the text,
 * which means dark enough to hide the photograph everywhere. Weighting a
 * second gradient towards wherever the section prints its copy keeps the text
 * legible while letting the photograph read where nothing is printed.
 *
 * Every section here was measured before it was accepted: at 75% flat, body
 * copy fails WCAG AA in all of them; with the matching scrim on, the worst
 * measurement across the whole page is 4.90:1. See claude/photo-backgrounds.md
 * in the project for the full table.
 *
 * `scrim` picks the shape, and the shape is dictated by where the section puts
 * its text — not by taste:
 *
 *   hero    strong left-to-right ramp; the right column is only a diagram
 *   left    top wash plus a left ramp; heading left, cards full width
 *   even    top wash, gentle left; both columns are printed, nowhere to hide
 *   centre  a radial pool; everything is centred, so there is no side
 *
 * ---------------------------------------------------------------------------
 * On next/image, and on the reasoning that was here before.
 *
 * This used to be a plain <img>, on two stated grounds, and both were wrong:
 *
 *   "There is no stable rendered width for `sizes` to describe."
 *       There is. These are full-bleed layers. `sizes="100vw"` describes them
 *       exactly, because the rendered width IS the viewport width.
 *
 *   "`fill` would need a parent with a known aspect ratio."
 *       It does not. `fill` needs a positioned ancestor, and .hero, .treat,
 *       .why and .closer all already set `position: relative` — they have to,
 *       or the layers below would resolve `inset: 0` against the viewport.
 *       Aspect ratio is irrelevant when the image is `object-fit: cover`.
 *
 * The cost of that mistake was measurable: PageSpeed put the hero's LCP at
 * 5.4s and flagged 309 KiB of image-delivery savings, because a 1400px JPEG
 * was being handed unchanged to a phone. Routing through next/image picks up
 * the AVIF/WebP negotiation and the deviceSizes ladder already configured in
 * next.config.ts, and `priority` emits a <link rel="preload"> so the hero
 * starts downloading from the head rather than from the parser.
 *
 * `quality` is 65 rather than the default 75. These photographs sit under a
 * 75% navy tint plus a gradient; compression artefacts that would be visible
 * on a bare photo are not visible through that, and the bytes are real. The
 * value has to be listed in `images.qualities` in next.config.ts — Next 16
 * rejects any quality not declared there.
 * ---------------------------------------------------------------------------
 */
type Props = {
  src: string;
  scrim: "hero" | "left" | "even" | "centre";
  /** CSS object-position. Chosen per photograph, not guessed per section. */
  position?: string;
  /** Only the hero is above the fold. Everything else waits. */
  priority?: boolean;
};

export function SectionPhoto({ src, scrim, position, priority = false }: Props) {
  return (
    <>
      <Image
        className="sec-ph"
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={65}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        style={position ? { objectPosition: position } : undefined}
      />
      <div className="sec-ph-tint" aria-hidden="true" />
      <div className={`sec-ph-scrim sec-ph-scrim--${scrim}`} aria-hidden="true" />
    </>
  );
}
