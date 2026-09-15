"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";

export type WipeCopy = {
  a: [string, string];
  mid: [string, string];
  b: [string, string];
};

type Panel = { src: string; width: number; height: number; alt: string };

type Props = {
  heading: string;
  copy: WipeCopy;
  before: Panel;
  after: Panel;
  labels: [string, string];
  rangeLabel: string;
  chips: { at: number; label: string }[];
  hint: string;
  /** intrinsic aspect ratio of the panels, as a CSS ratio string */
  ratio: string;
  maxWidth?: string;
  onZoom?: () => void;
};

/**
 * Drag-to-compare figure. The divider sits at `value`%, with state A filling
 * the left and state B the right — so progress toward B is however much sits
 * to the RIGHT of the handle, i.e. 100 - value. Reading the handle position
 * directly inverts the caption, which is exactly the bug this comment exists
 * to stop someone reintroducing.
 *
 * The range input is a transparent overlay across the whole frame rather than
 * a visible slider, so the whole image is the drag surface. It keeps a real
 * <input type="range">, so it is keyboard-operable and announced correctly.
 */
export function WipeCompare({
  heading,
  copy,
  before,
  after,
  labels,
  rangeLabel,
  chips,
  hint,
  ratio,
  maxWidth,
  onZoom,
}: Props) {
  const [value, setValue] = useState(50);

  const progress = 100 - value;
  const key = progress < 38 ? "a" : progress < 62 ? "mid" : "b";
  const [capTitle, capBody] = copy[key];

  const frameStyle = {
    "--x": `${value}%`,
    "--wratio": ratio,
    ...(maxWidth ? { "--wmax": maxWidth } : {}),
  } as CSSProperties;

  return (
    <figure className="wipe">
      <h4 dangerouslySetInnerHTML={{ __html: heading }} />
      <div className="wipe-frame" style={frameStyle}>
        <Image
          src={before.src}
          alt={before.alt}
          width={before.width}
          height={before.height}
        />
        <div className="wipe-after">
          <Image
            src={after.src}
            alt={after.alt}
            width={after.width}
            height={after.height}
          />
        </div>
        <span className="wipe-tag wipe-tag-l">{labels[0]}</span>
        <span className="wipe-tag wipe-tag-r">{labels[1]}</span>
        <div className="wipe-line" aria-hidden="true">
          <span className="wipe-grip">
            <svg
              className="ico"
              viewBox="0 0 24 24"
              style={{ width: "19px", height: "19px" }}
            >
              <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
            </svg>
          </span>
        </div>
        <input
          className="wipe-range"
          type="range"
          min={5}
          max={95}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={rangeLabel}
        />
        {onZoom && (
          <button
            className="wipe-zoom"
            type="button"
            onClick={onZoom}
            aria-label="Open the full diagram"
          >
            <svg
              className="ico"
              viewBox="0 0 24 24"
              style={{ width: "16px", height: "16px" }}
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </button>
        )}
      </div>
      <figcaption className="wipe-cap">
        <b>{capTitle}</b>
        <span>{capBody}</span>
      </figcaption>
      <ul className="wipe-chips">
        {chips.map((c) => (
          <li key={c.label} className={progress >= c.at ? "on" : undefined}>
            <span className="dotk" />
            {c.label}
          </li>
        ))}
      </ul>
      <p className="wipe-hint">
        <svg
          className="ico"
          viewBox="0 0 24 24"
          style={{ width: "15px", height: "15px" }}
        >
          <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
        </svg>
        {hint}
      </p>
    </figure>
  );
}
