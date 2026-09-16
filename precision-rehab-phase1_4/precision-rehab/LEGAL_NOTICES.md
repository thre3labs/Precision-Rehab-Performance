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
was verified against the built site, not assumed: the page was loaded in a
clean browser profile and its cookie jar, storage and network activity
inspected.

```
cookies set          : NONE
localStorage keys    : NONE
sessionStorage keys  : NONE
third-party hosts    : NONE
```

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
