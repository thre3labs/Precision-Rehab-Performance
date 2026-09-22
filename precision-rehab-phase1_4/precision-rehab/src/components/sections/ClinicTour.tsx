"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clinicTour } from "@/lib/content";

/**
 * The clinic photo tour, inside the Location card's left panel.
 *
 * That panel used to be a drawing: grid lines and an amber route that went
 * nowhere. Eight photographs of the building answer "visit the clinic" better
 * than a diagram of streets that do not exist, and putting them here costs the
 * page no extra section.
 *
 * Deliberate choices, each of which has already been got wrong once:
 *
 * - No autoplay. A tour moves at the reader's pace, and auto-rotating
 *   carousels are an accessibility problem.
 * - CSS scroll-snap, not transforms. Touch swipe then works natively and the
 *   strip degrades to a usable horizontal scroller with JS off.
 * - `scrollLeft`, never `scrollIntoView`. The latter drags the whole page down
 *   to the carousel, which is not what pressing "next" asks for.
 * - The index is read from each slide's own offsetLeft rather than by dividing
 *   scrollLeft by a width. A fractional column width otherwise accumulates
 *   into an off-by-one, and the counter ends up a full slide ahead of the
 *   picture.
 * - Slide 1 eager, the rest lazy. Eight photographs is 1.2 MB of source; a
 *   visitor who never swipes should download one of them, not all eight.
 */
export function ClinicTour() {
  const strip = useRef<HTMLDivElement | null>(null);
  const slides = useRef<Array<HTMLElement | null>>([]);
  const [at, setAt] = useState(0);
  const n = clinicTour.length;

  const go = useCallback((i: number) => {
    const el = strip.current;
    const first = slides.current[0];
    const target = slides.current[Math.max(0, Math.min(n - 1, i))];
    if (!el || !first || !target) return;
    el.scrollLeft = target.offsetLeft - first.offsetLeft;
    setAt(Math.max(0, Math.min(n - 1, i)));
  }, [n]);

  // A drag or a swipe moves the strip without going through go(), so the
  // counter and the dots are re-read from where the strip actually landed.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        const first = slides.current[0];
        if (!first) return;
        const x = el.scrollLeft + first.offsetLeft;
        let best = 0;
        let bestD = Infinity;
        slides.current.forEach((s, i) => {
          if (!s) return;
          const d = Math.abs(s.offsetLeft - x);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setAt((prev) => (prev === best ? prev : best));
      }, 90);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (t) clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(n - 1); }
  }

  const pad = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div className="tour">
      <div
        className="tour-strip"
        ref={strip}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Inside the clinic"
        onKeyDown={onKeyDown}
      >
        {clinicTour.map((s, i) => (
          <figure
            className="tour-slide"
            key={s.src}
            ref={(el) => { slides.current[i] = el; }}
            aria-hidden={i !== at}
          >
            <Image
              className="tour-shot"
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(min-width: 880px) 46vw, 100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <figcaption>
              <span className="tour-num">{pad(i)}</span>
              <span className="tour-cap">{s.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="tour-bar">
        <span className="tour-count">
          {pad(at)} / {pad(n - 1)}
        </span>
        <div className="tour-dots">
          {clinicTour.map((s, i) => (
            <button
              type="button"
              key={s.src}
              aria-label={`Photograph ${i + 1} of ${n}`}
              aria-current={i === at}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="tour-nav">
          <button type="button" aria-label="Previous photograph" onClick={() => go(at - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="Next photograph" onClick={() => go(at + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
