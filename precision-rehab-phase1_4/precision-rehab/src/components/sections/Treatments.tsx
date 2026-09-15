"use client";

import { useState } from "react";
import { treatmentCategories } from "@/lib/content";

/**
 * Every panel stays in the markup at all times and only the inactive ones
 * carry `hidden`, so all three categories are in the server-rendered HTML for
 * crawlers. Switching tabs is a pure visual toggle, not a fetch or unmount.
 *
 * The segmented control is a pill only while the tabs fit on one line; once
 * they wrap, a 999px radius turns the container into a giant lozenge, so it
 * softens to a rounded rectangle below 880px (see globals.css).
 */
export function Treatments() {
  const [active, setActive] = useState(0);

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

        <div className="seg" role="tablist" aria-label="Treatment categories">
          {treatmentCategories.map((c, i) => (
            <button
              key={c.title}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-controls={`pan-${i}`}
              aria-selected={i === active}
              onClick={() => setActive(i)}
            >
              {c.title}
            </button>
          ))}
        </div>

        {treatmentCategories.map((c, i) => (
          <div
            key={c.title}
            className="panel"
            id={`pan-${i}`}
            role="tabpanel"
            aria-labelledby={`tab-${i}`}
            hidden={i !== active}
          >
            <div className="panel-head">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              {c.note && <span className="tag">{c.note}</span>}
            </div>
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
        ))}
      </div>
    </section>
  );
}
