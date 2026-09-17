"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";

/**
 * Sticky header. Client-side only because of the mobile menu; the nav itself
 * is plain markup, so it stays in the server-rendered HTML for crawlers.
 *
 * The desktop/mobile breakpoint is 1140px, not the more obvious 1024px: the
 * full nav plus the phone number plus the CTA needs ~1140px, and switching
 * earlier pushed the header 62px past the viewport at 1024px. The mobile CTA
 * bar uses the same 1140px boundary so there is never a width with no visible
 * "Free Screening" action. See DESIGN_AUDIT.md.
 *
 * Phase 2: swap the `href="#id"` values for real routes once Treatments /
 * About / Conditions become standalone pages. Markup and styling stay.
 */

const NAV = [
  { href: "#conditions", short: "Conditions", long: "Conditions We Treat" },
  { href: "#treatments", short: "Treatments", long: "Treatments" },
  { href: "#modalities", short: "Technology", long: "Recovery Technology" },
  { href: "#about", short: "About Us", long: "About Us" },
  { href: "#why", short: "Why Precision", long: "Why Precision Rehab" },
  { href: "#faq", short: "FAQ", long: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1140) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link className="brand" href="/" aria-label={`${site.name}, home`}>
          <Image
            className="brand-img"
            src="/images/logo-transparent.png"
            alt={site.name}
            width={1876}
            height={750}
            priority
          />
        </Link>

        <nav className="hdr-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.short}
            </a>
          ))}
        </nav>

        <div className="hdr-act">
          <a className="hdr-tel" href={site.phoneHref}>
            <PhoneIcon />
            {site.phoneDisplay}
          </a>
          <a
            className="btn btn-primary"
            href="#screening"
            style={{ minHeight: "48px", padding: "0 22px", fontSize: "var(--fs-sm)" }}
          >
            Free Screening
          </a>
        </div>

        <div className="hdr-mob">
          <a
            className="hdr-tel-sm"
            href={site.phoneHref}
            aria-label={`Call ${site.name}`}
          >
            <PhoneIcon />
          </a>
          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="mobnav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>

      <nav
        className="mobnav"
        id="mobnav"
        aria-label="Primary"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.long}
          </a>
        ))}
        <a className="mob-cta" href="#screening">
          Book Your Free Screening
        </a>
      </nav>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
