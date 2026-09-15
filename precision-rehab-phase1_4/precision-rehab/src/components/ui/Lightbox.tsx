"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  onClose: () => void;
};

/**
 * Full-size diagram viewer. Mounted only while `src` is set, so the large
 * diagram is not requested until someone asks for it.
 */
export function Lightbox({ src, alt, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!src) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="lightbox"
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
          style={{ width: "20px", height: "20px" }}
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="lightbox-note">Tap anywhere to close</p>
    </div>
  );
}
