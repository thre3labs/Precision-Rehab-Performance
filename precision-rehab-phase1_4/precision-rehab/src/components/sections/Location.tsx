import { site, serviceAreaTowns } from "@/lib/content";
import { ClinicTour } from "@/components/sections/ClinicTour";

const { address } = site;
const streetLine = `${address.line1}, ${address.line2}`;
const cityLine = `${address.city}, ${address.state} ${address.zip}`;

export function Location() {
  return (
    <section className="loc" id="location">
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">Visit the clinic</span>
            <h2>Physical therapy in {site.legalCity}, {site.legalState}.</h2>
            <p className="lede">
              Conveniently located in {site.legalCity} and proud to serve
              patients throughout Brevard County.
            </p>
          </div>
        </div>

        <div className="loc-card">
          {/* This panel held a drawn map — grid lines and an amber route
              that went nowhere. The clinic itself answers "visit the clinic"
              better than a diagram of streets that do not exist, and it costs
              the page no extra section. */}
          <div className="loc-map">
            <ClinicTour />
          </div>

          <div className="loc-info">
            <div className="loc-line">
              <PinIcon />
              <div>
                <b>{streetLine}</b>
                <span>{cityLine}</span>
              </div>
            </div>
            <div className="loc-line">
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <b>Hours</b>
                {/* Hours come from content.ts. The fallback stays: if they are
                    ever unset, say so plainly rather than showing nothing. */}
                <span>
                  {site.hours
                    ? site.hours.map((h) => `${h.days} ${h.time}`).join(" · ")
                    : "Hours coming soon. Call or text to confirm availability."}
                </span>
              </div>
            </div>
            <div className="loc-line">
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
              <div>
                <b>{site.phoneDisplay}</b>
                <span>Call or text the clinic</span>
              </div>
            </div>
            <a
              className="btn btn-ghost"
              href={site.mapLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ justifySelf: "start" }}
            >
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m3 11 19-9-9 19-2-8-8-2z" />
              </svg>
              Get directions
            </a>
            <div className="loc-serving">
              <span className="note">Proudly serving</span>
              <p>
                {serviceAreaTowns.join(" · ")}, and the surrounding Brevard
                County area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PinIcon({ size }: { size?: number }) {
  return (
    <svg
      className="ico"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
