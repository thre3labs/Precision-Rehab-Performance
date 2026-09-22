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
 * Plain <img>, not next/image, and deliberately. These are absolutely
 * positioned full-bleed layers inside sections whose height is set by their
 * content, so there is no stable rendered width for `sizes` to describe.
 * `fill` would need a parent with a known aspect ratio, which none of these
 * have. The sources are already optimised and everything below the fold is
 * lazy.
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
      {/* eslint-disable-next-line @next/next/no-img-element -- see the note above */}
      <img
        className="sec-ph"
        src={src}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
      <div className="sec-ph-tint" aria-hidden="true" />
      <div className={`sec-ph-scrim sec-ph-scrim--${scrim}`} aria-hidden="true" />
    </>
  );
}
