# Precision Rehab & Performance — Phase 1 Landing Page

Handoff notes for the client and for whoever picks this up next (including a future me).

## What this is

A Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 landing page for
Precision Rehab & Performance, a cash-based outpatient physical therapy
clinic opening in Melbourne, FL under Dr. Kushal Patel, PT, DPT.

Every fact on the page — clinic name, address, phone, provider bio,
services, insurance status — comes from the client's one-pager
(`Website Information 1.docx`) and is centralized in
`src/lib/content.ts`. Nothing about credentials, services, insurance
participation, pricing, or outcomes was invented. Where the one-pager
didn't have an answer (photo, hours, email, pricing), the site shows an
honest, clearly-labeled placeholder instead of a fabricated fact.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

## Architecture, and why it's built this way

- **Next.js App Router**, not static HTML — so Phase 2 (About, Services,
  individual condition pages, Insurance, Blog, Contact) can be added as
  new routes under `src/app/` without restructuring anything. Every
  landing-page section already lives in its own component
  (`src/components/sections/*`); promoting one to a standalone page is
  "move the component into a new route file," not a rewrite.
- **Single content source of truth** (`src/lib/content.ts`) — every
  section imports facts from here instead of hardcoding copy. Update the
  phone number, insurance status, or provider bio once and it updates
  everywhere, including the JSON-LD structured data.
- **Tailwind v4, CSS-first theme** (`src/app/globals.css`, `@theme`
  block) — brand colors (navy `#123A70`, gold `#C6862A`) were sampled
  directly from the client's logo file, not guessed.
- **Self-hosted fonts** (`@fontsource-variable/inter`,
  `@fontsource-variable/plus-jakarta-sans`) instead of `next/font/google`
  — this avoids a live dependency on Google Fonts' CDN at build time and
  in production.
- **Lucide icons**, no icon-image assets to manage.

## What's real vs. placeholder

**Confirmed from the client's one-pager (used as-is):**
Clinic name, address, Dr. Patel's name/credentials/education/prior
experience/dry needling certification, all listed services and
conditions treated, Medicare-only insurance status + superbill policy,
and the cash-based care philosophy statement.

**Confirmed via follow-up from the client (update #2):**
- Corrected phone number: (321) 372-1055 (used for call, text, and JSON-LD)
- Clinic email: Kushal.patel@precisionrpt.com (shown in the footer,
  used for `mailto:` and in JSON-LD)
- Dr. Patel's professional headshot (About section)
- Updated, higher-resolution logo file (header, footer, hero mark,
  favicon set, and OG image all regenerated from it)

**Still clearly marked placeholders (see `openItems` in
`src/lib/content.ts` and the in-page markers):**
- Business hours
- Self-pay / cash pricing (intentionally withheld per your direction —
  the one-pager also says pricing is still being finalized)
- Production domain (placeholder `precisionrehabfl.com` used in
  metadata/JSON-LD/canonical URLs until the real domain is connected)
- Google Business Profile / social links
- Additional clinic-space / in-session photography (optional, beyond
  the headshot already in place)

**No testimonials, review counts, or outcome statistics appear anywhere**
— none were provided, and neither competitor site's claims were borrowed.

## Punch list — needed from the client before production launch

1. Production domain target (client owns it via Domain.com) — swap into
   `src/lib/content.ts` (`site.url`) and connect DNS when ready.
2. Business hours.
3. Confirm the clinic's phone line is SMS/text-capable (the site's
   "Text" buttons link to `sms:+13213721055` — if that line can't
   receive texts, this needs a different number).
4. Optional: additional clinic-space / in-session photography beyond
   Dr. Patel's headshot (already in place).
5. Finalized self-pay pricing, whenever the client decides to display it
   (currently intentionally omitted).
6. Google Business Profile URL, and Facebook/Instagram if applicable.
7. Preferred scheduling flow: phone/text/form is live today — decide
   later if an online booking tool should replace/augment the form.

## Lead capture & the automated SMS workflows

The contact form (`src/components/sections/ContactForm.tsx`) posts to
`src/app/api/contact/route.ts`, which is a **working stub**: it
validates input and returns success (so the demo form fully works
end-to-end), logs the lead, but doesn't yet persist it anywhere or fire
a text. That route file has the full recommended architecture written
inline as comments. Summary:

**Contact form → automated text:** Don't hardcode a single SMS vendor's
SDK into the form handler. Have the form write the lead to storage, then
call a small "notifications" webhook that owns the actual SMS
integration. That indirection means the clinic can swap SMS
providers later without touching the website. **Twilio Programmable
Messaging** is the recommended default — cheap, reliable, well-
documented — but the architecture doesn't lock you into it.

**Missed call → automated text:** This one isn't triggered by the
website at all — it's triggered by phone activity, so it belongs to
whatever handles the clinic's phone line. The clean way to get this is
a call-tracking/VoIP number (Twilio Voice, CallRail, OpenPhone, or a
PT-specific practice-management phone system) configured to fire an SMS
on a missed-call event. Using a dedicated tracking number for the
site's "Call Now" links also gives call-source attribution for future ad
spend. This requires no website code — it's a phone-system
configuration decision, made once a provider is chosen.

**Compliance note:** the contact form deliberately does not include an
open-ended medical-history field, and the form's privacy copy tells
visitors not to submit detailed medical information. Whatever lead
storage/CRM and SMS vendor combination is ultimately chosen should be
appropriate for the type of data actually being collected.

## SEO foundation already in place

- Semantic HTML, single `<h1>`, logical `h2`/`h3` hierarchy throughout.
- Descriptive page title + meta description tuned for
  "physical therapist Melbourne FL" / "cash based physical therapy
  Melbourne FL" style queries, without keyword-stuffing the copy itself.
- Canonical tag, Open Graph + Twitter Card metadata, and a generated
  placeholder OG image (`public/images/og-default.jpg`) — swap for real
  photography when available.
- `MedicalBusiness` JSON-LD (name, address, phone, service area,
  provider) in the root layout, plus `FAQPage` JSON-LD generated from
  the same FAQ content shown on the page (matching on-page/schema
  content is required for FAQ rich results).
- `sitemap.xml` and `robots.txt` generated natively via
  `src/app/sitemap.ts` / `src/app/robots.ts` — add a URL entry per page
  as Phase 2 routes ship.
- All images have descriptive alt text; the logo/mark are optimized PNGs
  served through `next/image`.
- Mobile-first responsive layout, plus a persistent mobile call/text/
  book bar so the primary conversion actions are always one tap away on
  the device most visitors will actually convert on.

**Before launch:** submit the sitemap in Google Search Console, connect
Google Analytics / conversion tracking (structure is ready — add the
GA4 script + a `gtag` event on form-submit and on `tel:`/`sms:` link
clicks), and claim/verify the Google Business Profile once hours and a
final address are locked in.

## Competitor analysis summary (Whole Strength PT, BodyFX Melbourne)

**Whole Strength Physical Therapy** does niche-specific service framing
well (Performance / Running / Lifters, not generic "physical therapy"),
runs a repeated low-friction "free phone consult" CTA, and directly
addresses the insurance objection in its FAQ. Weak points: no pricing
anchor at all, thin therapist bios beyond first names, and a repetitive
CTA that can start to feel pushy. This site adapts the "address the
cash-pay objection head-on" idea (see the Insurance & Cash-Based Care
section) and the repeated-but-varied CTA pattern, while giving Dr.
Patel a real, personal bio section instead of a name-only mention.

**BodyFX Sports Recovery & Rehab** (the direct local Melbourne, FL
competitor) leans into a dark, athletic "sports recovery" brand and
lists a broad service menu (Shockwave, massage, dry needling, hand
therapy, assisted stretching). It reads more like a recovery/wellness
studio than a premium clinical brand. This site differentiates by
staying credential-forward (DPT, direct one-on-one time with the actual
provider) and by leading with a specific, low-risk conversion offer
(free 15-minute screening) rather than a general service list — giving
undecided visitors a reason to convert today instead of just browsing
services.

Neither competitor's design, copy, testimonials, or specific claims were
reused — everything here was built from the client's own facts and
original copywriting.

## Phase 2 roadmap (planned for, not built yet)

The nav (`src/components/layout/Header.tsx`) and footer already list the
future site map as anchor links; converting them to real routes is a
drop-in change:

- `/` — condensed home (can reuse Hero + a trimmed version of today's page)
- `/about` — expanded Dr. Patel bio / practice story
- `/services` — full service directory
- `/services/[condition]` — individual condition landing pages (e.g.
  `/services/knee-pain`) for long-tail local SEO
- `/insurance` — expanded insurance & cash-pay page, pricing once finalized
- `/free-screening` — dedicated screening booking page (possibly with
  embedded scheduling once a booking tool is chosen)
- `/faq` — expanded FAQ library
- `/blog` — topical-authority content (injury recovery, sports
  performance, rehab education, local search terms)
- `/contact`

None of this requires re-theming or rebuilding shared components — the
`Container`, `Button`, `Eyebrow`, `Header`, and `Footer` primitives in
`src/components/ui` and `src/components/layout` are already the shared
system for whatever gets added next.
