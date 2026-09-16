import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site, legal, features } from "@/lib/content";

/**
 * ============================================================================
 * WEBSITE PRIVACY POLICY
 * ============================================================================
 * Adapted from the practice's compliance-provider template. It is NOT the
 * Notice of Privacy Practices — that is a separate HIPAA document covering
 * treatment information, and it gets its own page and footer link.
 *
 Clauses removed from the supplied template because they described things
 * this website does not do:
 *
 *   - the payment-processor bullet (the site takes no payments)
 *   - "subscribe to updates" and the opt-in marketing email clause
 *   - "this website is scanned regularly for malware and security
 *     vulnerabilities" (not something the host does by default)
 *   - a citation to California Health and Safety Code s.1280.15, in a policy
 *     for a Florida practice — the surrounding "as required by applicable
 *     law" wording is kept, the jurisdiction-specific cite is not
 *
 * Two sections were ADDED because they are real data flows the template did
 * not cover: Google Analytics, and the clinic assistant.
 *
 * The clinic assistant passages render only while features.chatAssistant is
 * true in content.ts. The feature and its disclosure are deliberately tied to
 * one switch: a published privacy notice describing a feature the site does
 * not have is the same class of error as one that fails to describe a feature
 * it does.
 *
 * THIS PAGE MAKES SPECIFIC FACTUAL CLAIMS ABOUT WHAT THE SITE DOES. Two in
 * particular will go stale if someone changes the setup without reading here:
 *
 *   1. "We have turned off Google Signals and ad personalization" — enforced
 *      in components/analytics/Analytics.tsx. If those flags are flipped on to
 *      enable remarketing, this paragraph becomes false and must change.
 *   2. "We do not use advertising pixels or social network trackers" — true
 *      today. Adding a Meta pixel or a Google Ads remarketing tag makes it
 *      false, and on a healthcare site that is the change most worth pausing
 *      over. See LEGAL_NOTICES.md.
 *
 * All of it still needs the compliance provider's sign-off.
 * ============================================================================
 */

const title = "Website Privacy Policy";
const description = `How ${site.name} collects, uses, and protects information submitted through this website.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  const { address } = site;

  return (
    <>
      <Header />
      <main id="main-content">
        <article className="legal">
          <div className="wrap legal-wrap">
            <span className="note">Legal</span>
            <h1>{site.name} Website Privacy Policy</h1>

            {legal.privacy.effectiveDate ? (
              <p className="legal-date">
                Effective {legal.privacy.effectiveDate}
              </p>
            ) : (
              <p className="legal-unset" role="note">
                <strong>Effective date not set.</strong> This notice is not
                final until a date is entered in{" "}
                <code>src/lib/content.ts</code> (<code>legal.privacy</code>).
              </p>
            )}

            <p className="legal-lede">
              This privacy policy describes how {site.name} collects, uses, and
              protects personally identifiable information collected through
              this website. Please read it carefully. If you have questions,
              contact us using the information at the end of this policy.
            </p>

            <h2>Scope of This Policy</h2>
            <p>
              This policy applies to information collected through this website
              only. Information about your health care and treatment is
              governed by our Notice of Privacy Practices, which is provided to
              you at intake, posted in our office, and available on this
              website.
            </p>

            <h2>What Information Do We Collect?</h2>
            <ul>
              <li>
                Contact information you submit through forms on this website,
                such as your name, email address, mailing address, and phone
                number.
              </li>
              <li>
                A short description of what brings you in, if you choose to
                provide one. We ask you not to include detailed medical history
                in it.
              </li>
              <li>
                Standard server records of your visit, such as pages requested,
                kept by our hosting provider.
              </li>
              <li>
                Website usage data collected through Google Analytics, such as
                the pages you view, roughly where you are in the world, and
                whether you arrived from a search engine, a link, or directly.
                This is collected using cookies, described below.
              </li>
            </ul>

            <h2>When Do We Collect Information?</h2>
            <p>
              We collect information from you when you submit a contact form
              {features.chatAssistant
                ? ", request an appointment or information, or send a message to the clinic assistant described below."
                : " or request an appointment or information."}
            </p>

            <h2>How Do We Use Your Information?</h2>
            <ul>
              <li>To respond to your inquiries and requests.</li>
              <li>To schedule and confirm appointments.</li>
              <li>To operate and improve our website.</li>
            </ul>

            <h2>Cookies and Analytics</h2>
            <p>
              Cookies are small files a website stores in your browser. This
              website uses Google Analytics, which sets cookies so that it can
              tell a returning visit from a new one and report how the site is
              used overall. We use this to understand which pages people find
              useful and how they found us. We do not use it to identify you
              personally.
            </p>
            <p>
              We have turned off Google Signals and ad personalization for this
              website. That means your visit here is not added to Google&rsquo;s
              cross-device advertising profiles and is not used to build
              remarketing audiences.
            </p>
            <p>
              You can set your browser to warn you each time a cookie is sent,
              or to turn off cookies entirely. Each major browser, such as
              Microsoft Edge, Google Chrome, Apple Safari, and Mozilla Firefox,
              includes instructions in its Help or Settings menu, usually under
              Privacy. You can also opt out of Google Analytics on every website
              using the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics opt-out browser add-on
              </a>
              . Turning cookies off does not stop you using this site.
            </p>
            <p>
              We do not use advertising pixels or social network trackers on
              this website.
            </p>

            <h2>Do Not Track</h2>
            <p>
              There is no common industry standard for responding to Do Not
              Track browser signals, and this website does not respond to Do Not
              Track signals at this time. You may control tracking through your
              browser settings and through the cookie controls described above.
            </p>

            {features.chatAssistant && (
              <>
                <h2>The Clinic Assistant</h2>
                <p>
                  This website offers an automated chat assistant that answers
                  general questions about the clinic. It is not a person, it is
                  not a clinician, and it does not give medical advice. Please
                  do not share medical details with it.
                </p>
                <p>
                  Messages you type are sent to our website and passed to a
                  third-party artificial intelligence provider, which generates
                  the reply. We do not store the conversation: it is not written
                  to any database or log by this website, and it does not
                  outlive your browser tab. The provider handles the message
                  under its own terms and privacy policy.
                </p>
              </>
            )}

            <h2>Reviewing and Correcting Your Information</h2>
            <p>
              You may contact us at any time using the information below to
              review, update, or request deletion of the personal information
              we have collected about you through this website. We will respond
              promptly and will take reasonable steps to verify your identity
              before making changes.
            </p>

            <h2>How Do We Protect Your Information?</h2>
            <p>
              This website uses HTTPS encryption to protect information in
              transit. Please remember that no method of transmission over the
              Internet or method of electronic storage is 100 percent secure,
              and we cannot guarantee absolute security.
            </p>

            <h2>Third Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally
              identifiable information to outside parties. This does not
              include website hosting partners and other parties who assist us
              in operating our website or servicing you, so long as those
              parties agree to keep this information confidential. Google
              receives website usage data as described above
              {features.chatAssistant
                ? ", and the clinic assistant\u2019s artificial intelligence provider receives the messages you send it."
                : "."}{" "}
              We may also
              release your information when we believe release is appropriate
              to comply with the law, enforce our site policies, or protect our
              rights, property, or safety, or the rights, property, or safety of
              others.
            </p>

            <h2>Third Party Links</h2>
            <p>
              Occasionally, we may include links to third party products or
              services on our website. These third party sites have separate
              and independent privacy policies, and we cannot control their
              behavior or accept responsibility for their content and
              activities.
            </p>

            <h2>Breach Notification</h2>
            <p>
              In the event of a breach of personal information collected
              through this website, we will notify affected individuals as
              required by applicable law.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to update or change this policy at any time,
              and you should check this page periodically. Your continued use
              of this website after we post any modifications constitutes your
              acknowledgment of the modifications. If we make material changes,
              we will notify you through the email address you have provided us
              or by placing a prominent notice on our website.
            </p>

            <h2>Contacting Us</h2>
            <p>
              If you have any questions regarding this privacy policy, please
              contact us using the information below.
            </p>
            <ul className="legal-contact">
              <li>{site.name}</li>
              <li>
                {address.line1}, {address.line2}
              </li>
              <li>
                {address.city}, {address.state} {address.zip}
              </li>
              <li>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>

            <p className="legal-back">
              <a href="/">&larr; Back to {site.shortName}</a>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
