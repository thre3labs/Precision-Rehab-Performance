import { site } from "@/lib/content";

/**
 * Fixed bottom bar below 1140px. It hides at exactly the width the header's
 * own "Free Screening" button appears, so there is never a viewport with no
 * visible primary action. The 3px icon-to-label gap is an optical nudge, not
 * a spacing-scale value — see DESIGN_AUDIT.md.
 */
export function MobileCTABar() {
  return (
    <nav className="mbar" aria-label="Quick contact">
      <a href={site.phoneHref}>
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" style={{ width: "20px", height: "20px" }}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        </svg>
        Call
      </a>
      <a href={site.smsHref}>
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" style={{ width: "20px", height: "20px" }}>
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20.5l1.5-4.7A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
        </svg>
        Text
      </a>
      <a className="go" href="#screening">
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" style={{ width: "20px", height: "20px" }}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
        </svg>
        Free Screening
      </a>
    </nav>
  );
}
