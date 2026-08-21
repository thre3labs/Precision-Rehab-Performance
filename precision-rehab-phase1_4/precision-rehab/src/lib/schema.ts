import { faqs, provider, site } from "./content";

/**
 * Structured data (JSON-LD) for local SEO.
 * MedicalBusiness + PhysicalTherapy (via additionalType) is the closest
 * schema.org fit for a cash-based outpatient PT clinic. FAQPage schema
 * mirrors the on-page FAQ content exactly (matching content is required
 * for FAQ rich results).
 */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    image: `${site.url}/images/og-default.jpg`,
    url: site.url,
    telephone: site.phoneDisplay,
    ...(site.email ? { email: site.email } : {}),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1} ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    areaServed: {
      "@type": "City",
      name: "Melbourne, FL",
    },
    medicalSpecialty: "Physical Therapy",
    additionalType: "https://schema.org/PhysiotherapyClinic",
    employee: {
      "@type": "Person",
      name: provider.name,
      jobTitle: "Physical Therapist",
    },
  };
}

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
