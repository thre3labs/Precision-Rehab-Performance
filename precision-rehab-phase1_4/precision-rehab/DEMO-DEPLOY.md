# Deploying this demo to Vercel

This is a **demo build**. It is not meant for `main` and not meant for the
production domain.

## The fast way — no GitHub involved (recommended)

From inside this folder:

```
npx vercel
```

Answer the prompts:

- *Set up and deploy?* → **yes**
- *Link to existing project?* → **No.** Say no and let it create a new one.
- *Project name* → something obviously separate, e.g. `precision-rehab-demo`
- *In which directory is your code located?* → `./`

It prints a URL when it finishes. That URL is the demo.

**Never run `vercel --prod` for this.** Plain `vercel` makes a preview
deployment; `--prod` is what promotes a deployment onto a production domain.

## The other way — a branch on GitHub

If you would rather Vercel build it from the repo automatically, the work is
already committed on a branch called `photo-demo`:

```
git push -u origin photo-demo
```

Vercel builds a preview for the branch by itself. Pushing a branch does not
touch `main` and does not change the live site. Don't open a pull request
unless you actually want to merge it.

## What to expect on the demo

**The screening form will refuse submissions.** It shows the phone number
instead of pretending to have sent something. That is correct behaviour, not a
bug: the form reports success only when a lead destination actually accepted
the lead, and a fresh Vercel project has no `LEAD_WEBHOOK_URL` set. To make the
form work on the demo too, add that variable in the new project's settings and
redeploy.

**The demo will not show up in Google.** Every page carries `noindex` plus an
`X-Robots-Tag` header whenever `VERCEL_ENV` is not `production`, so a preview
cannot compete with the real site for its own name. That protection is why this
link is safe to share with the client.

**It contains more than the photographs.** This build also carries the SEO,
hours, lead-delivery and domain work that was built in earlier sessions and
never pushed — the live site still says "hours coming soon" and still names
another company's domain as its canonical. So the demo is "the site as it would
be", not "the live site plus photographs".

## Still unresolved in this build

- The reception sign in the waiting-room photograph reads "PRECISION PHYSICAL
  THERAPY", which is not the clinic's name. The door decal, visible in slide 02
  of the clinic tour, is correct.
- The closing CTA photograph is a stock library image and needs a commercial
  licence confirmed before any of this goes near production.
- "Suite 101" in the tour caption contradicts `content.ts`, which says
  Unit 101. The site, the Google Business Profile and the signage all need to
  agree.
