import Image from "next/image";
import { MapPin, Phone, MessageSquare, Mail } from "lucide-react";
import { site, serviceAreaTowns } from "@/lib/content";
import { Container } from "@/components/ui/Container";

/**
 * Phase 2 note: footer link columns are intentionally pre-built with the
 * future sitemap (About, Services, Blog, Contact, individual condition
 * pages) even though they currently point back to this single page's
 * anchors. Swap hrefs to real routes as those pages ship — no structural
 * change needed.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 pb-24 pt-16 text-navy-100 sm:pb-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo-transparent.png"
              alt={`${site.name} logo`}
              width={250}
              height={100}
              className="h-11 w-auto brightness-0 invert opacity-95"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
              Cash-based outpatient physical therapy in Melbourne, FL —
              individualized, one-on-one care focused on getting you back to
              the life and activities you care about.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gold-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-navy-200">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.smsHref} className="flex items-center gap-2 hover:text-white">
                  <MessageSquare className="h-4 w-4 shrink-0 text-gold-400" /> Text the clinic
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white">
                    <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {site.email}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={site.mapLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.state} {site.address.zip}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gold-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-200">
              <li><a href="#services" className="hover:text-white">Services & Conditions</a></li>
              <li><a href="#why-us" className="hover:text-white">Why Precision Rehab</a></li>
              <li><a href="#about" className="hover:text-white">About Dr. Patel</a></li>
              <li><a href="#screening" className="hover:text-white">Free 15-Min Screening</a></li>
              <li><a href="#insurance" className="hover:text-white">Insurance &amp; Cash-Pay</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gold-400">
              Proudly Serving
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm text-navy-200">
              {serviceAreaTowns.map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-2xl">
            The information on this website is for general informational
            purposes only and is not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult a qualified
            provider regarding a medical condition.
          </p>
        </div>
      </Container>
    </footer>
  );
}
