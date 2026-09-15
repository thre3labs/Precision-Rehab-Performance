import { site } from "@/lib/content";

export function FinalCTA() {
  return (
    <section className="closer">
      <div className="wrap">
        <h2>Ready to get back to what you love?</h2>
        <p>
          Schedule your free 15-minute screening with {site.shortName}&rsquo;s
          Dr. Patel, in person in {site.legalCity}, {site.legalState} or
          virtually. No obligation.
        </p>
        <a className="btn btn-primary" href="#screening">
          Book your free screening
        </a>
      </div>
    </section>
  );
}
