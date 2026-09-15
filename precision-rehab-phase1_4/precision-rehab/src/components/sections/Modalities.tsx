"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { modalities } from "@/lib/content";
import { WipeCompare, type WipeCopy } from "@/components/ui/WipeCompare";
import { Lightbox } from "@/components/ui/Lightbox";

/**
 * "Advanced Recovery Technology". Every panel is collapsed by default: the
 * detail here is heavy and shipping it open turns the page into a scroll.
 *
 * One panel open at a time. Closing the previously open panel changes the page
 * height *above* the one being opened, so the newly opened header would end up
 * somewhere arbitrary — usually below the fold. openPanel() therefore scrolls
 * its header back under the sticky bar after layout settles.
 *
 * Panel bodies are `hidden` (display:none) rather than unmounted, so their
 * content stays in the server-rendered HTML for crawlers. That also means the
 * lazy images inside them genuinely do not download until a panel is opened:
 * a display:none element has no layout box, so it is never "near the viewport".
 */

const DN_COPY: WipeCopy = {
  a: [
    "The problem",
    "A taut band forms around a hyperirritable nodule. Blood flow through the area is restricted, the motor end-plate misfires, and the pain receptor stays switched on.",
  ],
  mid: [
    "The moment of release",
    "The needle reaches the trigger point and the muscle answers with a local twitch response, the involuntary flick that signals the taut band letting go.",
  ],
  b: [
    "The result",
    "Muscle fibres relax and lengthen, blood flow returns through the released tissue, nociceptive signalling drops, and end-plate activity normalizes.",
  ],
};

const LASER_COPY: WipeCopy = {
  a: [
    "Class III — very shallow",
    "A Class III probe has to touch the skin, and its energy fades in the outermost layers. Most of the dose never reaches the tissue that actually hurts.",
  ],
  mid: [
    "Where the difference shows",
    "Where a Class III beam has already run out, a Class IV beam is still travelling — down through the dermis and into the fat beneath it.",
  ],
  b: [
    "Class IV — safe, efficient and deep",
    "At 980 / 810 nm and 10,000 mW the beam works contact-free and carries a therapeutic dose the whole way down to muscle.",
  ],
};

export function Modalities() {
  const [open, setOpen] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const heads = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
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
    <section className="mod" id="modalities">
      <div className="mod-bg" aria-hidden="true" />
      <div className="mod-tint" aria-hidden="true" />
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">Advanced recovery technology</span>
            <h2>Clinical tools, used with intent.</h2>
            <p className="lede">
              Three technologies Dr. Patel uses alongside hands-on care to calm
              pain and speed tissue healing. Open any one for what it does, what
              it treats, and what a session actually feels like.
            </p>
          </div>
        </div>

        <div className="acc">
          {modalities.map((m) => {
            const isOpen = open === m.id;
            return (
              <article className="acc-item" key={m.id}>
                <button
                  className="acc-head"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`mp-${m.id}`}
                  onClick={() => toggle(m.id)}
                  ref={(el) => {
                    heads.current[m.id] = el;
                  }}
                >
                  <Image
                    className={`acc-thumb${m.thumb.product ? " product" : ""}`}
                    src={m.thumb.src}
                    alt=""
                    width={m.thumb.width}
                    height={m.thumb.height}
                  />
                  <span className="acc-title">
                    <b>{m.name}</b>
                    <span>{m.summary}</span>
                    <span className="dev">{m.device}</span>
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

                <div className="acc-body det" id={`mp-${m.id}`} hidden={!isOpen}>
                  {m.id === "shock" ? (
                    <div className="det-intro">
                      <p className="det-lede">{m.lede}</p>
                      <figure className="det-unit">
                        <Image
                          src="/images/shockwave-unit.jpg"
                          alt="The Chattanooga Intelect RPW 2 shockwave unit on its mobile stand"
                          width={560}
                          height={782}
                        />
                        <figcaption>
                          Chattanooga
                          <br />
                          Intelect&reg; RPW 2
                        </figcaption>
                      </figure>
                    </div>
                  ) : (
                    <p className="det-lede">{m.lede}</p>
                  )}

                  <div className="det-grid">
                    <div>
                      <h4>Benefits</h4>
                      <ul>
                        {m.benefits.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    {m.treats ? (
                      <div>
                        <h4>{m.treatsHeading ?? "Commonly treats"}</h4>
                        <ul className={typeof m.treats[0] === "string" ? undefined : "tx"}>
                          {m.treats.map((t) =>
                            typeof t === "string" ? (
                              <li key={t}>{t}</li>
                            ) : (
                              /* the <li> is a 2-column grid, so the name and
                                 note must share one child or the note gets
                                 squeezed into the 16px bullet column */
                              <li key={t.name}>
                                <span>
                                  <b>{t.name}</b>
                                  <i>{t.note}</i>
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        {m.after && (
                          <>
                            <h4>After treatment</h4>
                            <ul className="warn">
                              {m.after.map((a) => (
                                <li key={a}>{a}</li>
                              ))}
                            </ul>
                          </>
                        )}
                        {m.risks && (
                          <>
                            <h4 style={{ marginTop: "22px" }}>Risks</h4>
                            <ul className="warn">
                              {m.risks.map((r) => (
                                <li key={r}>{r}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {m.id === "shock" && (
                    <figure className="det-fig">
                      <Image
                        src="/images/shockwave-action.jpg"
                        alt="A shockwave probe being applied to a patient's knee during treatment"
                        width={900}
                        height={611}
                      />
                      <figcaption>
                        The handpiece is worked over the treatment area with gel,
                        delivering 2,000&ndash;3,000 pressure waves per session.
                      </figcaption>
                    </figure>
                  )}

                  {m.id === "dn" && (
                    <WipeCompare
                      heading="The mechanism &mdash; drag to compare"
                      copy={DN_COPY}
                      ratio="1000/803"
                      before={{
                        src: "/images/dn-panel-before.jpg",
                        width: 1000,
                        height: 803,
                        alt: "Muscle tissue with a myofascial trigger point: a taut band, a hyperirritable nodule, restricted blood flow, a sensitized pain receptor and motor end-plate dysfunction",
                      }}
                      after={{
                        src: "/images/dn-panel-after.jpg",
                        width: 1000,
                        height: 803,
                        alt: "The same muscle after needle insertion: relaxed fibres, a local twitch response, improved blood flow, reduced nociceptive signalling and normalized end-plate activity",
                      }}
                      labels={["Before", "After"]}
                      rangeLabel="Drag to compare the muscle before and after dry needling"
                      chips={[
                        { at: 18, label: "Decreases pain" },
                        { at: 34, label: "Relaxes tight muscles" },
                        { at: 50, label: "Improves blood flow" },
                        { at: 66, label: "Normalizes nerve activity" },
                        { at: 82, label: "Helps you move better" },
                      ]}
                      hint="Drag the handle left to reveal the treated muscle · tap the arrows to enlarge"
                      onZoom={() => setZoom("/images/dn-diagram.jpg")}
                    />
                  )}

                  {m.id === "laser" && (
                    <WipeCompare
                      heading="Class III vs Class IV &mdash; drag to compare depth"
                      copy={LASER_COPY}
                      ratio="740/841"
                      maxWidth="430px"
                      before={{
                        src: "/images/laser-classiii.jpg",
                        width: 740,
                        height: 841,
                        alt: "Cross-section of skin showing a Class III laser probe touching the surface, its energy reaching only the outermost layers",
                      }}
                      after={{
                        src: "/images/laser-classiv.jpg",
                        width: 740,
                        height: 841,
                        alt: "The same cross-section with a contact-free Class IV laser, its beam reaching through the dermis and fat into muscle",
                      }}
                      labels={["Class III", "Class IV"]}
                      rangeLabel="Drag to compare how deep a Class III and a Class IV laser reach"
                      chips={[
                        { at: 12, label: "Epidermis" },
                        { at: 38, label: "Dermis" },
                        { at: 62, label: "Subcutaneous fat" },
                        { at: 84, label: "Muscle" },
                      ]}
                      hint="Drag the handle left to see how much deeper Class IV reaches"
                    />
                  )}

                  <div className="det-block">
                    <h4>What to expect</h4>
                    <p>{m.expect}</p>
                  </div>

                  {m.id !== "dn" && m.after && (
                    <div className="det-split">
                      <div>
                        <h4>After treatment</h4>
                        <ul className="warn">
                          {m.after.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      </div>
                      {m.notSuitable && (
                        <div>
                          <h4>{m.notSuitable.heading}</h4>
                          <ul className="warn">
                            {m.notSuitable.items.map((n) => (
                              <li key={n}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {m.id === "dn" && m.notSuitable && (
                    <div className="det-block">
                      <h4>{m.notSuitable.heading}</h4>
                      <ul className="warn" style={{ marginTop: "4px" }}>
                        {m.notSuitable.items.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="det-proto">
                    <b>Typical course</b>
                    <span>{m.protocol}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mod-foot">
          Not sure which applies to you? A free 15-minute screening is the
          fastest way to find out.
        </p>
      </div>

      <Lightbox
        src={zoom}
        alt="Full dry needling mechanism diagram"
        onClose={() => setZoom(null)}
      />
    </section>
  );
}
