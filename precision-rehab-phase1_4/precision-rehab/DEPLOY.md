# Deploying to Vercel (Free)

Vercel is the recommended host for this project — it's built by the
makers of Next.js, has a generous free tier that easily covers a small
business landing page, and handles the `/api/contact` route
automatically (no separate server to manage). This gets you a live
preview URL today; connecting the client's real domain later is a
separate, no-risk step you do once the demo is approved (see the end of
this doc).

I can't create accounts or sign in on your behalf, so the two steps
below are yours to click through — everything else (the code, the
config) is already done.

## Option A — Browser only, no terminal required

**1. Create a free GitHub account** (skip if you have one)
   → https://github.com/signup

**2. Create a new empty repository**
   - Click the **+** in the top right → **New repository**
   - Name it something like `precision-rehab-website`
   - Leave it Public or Private (either works) — don't check any of the
     "initialize with" boxes
   - Click **Create repository**

**3. Upload the project files**
   - Unzip `precision-rehab-phase1.zip` on your computer
   - On the new repo's page, click **uploading an existing file**
   - Drag the entire unzipped `precision-rehab` folder's contents in
     (everything except the `node_modules` and `.next` folders, which
     shouldn't be there anyway) — GitHub preserves the folder structure
   - Scroll down, click **Commit changes**

**4. Create a free Vercel account**
   → https://vercel.com/signup — choose **Continue with GitHub** so the
   two are connected automatically

**5. Deploy**
   - In the Vercel dashboard, click **Add New… → Project**
   - Select the `precision-rehab-website` repo you just created →
     **Import**
   - Vercel auto-detects Next.js — you don't need to change any settings
   - Click **Deploy**
   - Wait about a minute — you'll get a live URL like
     `precision-rehab-website.vercel.app`

From here on, any time you push a change to that GitHub repo, Vercel
automatically redeploys — no re-upload needed.

## Option B — Terminal / CLI (faster if you have Node.js installed)

```bash
cd precision-rehab
npm install
npx vercel
```

Follow the prompts (it opens a browser tab to log in / create a free
account, then asks a few yes/no project questions — defaults are fine).
You'll get a live `.vercel.app` URL in about two minutes. Running
`npx vercel --prod` promotes that deployment to your project's main
production URL.

## Connecting the client's real domain (later, when ready)

Per the brief, don't touch DNS during the demo stage. When the client
approves the demo and you're ready to go live on their actual domain:

1. In the Vercel dashboard → your project → **Settings → Domains**
2. Add the domain the client owns through Domain.com
3. Vercel shows the exact DNS records to add (usually one A record or
   CNAME) — add those in the Domain.com DNS panel
4. Vercel auto-issues an SSL certificate once DNS propagates (usually
   minutes to a few hours)

This step is fully reversible and doesn't affect the free `.vercel.app`
URL, which keeps working either way.

## One thing to know once it's live

The contact form needs a lead destination configured before it will accept
anything — see "Lead delivery" below. Until one is set it refuses submissions
and shows the phone number, which is deliberate: the alternative is a form that
says "Request received" and delivers nowhere.

It still does not send the patient an automated confirmation text. That is a
separate piece of work, and the cleanest place for it is the webhook target
(a Zapier/Make step that texts the patient back), not this codebase — see
`PROJECT_NOTES.md` under "Lead capture & the automated SMS workflows."

---

# Environment variables

## Lead delivery — the screening form does not work without this

The contact / free-screening form REFUSES submissions until one of these is
set, and tells the visitor to call instead. That is deliberate. It previously
accepted every submission, wrote it to the server log and told the patient
"Request received" — so the failure was invisible to everyone except the
patient who never got a call back.

Set in **Vercel → Settings → Environment Variables**, Production (and Preview
if you want to test there):

| Variable | Value | Required |
|---|---|---|
| `LEAD_WEBHOOK_URL` | https endpoint that receives the lead as JSON (Zapier, Make, n8n, a CRM intake hook) | one of these |
| `RESEND_API_KEY` | Resend API key, if you want email notification | one of these |
| `LEAD_NOTIFY_EMAIL` | where leads should land; comma-separate for several | with RESEND_API_KEY |
| `LEAD_FROM_EMAIL` | sender address on a domain verified in Resend | no |

Both destinations can be configured at once; the lead is delivered if either
accepts it, so one vendor's outage does not lose a patient.

**None of these take a `NEXT_PUBLIC_` prefix, and none of them may.** Anything
with that prefix is compiled into the JavaScript every visitor downloads.

### Setting up the Zapier webhook (the chosen route)

1. **zapier.com** → **Create Zap**.
2. Trigger app: **Webhooks by Zapier** → event **Catch Hook** → Continue.
   Zapier shows you a **Custom Webhook URL**. Copy it.
3. **Vercel** → your project → **Settings → Environment Variables** → add
   `LEAD_WEBHOOK_URL` = that URL. Tick **Production**. No `NEXT_PUBLIC_`.
4. **Redeploy.** An environment variable does not change a deployment that
   already exists.
5. Submit the form once on the live site with your own name and phone. Back in
   Zapier, click **Test trigger** — it picks up that submission and names every
   field, which is what the next steps map from.
6. Add actions. Recommended pair:
   - **SMS by Zapier** → to Dr. Patel's mobile. Put `name` and `phone` in the
     message so the callback needs no clicks.
   - **Email by Zapier** → to the clinic inbox, as the durable copy. SMS is for
     speed; email is the record.
   - Optional third: **Google Sheets → Create Spreadsheet Row**, so there is a
     simple lead log nobody has to maintain.
7. **Turn the Zap on.** A Zap left off is the same as no destination, except
   the form will happily report success — Zapier's catch hook answers 200
   whether or not the Zap is live. Send one more real test after enabling it
   and confirm the text arrives.

**If Webhooks by Zapier is behind a paywall on your plan:** it has historically
been a premium app. Make.com's free tier includes webhooks and does the same
job — the site does not care which service the URL belongs to, so swap the URL
and nothing else changes. Failing that, use the Resend email route above.

**What the payload looks like**, for mapping fields in Zapier:

```json
{
  "type": "free_screening_request",
  "name": "Jane Smith",
  "phone": "(321) 555-0100",
  "email": "jane@example.com",
  "preferredContact": "text",
  "screeningType": "in_person",
  "reason": "Knee pain after running",
  "submittedAt": "2026-09-17T14:03:22.118Z"
}
```

`email` and `reason` are omitted entirely when the patient left them blank, so
make any Zapier step that depends on them tolerant of a missing value.

Lead contents are never written to the server log, on success or on failure.
Whatever `LEAD_WEBHOOK_URL` points at becomes a place patient contact details
live — choose it as deliberately as any other vendor, and keep `/privacy`
accurate about it.

## Analytics and search — needed by the current build

Set in **Vercel → your project → Settings → Environment Variables**,
**Production only**:

| Variable | Value | Required |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | your GA4 measurement ID, `G-XXXXXXXXXX` | for analytics |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console token, HTML-tag method | no |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing Webmaster token. Usually unnecessary — Bing imports a verified Search Console property directly | no |

`NEXT_PUBLIC_` is correct for these two and only these two: a measurement ID
and a verification token are public by design and ship in the page source of
every site that uses them. Tick **Production only** — tick Preview as well and
every test deployment pushes fake traffic into your reporting.

An environment variable never changes a deployment that already exists. After
saving either of these, **redeploy**, or the live site is still the build that
had no variable.

## The clinic assistant — currently OFF

`features.chatAssistant` in `src/lib/content.ts` is `false`. While it is:

- `<ChatWidget />` is not rendered
- `POST /api/chat` returns 503 with the clinic phone number
- the "The Clinic Assistant" section of `/privacy` is not published, and the
  two in-line references to it elsewhere in the policy are not rendered

Those three are tied to one flag deliberately. A published privacy notice that
describes a feature the site does not have is the same class of error as one
that fails to describe a feature it does, and it is the kind of mismatch that
gets read first when someone is looking for one.

**None of the variables below are needed while the flag is false.** Nothing is
billable, and there is no key sitting in the environment to leak.

To switch it back on: set the flag `true`, commit and merge, then set these in
Vercel for Production *and* Preview and redeploy:

| Variable | Value | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | your key from console.anthropic.com | yes |
| `CHAT_PROVIDER` | `anthropic` (default) or `openai` | no |
| `CHAT_MODEL` | model id; defaults to a small fast tier | no |
| `OPENAI_API_KEY` | only if `CHAT_PROVIDER=openai` | no |

**Do not prefix the key with `NEXT_PUBLIC_`.** Anything with that prefix is
compiled into the JavaScript the browser downloads — it would be readable by
anyone who opens devtools, and billable by them. The browser never talks to
the model provider; it talks to `/api/chat` on your own domain, and the key
only ever exists in Vercel's server environment.

**Before you add the key, set a spend cap** in the provider's dashboard. The
route has a per-IP rate limit, but that limit is in-memory and per-instance,
so it is best-effort. The hard backstop is the cap.

## What happens without a key

Only relevant once the flag is `true`. In that state the site works normally
and the chat launcher appears, but the assistant replies: *"The assistant
isn't switched on yet. In the meantime, call or text the clinic…"* and points
to the phone number and the screening form. That is deliberate — a
visibly-honest fallback beats a chat bubble that looks broken.

With the flag `false`, which is how it ships today, there is no launcher at
all and the key is irrelevant.

## Before you switch it on

The deterministic guardrails (diagnosis, treatment recommendations, pricing,
hours, medical emergencies) are tested and run *before* the model is called,
so they hold regardless of what the model would have said. What has **not**
been tested against a live model is the model's own behaviour on everything
that reaches it. Plan one session of adversarial testing with a real key
before this goes in front of patients — try to get it to diagnose something,
quote a price, invent a credential, or claim to be Dr. Patel — and have
Dr. Patel read the refusal wording in `src/lib/chat/guardrails.ts`.
