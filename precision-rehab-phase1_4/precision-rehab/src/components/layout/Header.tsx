import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Phase 2 note: nav items below are anchor links into this single page.
 * Once Treatments / About / Contact become standalone routes, swap the
 * `href="#id"` values for real paths (e.g. "/treatments") — the markup and
 * styling stay the same.
 */
const navItems = [
  { label: "Treatments", href: "#treatments" },
  { label: "Why Precision Rehab", href: "#why-us" },
  { label: "About Dr. Patel", href: "#about" },
  { label: "Insurance & Pricing", href: "#insurance" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/5 bg-white/90 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.name} — home`}>
          <Image
            src="/images/logo-transparent.png"
            alt={`${site.name} logo`}
            width={250}
            height={100}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14.5px] font-semibold text-navy-800/80 transition-colors hover:text-navy-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 text-[14.5px] font-bold text-navy-800 hover:text-navy-600"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} />
            {site.phoneDisplay}
          </a>
          <Button href="#screening" variant="primary" className="px-5 py-2.5 text-sm">
            Free Screening
          </Button>
        </div>

        <a
          href={site.phoneHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 text-white md:hidden"
          aria-label="Call Precision Rehab & Performance"
        >
          <Phone className="h-4.5 w-4.5" strokeWidth={2.25} />
        </a>
      </Container>
    </header>
  );
}
