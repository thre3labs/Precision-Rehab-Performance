import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { site } from "@/lib/content";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { MobileCTABar } from "@/components/layout/MobileCTABar";

// Fonts are self-hosted via @fontsource (bundled at build time) rather than
// next/font/google, since that requires a live connection to
// fonts.googleapis.com at build time — not guaranteed in every deploy
// environment (e.g. offline/CI sandboxes). Self-hosting also means no
// runtime dependency on Google's font CDN in production.

const title =
  "Physical Therapist in Melbourne, FL | Precision Rehab & Performance";
const description =
  "Precision Rehab & Performance is a cash-based outpatient physical therapy clinic in Melbourne, FL led by Dr. Kushal Patel, PT, DPT. Book a free 15-minute screening, in person or virtual.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    "physical therapist Melbourne FL",
    "physical therapy Melbourne FL",
    "cash based physical therapy Melbourne FL",
    "sports physical therapy Melbourne FL",
    "dry needling Melbourne FL",
    "physical therapy near me",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: site.url,
    title,
    description,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Precision Rehab & Performance, Melbourne, FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
        <MobileCTABar />
      </body>
    </html>
  );
}
