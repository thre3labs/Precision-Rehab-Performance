import { faqs } from "@/lib/content";
import { buildFaqSchema } from "@/lib/schema";

/**
 * Native <details>, so the answers are in the DOM and expandable with no
 * JavaScript at all. The chevron rotates the inner <svg> rather than the
 * circular wrapper: rotating a 34px square 45deg grows its layout box to
 * 48.1px and pushed 7px past the container. See DESIGN_AUDIT.md.
 */
export function FAQ() {
  return (
    <section className="faq" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">FAQ</span>
            <h2>Common questions.</h2>
          </div>
        </div>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={f.question} open={i === 0}>
              <summary>
                {f.question}
                <span className="chev">
                  <svg
                    className="ico"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    style={{ width: "15px", height: "15px" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
