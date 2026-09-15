import { screening } from "@/lib/content";
import { ContactForm } from "@/components/sections/ContactForm";

/**
 * The form is the only client component in this section; everything to its
 * left is static and stays a server component.
 */
export function FreeScreening() {
  return (
    <section className="screen" id="screening">
      <div className="wrap screen-grid">
        <div>
          <div className="axis">
            <div className="axis-rail" aria-hidden="true" />
            <div className="axis-body">
              <span className="note">Free 15-minute screening</span>
              <h2>Not sure if we&rsquo;re the right fit? Find out for free.</h2>
              <p className="lede">{screening.body}</p>
            </div>
          </div>

          <ul className="checks">
            {screening.bullets.map((b) => (
              <li key={b}>
                <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="modes">
            <span className="mode">
              <svg
                className="ico"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
              </svg>
              In person
            </span>
            <span className="mode">
              <svg
                className="ico"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="m23 7-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
              </svg>
              Virtual
            </span>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
