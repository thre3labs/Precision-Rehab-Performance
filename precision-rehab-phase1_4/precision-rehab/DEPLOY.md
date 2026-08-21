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

The contact form's `/api/contact` route will accept real submissions
and log them in Vercel's function logs, but it does **not** yet send
the automated confirmation text or persist leads anywhere durable —
that's the integration work described in `PROJECT_NOTES.md` under
"Lead capture & the automated SMS workflows." Worth keeping in mind
before sharing the live link widely.
