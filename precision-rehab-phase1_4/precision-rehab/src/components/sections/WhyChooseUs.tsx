import { differentiators, comparison } from "@/lib/content";
import { SectionPhoto } from "@/components/ui/SectionPhoto";

/**
 * Navy ground. The section re-points --focus at --amber-lift, because the
 * AA-compliant dark amber drops to 2.2:1 against this background — below the
 * 3:1 SC 1.4.11 requires of a focus indicator. See globals.css.
 */
export function WhyChooseUs() {
  return (
    <section className="why" id="why">
      <SectionPhoto
        src="/images/clinic/waiting.jpg"
        scrim="even"
        position="center 44%"
      />
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">Why Precision Rehab &amp; Performance</span>
            <h2>A different model from traditional, high-volume PT.</h2>
            <p className="lede">
              Many outpatient clinics are built to move as many patients through
              the door as possible. Precision Rehab &amp; Performance is built
              the opposite way, around one patient at a time.
            </p>
          </div>
        </div>

        <div className="why-grid">
          <ul className="diffs">
            {differentiators.map((d) => (
              <li key={d.title}>
                <span className="dot">
                  <CheckIcon />
                </span>
                <div>
                  <b>{d.title}</b>
                  <span>{d.description}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="compare">
            <span className="note">Traditional PT vs. Precision Rehab</span>
            {comparison.map((row) => (
              <div className="crow" key={row.label}>
                <div className="crow-lab">{row.label}</div>
                <div className="crow-pair">
                  <div className="cside no">
                    <CrossIcon />
                    <span>{row.traditional}</span>
                  </div>
                  <div className="cside yes">
                    <CheckIcon small />
                    <span>{row.precision}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ small }: { small?: boolean }) {
  return (
    <svg
      className="ico"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={
        small
          ? { width: "15px", height: "15px" }
          : { width: "15px", height: "15px", strokeWidth: "3" }
      }
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="ico"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: "15px", height: "15px" }}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
