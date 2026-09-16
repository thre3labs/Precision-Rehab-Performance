"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { treatmentCategories } from "@/lib/content";

/**
 * "How we can help" — the same card anatomy as the Recovery Technology
 * accordion below it: image, title, summary, amber tag, and a plus that opens
 * the detail. The two sections are meant to read as siblings.
 *
 * One deliberate difference: the first panel starts open. Recovery Technology
 * opens fully collapsed because it is supporting detail, but this section is
 * the clinic's core services — three closed bars would say nothing about what
 * the practice actually does.
 *
 * Panels are `hidden` rather than unmounted, so every treatment stays in the
 * server-rendered HTML for search engines; opening one is a visual toggle, not
 * a fetch. Closing the open panel changes the page height above the one being
 * opened, so openPanel scrolls its header back under the sticky bar.
 */
export function Treatments() {
  const [open, setOpen] = useState<string | null>(
    treatmentCategories[0]?.title ?? null,
  );
  const heads = useRef<Record<string, HTMLButtonElement | null>>({});
  const firstPaint = useRef(true);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    // don't yank the page on first render — only on a real interaction
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    if (!open) return;
    const head = heads.current[open];
    if (!head) return;
    const raf = requestAnimationFrame(() => {
      const bar = document.querySelector(".hdr");
      const offset = (bar instanceof HTMLElement ? bar.offsetHeight : 0) + 14;
      const y = head.getBoundingClientRect().top + window.scrollY - offset;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  return (
    <section className="treat" id="treatments">
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">How we can help</span>
            <h2>Get back on track with precision.</h2>
            <p className="lede">
              Whether you&rsquo;re dealing with pain, recovering from surgery,
              or trying to get back to the activities you love, we&rsquo;ll help
              you move better, feel stronger, and get back to doing what matters
              most.
            </p>
          </div>
        </div>

        <div className="acc acc-treat">
          {treatmentCategories.map((c, i) => {
            const isOpen = open === c.title;
            const panelId = `treat-panel-${i}`;
            return (
              <article className="acc-item" key={c.title}>
                <h3 className="acc-h">
                <button
                  className="acc-head"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(c.title)}
                  ref={(el) => {
                    heads.current[c.title] = el;
                  }}
                >
                  <Image
                    className="acc-thumb wide"
                    src={c.image.src}
                    alt=""
                    width={c.image.width}
                    height={c.image.height}
                  />
                  <span className="acc-title">
                    <b>{c.title}</b>
                    <span>{c.description}</span>
                    {c.note && <span className="dev">{c.note}</span>}
                  </span>
                  <span className="acc-plus" aria-hidden="true">
                    <svg
                      className="ico"
                      viewBox="0 0 24 24"
                      style={{ width: "17px", height: "17px" }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                </h3>

                <div className="acc-body" id={panelId} hidden={!isOpen}>
                  <ul className="items">
                    {c.items.map((item) => (
                      <li key={item.name}>
                        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <div>
                          <b>{item.name}</b>
                          {item.blurb && <span>{item.blurb}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <p className="treat-foot">
          Most plans of care combine several of these, built around what your
          assessment actually shows.
        </p>
      </div>
    </section>
  );
}
