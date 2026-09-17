"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  onClose: () => void;
};

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-size diagram viewer. Mounted only while `src` is set, so the large
 * diagram is not requested until someone asks for it.
 *
 * This declares aria-modal, so it has to behave like one: focus moves in on
 * open, cannot Tab out to the page behind, and returns to whatever opened it
 * on close. Claiming aria-modal without containing focus is worse than not
 * claiming it — a screen reader tells the user the rest of the page is inert
 * while their keyboard says otherwise.
 */
export function Lightbox({ src, alt, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      // wrap at both ends, and pull focus back if it has escaped entirely
      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!src) return;
    returnTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("keydown", handleKey, true);
      // send the user back where they were, not to the top of the document
      returnTo.current?.focus?.();
    };
  }, [src, handleKey]);

  if (!src) return null;

  return (
    <div
      className="lightbox"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <Image src={src} alt={alt} width={1400} height={1050} />
      <button
        className="lightbox-x"
        type="button"
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          className="ico"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: "20px", height: "20px" }}
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="lightbox-note">Tap anywhere to close</p>
    </div>
  );
}
