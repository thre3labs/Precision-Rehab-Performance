import Image from "next/image";
import { site } from "@/lib/content";

/**
 * The footer plate is white in every theme (the transparent logo art is navy,
 * so the plate supplies its own white ground). That is why the section
 * headings resolve --amber-on-light rather than --amber — see globals.css.
 */

const EXPLORE = [
  { href: "#conditions", label: "Conditions We Treat" },
  { href: "#treatments", label: "Treatments" },
  { href: "#modalities", label: "Recovery Technology" },
  { href: "#about", label: "About Us" },
  { href: "#why", label: "Why Precision Rehab" },
  { href: "#screening", label: "Free 15-Min Screening" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <Image
              className="brand-img"
              src="/images/logo-transparent.png"
              alt={site.name}
              width={1876}
              height={750}
            />
            <p className="blurb">
              Cash-based outpatient physical therapy in {site.legalCity},{" "}
              {site.legalState}. Individualized, one-on-one care focused on
              getting you back to the life and activities you care about.
            </p>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={site.smsHref}>Text the clinic</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                {site.address.line1}, {site.address.line2}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </li>
            </ul>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {EXPLORE.map((e) => (
                <li key={e.href}>
                  <a href={e.href}>{e.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ftr-bot">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            The information on this website is for general informational
            purposes only and is not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult a qualified provider
            regarding a medical condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
