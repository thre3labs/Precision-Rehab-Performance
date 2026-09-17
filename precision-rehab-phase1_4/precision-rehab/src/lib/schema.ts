import {
  faqs,
  provider,
  serviceAreaTowns,
  site,
  treatmentCategories,
} from "./content";

/**
 * ============================================================================
 * STRUCTURED DATA (JSON-LD)
 * ============================================================================
 * What Google reads to understand that this is a physical therapy clinic, in
 * Melbourne, Florida, run by a named clinician. It is the machine-readable
 * half of local SEO; the Google Business Profile is the other half, and the
 * two must agree on name, address and phone down to the punctuation.
 *
 * THE RULE: every value here must be verifiable from content.ts, which is the
 * single source of truth for facts about the clinic. Nothing is invented for
 * the benefit of a crawler. Structured data that contradicts the page is a
 * manual-action risk on a medical site, and "it probably helps rankings" is
 * not a reason to assert something nobody has confirmed.
 *
 * DELIBERATELY ABSENT, because nobody has verified them:
 *   - openingHours      the clinic's hours are still an open item. Absent is
 *                       correct; invented hours send patients to a locked door.
 *   - priceRange        was "$$" here. It was never verified, and this clinic
 *                       deliberately does not publish pricing, so the site was
 *                       telling Google something it declines to tell patients.
 *                       Removed rather than guessed.
 *   - aggregateRating   there are no reviews to aggregate, and self-serving
 *                       review markup is exactly what earns a penalty.
 * ============================================================================
 */

/** E.164 is what Google prefers, and it is unambiguous across countries. */
const telephone = site.phoneHref.replace(/^tel:/, "");

/** Profiles that prove this is the same business elsewhere on the web. */
function sameAs(): string[] {
  return Object.values(site.social).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
}

const ORGANIZATION_ID = `${site.url}/#organization`;
const BUSINESS_ID = `${site.url}/#business`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.line1} ${site.address.line2}`,
  addressLocality: site.address.city,
  addressRegion: site.address.state,
  postalCode: site.address.zip,
  addressCountry: site.address.country,
};

/**
 * The clinic as a local business. This is the entity Google ties to the map
 * listing, so @id is stable and everything else points at it by reference
 * rather than restating it — two half-described copies of the same clinic is
 * worse than one complete one.
 */
export function buildLocalBusinessSchema() {
  const profiles = sameAs();

  return {
    "@context": "https://schema.org",
    // Physiotherapy is a real schema.org MedicalBusiness subtype and the exact
    // fit. It is paired with MedicalBusiness because the specific type is
    // obscure enough that some consumers only understand the general one.
    // (The previous additionalType pointed at "PhysiotherapyClinic", which is
    // not a schema.org type at all.)
    "@type": ["MedicalBusiness", "Physiotherapy"],
    "@id": BUSINESS_ID,
    name: site.name,
    image: `${site.url}/images/og-default.jpg`,
    logo: `${site.url}/images/logo-transparent.png`,
    url: site.url,
    telephone,
    ...(site.email ? { email: site.email } : {}),
    address: postalAddress,
    // Straight from the Google Business Profile listing, so the site asserts
    // the same point Google already has the clinic at. Geocoding the street
    // address ourselves would have risked disagreeing with the listing, which
    // is the one thing worse than omitting it.
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    ...(site.social.google ? { hasMap: site.social.google } : {}),
    medicalSpecialty: "https://schema.org/Physiotherapy",
    // The towns the clinic actually serves, from content.ts. This is the
    // honest way to signal a service area, and far better than a thin page
    // per town.
    areaServed: [
      { "@type": "City", name: `${site.address.city}, ${site.address.state}` },
      ...serviceAreaTowns.map((t) => ({
        "@type": "City",
        name: `${t}, ${site.address.state}`,
      })),
    ],
    // Every treatment the site actually describes, so the clinic's services
    // are legible to a crawler without needing a page per service.
    availableService: treatmentCategories.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "MedicalTherapy",
        name: item.name,
      })),
    ),
    founder: { "@id": `${site.url}/#provider` },
    employee: { "@id": `${site.url}/#provider` },
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

/**
 * The brand as an organization, kept separate from the physical location so
 * the two never contradict each other.
 */
export function buildOrganizationSchema() {
  const profiles = sameAs();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/images/logo-transparent.png`,
    telephone,
    address: postalAddress,
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

/**
 * The clinician. Only values confirmed in content.ts: name, credentials, role,
 * degree-granting institution, photo. No licence number, no specialties beyond
 * physical therapy, no professional memberships nobody has checked.
 */
export function buildProviderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#provider`,
    name: provider.name,
    jobTitle: provider.role,
    honorificSuffix: provider.credentials,
    image: `${site.url}${provider.photo}`,
    worksFor: { "@id": ORGANIZATION_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of St. Augustine for Health Sciences",
    },
    knowsAbout: [
      "Physical Therapy",
      "Dry Needling",
      "Orthopedic Rehabilitation",
    ],
  };
}

/**
 * Breadcrumbs for pages below the root.
 *
 * Google requires the markup to match breadcrumbs the visitor can actually
 * see, so this is only ever rendered by a page that also shows them. Pass the
 * full trail INCLUDING the current page; the current page carries no `item`,
 * which is what tells a crawler it is the one you are on.
 */
export type Crumb = { name: string; path?: string };

export function buildBreadcrumbSchema(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: `${site.url}${crumb.path}` } : {}),
    })),
  };
}

/**
 * FAQ markup, mirroring the on-page FAQ exactly — matching content is
 * required, and inventing extra questions here would be cloaking.
 *
 * Worth knowing: Google narrowed FAQ rich results in 2023 to government and
 * health-authority sites, so this is unlikely to produce a dropdown in the
 * results for a private clinic. It stays because it still helps a crawler
 * understand the page, but nobody should expect a rich result from it, and it
 * is not a reason to add FAQs patients do not need.
 */
export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
