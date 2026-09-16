import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site, legal } from "@/lib/content";

/**
 * ============================================================================
 * WEBSITE PRIVACY POLICY
 * ============================================================================
 * Adapted from the practice's compliance-provider template. It is NOT the
 * Notice of Privacy Practices — that is a separate HIPAA document covering
 * treatment information, and it gets its own page and footer link.
 *
 * Clauses removed from the supplied template because they described things
 * this website does not do. Verified empirically against the built site:
 * zero cookies set, no localStorage or sessionStorage, no third-party
 * requests, no analytics, no payment processing.
 *
 *   - the cookie section ("we use first party cookies to save your
 *     preferences and compile aggregate data")
 *   - the payment-processor bullet
 *   - "subscribe to updates" and the opt-in marketing email clause
 *   - "this website is scanned regularly for malware and security
 *     vulnerabilities" (not something the host does by default)
 *   - a citation to California Health and Safety Code s.1280.15, in a policy
 *     for a Florida practice — the surrounding "as required by applicable
 *     law" wording is kept, the jurisdiction-specific cite is not
 *
 * Added, because it is a real data flow the template predates: the clinic
 * assistant section. Messages typed into the chat widget are sent to a
 * third-party model provider to generate the reply. Omitting that would be a
 * worse error than including it.
 *
 * Every removal narrows what the practice claims to collect. All of it still
 * needs the compliance provider's sign-off — see PROJECT_NOTES.md.
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
            </ul>

            <h2>When Do We Collect Information?</h2>
            <p>
              We collect information from you when you submit a contact form,
              request an appointment or information, or send a message to the
              clinic assistant described below.
            </p>

            <h2>How Do We Use Your Information?</h2>
            <ul>
              <li>To respond to your inquiries and requests.</li>
              <li>To schedule and confirm appointments.</li>
              <li>To operate and improve our website.</li>
            </ul>

            <h2>Cookies and Tracking</h2>
            <p>
              This website does not set cookies, does not use browser storage
              to track you, and does not use an analytics service. It loads no
              content from third-party servers, so no advertising or social
              network can observe your visit here.
            </p>

            <h2>Do Not Track</h2>
            <p>
              There is no common industry standard for responding to Do Not
              Track browser signals. Because this website does no tracking,
              there is nothing for such a signal to disable.
            </p>

            <h2>The Clinic Assistant</h2>
            <p>
              This website offers an automated chat assistant that answers
              general questions about the clinic. It is not a person, it is not
              a clinician, and it does not give medical advice. Please do not
              share medical details with it.
            </p>
            <p>
              Messages you type are sent to our website and passed to a
              third-party artificial intelligence provider, which generates the
              reply. We do not store the conversation: it is not written to any
              database or log by this website, and it does not outlive your
              browser tab. The provider handles the message under its own terms
              and privacy policy.
            </p>

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
              parties agree to keep this information confidential. We may also
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
