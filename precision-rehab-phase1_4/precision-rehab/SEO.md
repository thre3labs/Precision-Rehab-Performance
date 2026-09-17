# SEO — what is built, and what only you can do

Target: rank for **physical therapy in Melbourne, Florida** and the treatment
terms the clinic actually offers.

This document covers the search side specifically. `DEPLOY.md` covers
environment variables and deploys, `LEGAL_NOTICES.md` covers compliance.

---

## The single most important thing on this page

**For "physical therapy in Melbourne FL", the Google Business Profile outranks
the website.**

That query returns a map with three clinics above the blue links. Most people
tap one of those three and never scroll. The map pack is chosen almost entirely
by the Business Profile — proximity, categories, reviews, photos, completeness
— and only partly by the website.

The profile is verified, which is the hard part and it is done. What is left is
mostly free and mostly a weekend's work:

- **Primary category must be "Physical therapist."** Not "Medical clinic", not
  "Sports medicine clinic". The primary category is the strongest single signal
  in the whole local ranking system. Secondary categories can add the rest.
- **The name, address and phone must match this website character for
  character.** "Precision Rehab & Performance", "1305 S Apollo Blvd Unit 101",
  "(321) 372-1055". Not "and" for "&", not "Ste 101", not a different tracking
  number. Google cross-checks these, and a mismatch costs you confidence in the
  listing. The site's structured data is built from `content.ts`, so
  `content.ts` is the reference.
- **Reviews are the lever with the highest ceiling.** A clinic with 40 reviews
  beats an identical clinic with 4, essentially always. Ask every patient you
  discharge. Reply to all of them.
- **Add the services and photos.** Every field you fill is a field a competitor
  left blank.
- **Post the profile URL back to me** so it goes into the site's structured
  data as `sameAs` — that is what ties the website and the listing together as
  one business rather than two.

Nothing in the code below outranks getting this right.

---

## What is implemented in the site

### Indexing and crawling

| Thing | State |
|---|---|
| Canonical domain | `https://www.precisionrehabpt.com`, from `site.url`, used by every canonical / OG / sitemap / JSON-LD URL |
| Self-referencing canonicals | Yes, on every route, via `pageMetadata()` |
| `robots.txt` | Generated from `app/robots.ts`. Allows everything except `/api/`, advertises the sitemap on production only |
| `sitemap.xml` | Generated from `app/sitemap.ts`. Only routes that actually exist |
| Preview deployments | `noindex, nofollow` on every page **plus** an `X-Robots-Tag` header, so previews cannot compete with production |
| 404 | Real HTTP 404 with routes back into the site. No soft 404s, no redirect-everything-to-home |

**On preview protection:** previews are noindexed but stay *crawlable* on
purpose. Blocking them in `robots.txt` would stop Google fetching the page,
which also stops it seeing the `noindex` — and a blocked-but-linked URL can
still get listed as a bare URL. Letting the crawler in to read the noindex is
what actually keeps previews out.

The environment check is inverted deliberately: anything that is not explicitly
`VERCEL_ENV=production` is treated as not-production. A typo in an env var name
therefore yields a noindexed preview, never a noindexed production site.

### Metadata

- One `pageMetadata()` helper builds canonical + Open Graph + Twitter + robots
  together, so a page cannot ship a half-configured set. See `src/lib/seo.ts`
  for why that matters — Next.js does not deep-merge `openGraph`.
- Home page title: **Physical Therapy in Melbourne FL | Precision Rehab.**
  Leads with the search term, short enough not to truncate at ~60 characters.
- Child pages use the template `%s | Precision Rehab & Performance`.
- Share-card copy is written separately from the title and meta description —
  search engines and people reading a text message want different things.

### On-page

- The home page `<h1>` now reads **"Physical Therapy in Melbourne, Florida —
  Precision care, built around you."** The brand line stays visually dominant;
  the heading itself now says what the clinic does and where. Previously the h1
  was the brand line alone, which told a search engine nothing.
- One `<h1>` per page, hierarchical headings below it.
- Semantic landmarks, descriptive alt text, labelled form controls, `tel:`
  links, visible focus states — all verified at zero axe violations.

### Structured data

Four JSON-LD entities, cross-referenced by `@id` so they describe one business
rather than competing:

- `MedicalBusiness` + `Physiotherapy` — the clinic, at `#business`
- `Organization` — the brand, at `#organization`
- `Person` — Dr. Patel, at `#provider`
- `FAQPage` — mirroring the on-page FAQ exactly

A `buildBreadcrumbSchema()` helper is ready for when sub-pages land.

**What was removed and why:** `priceRange: "$$"` was asserted and had never
been verified — the site was telling Google a price band it deliberately
declines to tell patients. `additionalType` pointed at
`schema.org/PhysiotherapyClinic`, which is not a schema.org type.

**What is deliberately absent:** `openingHours` and `geo`, because nobody has
confirmed them. Invented hours send a patient to a locked door, and structured
data that contradicts reality is a manual-action risk on a medical site.
`aggregateRating` is absent because there is nothing to aggregate and
self-serving review markup is exactly what earns a penalty.

### Conversion tracking

`phone_click`, `appointment_click`, `free_screening_click`,
`free_screening_submit`, `directions_click`, `generate_lead` — a closed set, no
parameters. On a healthcare site the free-text values are symptoms, so nothing
free-text is ever sent to Google.

`free_screening_submit` fires **only after the server confirms the lead was
delivered**, so the number in GA4 is leads the clinic received, not forms that
were filled in. Those were the same number only by accident before.

---

## Manual tasks — only you can do these

### 1. Google Search Console — verify by DNS, not by meta tag

Use the **Domain** property, not "URL prefix". It verifies through a DNS TXT
record rather than a tag in the page, which is better here for four reasons:
it covers `www` and the bare domain and http and https in one property, it
needs no deploy, it survives any future change to the site's code, and it can
be done before the branch is merged.

1. `search.google.com/search-console` → **Add property** → the **Domain** box
   on the left → enter `precisionrehabpt.com` (no scheme, no `www`).
2. Google gives a TXT record beginning `google-site-verification=`. Add it
   wherever the domain's DNS lives — Vercel → Settings → Domains → DNS
   Records if the nameservers point at Vercel, otherwise the registrar's DNS
   panel. Type `TXT`, name `@` (or blank), value = the whole string.
3. Wait a few minutes, then **Verify**. A first failure usually means DNS has
   not propagated yet, not that anything is wrong. Leave the record in place
   permanently — Google re-checks it, and deleting it later silently
   un-verifies the property.
4. **Sitemaps** → submit `sitemap.xml`.
5. **URL Inspection** → home page URL → **Request indexing**. Do this *after*
   the merge: until then the live site still names another company's domain as
   canonical, and inviting Google to read that is worse than waiting.

The meta-tag route still works if you prefer it — set
`NEXT_PUBLIC_GSC_VERIFICATION` in Vercel and redeploy. `NEXT_PUBLIC_` is
correct for a verification token; it is public by design and meant to be read
out of the page source. But it only verifies the one URL prefix, and it breaks
if the variable is ever dropped.

### 2. Bing Webmaster Tools

`bing.com/webmasters` → **Import from Google Search Console**. Takes about
thirty seconds once step 1 is done and skips verification entirely.

If you would rather verify separately, the meta-tag hook exists: set
`NEXT_PUBLIC_BING_VERIFICATION` and redeploy. Bing also feeds ChatGPT search
results, which is a growing share of how people find clinics.

### 3. Lead destination — the form does not work until this is set

The screening form currently **refuses submissions** and shows the phone number
instead. That is deliberate: it previously accepted everything and delivered
nothing. Set one of these in Vercel and redeploy:

| Variable | What it does |
|---|---|
| `LEAD_WEBHOOK_URL` | POSTs the lead as JSON to Zapier / Make / n8n / a CRM hook. Most flexible — can text you, email you and log to a sheet at once |
| `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` | Emails the lead straight to an inbox. Simplest |

Both can be set; the lead is delivered if either succeeds. Neither takes a
`NEXT_PUBLIC_` prefix, and neither may.

**Chosen: the Zapier webhook.** Step-by-step setup is in `DEPLOY.md` under
"Setting up the Zapier webhook", including the exact JSON payload for mapping
fields. The reason it beats an inbox: a lead that arrives as a text at 2pm gets
called back that afternoon; one sitting in an inbox competes with everything
else in there.

One trap worth repeating from that walkthrough — Zapier's catch hook answers
200 whether or not the Zap is switched on, so the site will report success into
a Zap that is off. Send a real test after enabling it and confirm the text
actually arrives.

### 4. Re-check the share preview

Facebook **Sharing Debugger** → **Scrape Again** on the home page URL. Clears
the stale card from when the domain was wrong.

---

## Still needed from the clinic

- **Business hours.** Blocks `openingHours` in structured data and the Business
  Profile. Highest-value single missing fact.
- **Google Business Profile URL**, for `sameAs`.
- **Confirm the email domain.** `content.ts` has
  `Kushal.patel@precisionrpt.com` — `precisionrpt`, not `precisionrehabpt`.
- Social profile URLs, if any exist.

---

## What is not built yet, and why

The brief proposed ~35 routes, including 14 substantial service and condition
pages. Those are held until Dr. Patel can review clinical copy.

When they land, this is the order I would build them in, and it is not the
order the brief gives:

1. **The four modality pages first** — shockwave, Class IV laser, dry needling,
   cupping. Few clinics in Brevard have this equipment, so the competition for
   "shockwave therapy Melbourne FL" is thin and the searches are high-intent.
   These are winnable in months, not years.
2. **`/services/physical-therapy`** — the hub the modality pages link into.
3. **Cash-pay physical therapy** — an unusual model that people search for by
   name, and the clinic's actual differentiator.
4. Condition pages last. "Physical therapy for knee pain Melbourne FL" competes
   with every clinic in the county and is the hardest thing on the list to win.

Generic condition pages written quickly are the "thin AI filler" the brief
itself warns against, and Google's helpful-content systems are specifically
tuned against exactly that. Fewer pages that say something only this clinic can
say will outperform fourteen that could belong to anyone.
