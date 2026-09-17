import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/content";

/**
 * 404.
 *
 * Next.js serves this with a real HTTP 404 status, which matters more than it
 * looks: a "not found" page returned as 200 is a soft 404, and Google treats a
 * site that emits them as unreliable about its own URLs. There was no
 * not-found.tsx before this, so every mistyped URL got the framework default.
 *
 * Deliberately NOT indexable and NOT in the sitemap. It also does not redirect
 * anywhere — sending every dead URL to the home page is the other common way
 * to create a soft 404, and it hides broken links from whoever could fix them.
 */
// No `robots` here on purpose. Next.js injects its own
// <meta name="robots" content="noindex"> for the not-found route, and adding a
// second one produced TWO conflicting robots tags on the same page. A 404 is
// never indexable anywhere, so this does not need pageMetadata()'s
// environment-aware directive either.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="nf">
          <div className="wrap nf-wrap">
            <p className="nf-code">404</p>
            <h1>We couldn&rsquo;t find that page</h1>
            <p className="nf-lede">
              The link may be out of date, or the address may have a typo in it.
              Nothing is wrong with your device.
            </p>

            <div className="nf-links">
              <Link className="btn btn-primary" href="/">
                Back to the home page
              </Link>
              <a className="btn btn-ghost" href={site.phoneHref}>
                Call or text {site.phoneDisplay}
              </a>
            </div>

            <nav className="nf-nav" aria-label="Popular pages">
              <h2>Looking for something specific?</h2>
              <ul>
                <li>
                  <Link href="/#treatments">Treatments and services</Link>
                </li>
                <li>
                  <Link href="/#conditions">Conditions we treat</Link>
                </li>
                <li>
                  <Link href="/#modalities">Advanced recovery technology</Link>
                </li>
                <li>
                  <Link href="/#about">About Dr. Patel</Link>
                </li>
                <li>
                  <Link href="/#screening">Book a free 15-minute screening</Link>
                </li>
                <li>
                  <Link href="/#location">Find the clinic</Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
