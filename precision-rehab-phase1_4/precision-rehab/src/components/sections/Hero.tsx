import type { CSSProperties } from "react";
import Image from "next/image";
import { site, provider } from "@/lib/content";

/**
 * The range-of-motion arc is the visual thesis of the design: assessment
 * before treatment. It is inline SVG rather than an image so the stroke
 * animation can run and so it inherits theme colours.
 */
export function Hero() {
  return (
    <section className="hero" style={{ paddingTop: "clamp(48px,6vw,88px)" }}>
      <div className="wrap hero-grid">
        <div>
          <span className="note hero-eyebrow">
            {site.legalCity}, {site.legalStateFull}
          </span>
          <h1>
            Precision care,
            <br />
            built around <em>you</em>.
          </h1>
          <p className="hero-sub">
            A cash-based outpatient physical therapy clinic led directly by{" "}
            <strong>{provider.name}</strong>. One-on-one, hands-on treatment for
            pain, injury recovery, and performance, with select insurance also
            accepted.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#screening">
              Book your free 15-minute screening
            </a>
            <a className="btn btn-ghost-dark" href={site.phoneHref}>
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
              {site.phoneDisplay}
            </a>
          </div>
          <p className="hero-fine">
            <svg
              className="ico"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ width: "17px", height: "17px" }}
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            In person in {site.legalCity} or virtually &nbsp;·&nbsp; No
            obligation
          </p>
        </div>

        <div>
          <div className="rom">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-label="Range-of-motion arc, illustrating measured assessment"
            >
              {/* degree ticks every 15 degrees across a 180 degree sweep */}
              <g className="rom-tick">
                <line x1="200" y1="30" x2="200" y2="48" />
                <line x1="288" y1="53" x2="279" y2="69" />
                <line x1="353" y1="118" x2="337" y2="127" />
                <line x1="370" y1="200" x2="352" y2="200" />
                <line x1="353" y1="282" x2="337" y2="273" />
                <line x1="288" y1="347" x2="279" y2="331" />
                <line x1="200" y1="370" x2="200" y2="352" />
                <line x1="112" y1="347" x2="121" y2="331" />
                <line x1="47" y1="282" x2="63" y2="273" />
                <line x1="30" y1="200" x2="48" y2="200" />
              </g>

              {/* outer measurement ring */}
              <circle
                cx="200"
                cy="200"
                r="152"
                fill="none"
                stroke="rgba(234,241,248,.14)"
                strokeWidth="1.5"
              />

              {/* the swept arc: 0 -> 135 degrees */}
              <path
                className="rom-arc"
                style={{ "--len": "520", animationDelay: ".15s" } as CSSProperties}
                d="M 48 200 A 152 152 0 0 1 307 92"
                stroke="#EBAA44"
                strokeWidth="6"
              />

              {/* inner secondary arc */}
              <path
                className="rom-arc"
                style={{ "--len": "300", animationDelay: ".45s" } as CSSProperties}
                d="M 90 200 A 110 110 0 0 1 200 90"
                stroke="rgba(234,241,248,.42)"
                strokeWidth="2.5"
              />

              {/* radii */}
              <line
                x1="200"
                y1="200"
                x2="48"
                y2="200"
                stroke="rgba(234,241,248,.22)"
                strokeWidth="1.5"
              />
              <line
                x1="200"
                y1="200"
                x2="307"
                y2="92"
                stroke="rgba(235,170,68,.55)"
                strokeWidth="1.5"
              />

              <text className="rom-lab" x="22" y="228" textAnchor="start">
                0°
              </text>
              <text className="rom-lab" x="322" y="82">
                135°
              </text>
            </svg>
            <Image
              className="rom-mark"
              src="/images/mark-transparent.png"
              alt=""
              width={681}
              height={740}
              priority
            />
          </div>
          <p className="rom-cap">
            Assessment first. <b>Every plan starts with measurement.</b>
          </p>
        </div>
      </div>
    </section>
  );
}
