# Legal notices on the website

What is posted, what changed from the supplied template and why, and what is
still outstanding.

---

## 1. Website Privacy Policy — POSTED

Live at `/privacy`, linked from the footer as **Privacy Policy**.
Effective **September 1, 2026** (set by the client).

Source: the compliance provider's *Client Website Privacy Policy TEMPLATE*.
Practice name, address, phone and email are pulled from `src/lib/content.ts`
rather than typed into the page, so they cannot drift out of step with the rest
of the site.

### Clauses removed, and the evidence

The template described several data practices this website does not have. Each
was checked against the built site rather than assumed: the page was loaded in
a clean browser profile and its cookie jar, storage and network activity
inspected.

```
cookies set          : NONE   (before Google Analytics was added)
localStorage keys    : NONE
sessionStorage keys  : NONE
third-party hosts    : NONE   (before Google Analytics was added)
```

**Google Analytics was added after this audit**, at the client's direction, so
the cookie and third-party lines above no longer hold. The policy was rewritten
to match — see section 1a.

| Template said | Reality | Action |
|---|---|---|
| "We use first party cookies to save your preferences and to compile aggregate data about site traffic" | No cookies are set at all | Section replaced with an accurate statement that the site sets no cookies and does no tracking |
| "Payment details… are processed through a secure third party payment processor" | The site takes no payments | Bullet removed |
| "subscribe to updates" / "To send periodic communications, if you have opted in" | There is no subscription or opt-in anywhere on the site | Removed |
| "This website is scanned regularly for malware and security vulnerabilities" | Not something the host does by default, and not currently configured | Removed; the HTTPS sentence in the same paragraph is kept |
| "If this website uses an analytics service such as Google Analytics…" | No analytics of any kind | Folded into the cookies/tracking section as a plain statement |
| "…including California Health and Safety Code section 1280.15 where applicable" | This is a Florida practice | Citation removed. The surrounding "as required by applicable law" wording is unchanged |
| Do Not Track section referred to "the cookie controls described below" | There are no cookie controls, because there are no cookies | Reworded: there is no tracking for the signal to disable |

Every one of these narrows what the practice claims to collect. None of them
broadens it.

### One section added

**The Clinic Assistant.** The template predates the chat feature, so it had no
disclosure for it. Messages typed into the widget are sent to a third-party AI
provider to generate the reply — a real data flow, and one a patient would want
disclosed. The new section states what it is, that it is not a clinician, that
transcripts are not stored, and that the provider handles the message under its
own terms.

### Please have the provider confirm

The trimming was done to make the notice accurate, not to give legal advice.
Worth sending them this list, in particular:

1. That removing the California citation is correct and no Florida-specific
   breach-notification citation belongs in its place. Their covering note
   mentioned Florida's 60-day breach window and 30-day records-access right —
   neither currently appears in the website policy, which may be deliberate
   (those belong to the Notice of Privacy Practices) but is worth confirming.
2. That the Clinic Assistant wording is sufficient, and whether it should also
   name the AI provider once one is chosen.
3. Whether a Florida practice needs any state-specific disclosure the
   California-flavoured template omitted.

---

## 1a. Google Analytics — ADDED at the client's direction

The practice chose Google Analytics for SEO and marketing measurement. It is
implemented in `src/components/analytics/Analytics.tsx` and the privacy policy
was rewritten to disclose it accurately: a cookies-and-analytics section, the
Google opt-out link, a Do Not Track statement, and Google named in the
third-party disclosure.

### Two settings turned off deliberately

```js
allow_google_signals: false
allow_ad_personalization_signals: false
```

These are the two that matter on a healthcare site. Together they stop this
traffic being joined to Google's cross-device advertising identity graph and
keep it out of remarketing audiences. The exposure behind the pixel class
actions was that join — not page-view counting. GA4 truncates IP addresses
before storage with no way to disable it, so that needs no flag.

Turning either on later re-opens the question, and makes a paragraph of the
published privacy policy false. That is noted in the page's own header comment
so it cannot be flipped casually.

### The conversion event carries no parameters

`trackLead()` fires `generate_lead` on a successful form submission and sends
nothing else. The "what brings you in" field is free text and patients put
symptoms in it whatever the label says; sending any of that to Google would
turn a page-view counter into a health-data disclosure. If conversion detail is
ever wanted, screening type (in person / virtual) is safe, the reason field is
not.

### What this does NOT cover

No advertising pixel and no Google Ads remarketing tag is installed, and the
policy says so. Adding either is the change most worth pausing over: it is the
specific pattern that produced the Advocate Aurora ($12.25M) and Novant Health
($6.6M) settlements. If paid ads are planned, raise it with the compliance
provider first rather than dropping a tag in.

The same caution applies to **Phase 2 condition pages**. Today the site is one
page, so analytics records "someone visited the homepage". The moment there is
a `/conditions/knee-pain` URL, analytics records "this visitor looked at the
knee pain page", which is a materially different thing to be holding about a
prospective patient. Worth deciding on before those pages exist, not after.

### Still to do

- [ ] Create the GA4 property and set `NEXT_PUBLIC_GA_ID` in Vercel, **for the
      Production environment only**. Setting it for Preview as well means every
      test deployment pollutes the reporting with traffic that is not real.
- [ ] Verify the site in Google Search Console and set
      `NEXT_PUBLIC_GSC_VERIFICATION` to the token from its "HTML tag" method.
- [ ] Re-check what cookies the live site actually sets once deployed. The
      audit above ran against a local production build, not against Vercel.

---

## 1b. SEO and link previews — RESOLVED 16 September 2026

Already built and working: per-page metadata, canonical URLs, Open Graph and
Twitter cards, `MedicalBusiness` + `PhysiotherapyClinic` JSON-LD with the real
address and provider, `FAQPage` JSON-LD matching the on-page FAQ exactly,
`robots.txt`, and a `sitemap.xml` that includes `/privacy`.

**What was wrong, and is now fixed.** `site.url` in `content.ts` held a
placeholder:

```ts
url: "https://www.precisionrehabfl.com",   // WRONG — a different company
```

That domain is not a typo of the clinic's and it is not unregistered. It is the
live website of **Precision Rehab Enterprises, Inc.**, an unrelated therapy
staffing agency in South Florida, running on GoDaddy. Every canonical tag,
Open Graph URL, sitemap entry and JSON-LD `@id` on this site was built from it,
which meant:

- every page told Google that another company's domain was its canonical
  address — which can remove the clinic's pages from search results entirely,
  in favour of the other company;
- every share preview requested its image from that domain and received a
  **404**, so pasting the link into a text message, WhatsApp or Facebook
  produced a card with no picture;
- `sitemap.xml` and the `Sitemap:` line in `robots.txt` both pointed at the
  other company's domain.

None of this was visible to a visitor. The site rendered perfectly; only a
crawler or a link preview saw the damage.

The confirmed production domain is **`https://www.precisionrehabpt.com`**,
already live on Vercel, and `site.url` is now set to it. Verified after the
change: canonical, `og:url`, `og:image`, the sitemap and the JSON-LD `url` all
resolve to that host, and the card renders identically for Facebook, iMessage,
X, WhatsApp, Slack, LinkedIn and Googlebot.

**Note for whoever maintains this:** the clinic email in `content.ts` is
`Kushal.patel@precisionrpt.com` — `precisionrpt.com`, not `precisionrehabpt.com`.
That may well be correct (a separate mail domain is common), but given what the
last domain mix-up cost, it is worth one confirmation.

Also still open, and for a local clinic it outranks the website itself in local
search: the **Google Business Profile**. It is on the punch list in
`PROJECT_NOTES.md` and has no URL yet.

---

## 2. Notice of Privacy Practices (HIPAA 140) — NOT YET SUPPLIED

Needed: the finalized document **with the red instruction pages removed**, and
its effective date.

Will be posted as a web page plus a downloadable PDF, linked from the footer
beside the privacy policy. The footer link appears automatically once
`legal.npp` is filled in at `src/lib/content.ts`; until then no link renders,
so the footer can never point at a document that is not there.

A PDF alone is worth avoiding: screen readers handle them poorly and they are
painful to read on a phone, which is most visitors.

---

## 3. Non-Discrimination & Accessibility Notice (BOM 244b) — NOT YET SUPPLIED

Needed:

- the document itself
- the **Civil Rights Coordinator** name and contact details
- a **TTY or relay number**

Same treatment as the NPP: web page plus PDF, footer link driven by
`legal.nondiscrimination`. For this notice in particular the web page matters —
a notice about accessibility that is only available as a scanned PDF undercuts
its own subject.

The provider also mentioned **language access** notices from earlier work, and
that they are confirming current federal posting rules. Nothing has been posted
for those yet.

---

## 4. Separate and more urgent: the contact form does not reach anyone

Not a legal-notice issue, but it surfaced while tracing where form submissions
go, and it should be fixed before launch.

`src/app/api/contact/route.ts` validates the submission and then does this:

```ts
console.log("New contact form lead:", { ...body, receivedAt: ... });
return NextResponse.json({ ok: true });
```

It is a documented stub — it was always labelled as one — but the consequence
on a live site is that a patient fills in their name, phone and what is wrong,
sees *"A team member will follow up to discuss your care"*, and the submission
goes to the hosting provider's runtime log and nowhere else. Nobody at the
clinic is notified. The patient concludes they were ignored.

Two things follow:

1. **Wire it up before launch** — lead storage plus an email or SMS
   notification. `PROJECT_NOTES.md` has the recommended architecture.
2. **Until it is wired up, the current retention location is the host's logs**,
   which is not a place anyone intends patient contact details to sit. Whatever
   it is pointed at instead should be chosen with the "what brings you in" free
   text field in mind: patients will put health information in it whatever the
   label says.
