import Script from "next/script";

/**
 * ============================================================================
 * GOOGLE ANALYTICS 4
 * ============================================================================
 * NEXT_PUBLIC_ is correct here and is not the mistake it would be elsewhere.
 * A GA measurement ID is public by design — it ships in the page source of
 * every site that uses GA. This is the opposite of ANTHROPIC_API_KEY, which
 * must never carry that prefix. Don't "fix" one by copying the other.
 *
 * Renders nothing when the ID is unset, so local development and Vercel
 * preview deployments stay out of the reporting. Set the variable for the
 * Production environment ONLY, or every preview build will pollute the data
 * with traffic that isn't real.
 *
 * Two settings are deliberate, and matter more here than on an ordinary
 * business site:
 *
 *   allow_google_signals: false
 *       Stops this traffic being joined to Google's cross-device advertising
 *       identity graph. This is the single most consequential GA4 setting for
 *       a healthcare site: it is the join between "a visit to a physical
 *       therapy clinic" and a real advertising profile that produced the
 *       pixel class actions, not page-view counting itself.
 *
 *   allow_ad_personalization_signals: false
 *       Keeps the data out of remarketing audiences for the same reason.
 *
 * Both can be turned on later if the practice runs paid ads and accepts the
 * trade — but that should be a decision someone makes on purpose, which is
 * why they are written here rather than left to GA's defaults.
 *
 * IP anonymization needs no flag: GA4 truncates IPs before storage and offers
 * no way to disable it.
 * ============================================================================
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}

/**
 * Fire a conversion when someone requests a screening.
 *
 * Deliberately carries NO parameters. It records that a form was submitted,
 * never what was typed into it. The "what brings you in" field is free text
 * and patients put symptoms in it whatever the label says — sending any of
 * that to Google would turn a page-view counter into a health-data disclosure.
 *
 * If conversion detail is ever needed, add non-clinical dimensions only:
 * screening type (in person / virtual) is fine, the reason field is not.
 */
export function trackLead() {
  track("generate_lead");
}

/**
 * The conversion events this site records. A closed set on purpose: an open
 * `track(name: string)` invites a future edit to send a free-text value, and
 * on a healthcare site the free-text values are symptoms.
 *
 *   phone_click            tapped a tel: link
 *   appointment_click      tapped a "book"/"request" CTA that scrolls to the form
 *   free_screening_click   tapped a CTA specifically for the free screening
 *   free_screening_submit  the SERVER confirmed the lead was delivered
 *   directions_click       tapped through to the map / directions
 *
 * free_screening_submit fires only after /api/contact returns success, which
 * it now does only when a destination accepted the lead. So the number in GA4
 * is leads the clinic actually received, not forms that were filled in. Those
 * were the same number only by accident before, and wrong in the direction
 * that flatters the report.
 */
export type ConversionEvent =
  | "generate_lead"
  | "phone_click"
  | "appointment_click"
  | "free_screening_click"
  | "free_screening_submit"
  | "directions_click";

/**
 * Deliberately carries NO parameters. It records that something happened,
 * never what was typed. The "what brings you in" field is free text and
 * patients put symptoms in it whatever the label says — sending any of that to
 * Google would turn a page-view counter into a health-data disclosure.
 *
 * If conversion detail is ever needed, add non-clinical dimensions only:
 * screening type (in person / virtual) is fine, the reason field is not.
 */
export function track(event: ConversionEvent) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
  };
  w.gtag?.("event", event);
}
