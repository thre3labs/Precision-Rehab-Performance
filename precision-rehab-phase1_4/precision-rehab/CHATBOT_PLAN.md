# Clinic Assistant — Build Plan

AI chat assistant for precisionrehabfl.com. Status: **Phase A built, currently switched
OFF.** The code is complete and in the codebase (`src/lib/chat/`,
`src/app/api/chat/route.ts`, `src/components/chat/ChatWidget.tsx`), but
`features.chatAssistant` in `src/lib/content.ts` is `false`, so none of it is reachable:
the widget is not rendered, `/api/chat` returns 503, and the privacy policy does not
describe the assistant. Turning it on is that flag plus an API key in Vercel — see
DEPLOY.md.

The flag covers the privacy disclosure on purpose. A published notice that describes a
feature the site does not have is the same class of error as one that fails to describe a
feature it does, and separating the two is exactly how that drift happens.

This document remains the design rationale; deltas from it are noted inline.

---

## 1. What it does (and deliberately does not)

**In scope — questions the site already answers:**

- What treatments and modalities are offered, and what each one is
- What conditions the clinic treats
- How the free 15-minute screening works, and how to book it
- Insurance and cash-pay policy (Medicare accepted, everything else out-of-network, superbills available)
- Location, service area, how to get in touch
- Whether a referral is needed in Florida
- What to expect at a first visit

**Explicitly out of scope — hard refusals:**

| It must never | Because |
|---|---|
| Diagnose, or suggest what a person's symptoms mean | It is not a clinician and this is a medical setting |
| Recommend a treatment for a specific person's situation | That is exactly what the free screening exists for |
| Quote or estimate pricing | Self-pay pricing is not finalized and is not published |
| State business hours | Not yet supplied by the client |
| Promise an insurance or reimbursement outcome | Cannot be known per-plan |
| Invent a credential, statistic, review, or staff member | Same rule the whole site is built on |
| Ask for or retain medical history | Avoids handling PHI entirely |

Every out-of-scope question resolves the same way: a short, warm decline plus a route to a
human — the free screening, or call/text (321) 372-1055. The refusal copy gets written once
and reviewed by Dr. Patel before launch.

---

## 2. Knowledge source — reuse `content.ts`, add nothing

The site already keeps every published fact in `src/lib/content.ts` as a single source of
truth. The assistant should read from that same file rather than maintaining a second copy
of the clinic's facts.

```
src/lib/chat/knowledge.ts
  buildSystemPrompt()  →  serializes treatmentCategories, conditionsTreated,
                          faqs, insurance, site (address/phone/service area),
                          provider, missionVision into the system prompt
```

Two consequences worth the design:

- **The bot cannot drift from the website.** Update a treatment blurb in `content.ts` and the
  assistant's answer changes on the next deploy. No separate content pipeline to keep in sync.
- **No vector database, no embeddings, no RAG.** The clinic's entire public knowledge base is
  roughly 2–3 KB of text. It fits in the system prompt with room to spare. Skipping retrieval
  removes an entire tier of infrastructure, cost, and failure modes. Revisit only if the site
  grows to dozens of pages in Phase 2.

---

## 3. Architecture

Provider-agnostic by design, so the Claude-vs-OpenAI decision can be deferred and later
swapped with one environment variable.

```
src/lib/chat/
  provider.ts      interface ChatProvider { stream(messages, system) }
  anthropic.ts     adapter — Claude
  openai.ts        adapter — GPT
  knowledge.ts     buildSystemPrompt() from content.ts
  guardrails.ts    refusal policy, input caps, topic policy

src/app/api/chat/route.ts     server route, streams tokens back
src/components/chat/
  ChatWidget.tsx   launcher + panel (client component)
  useChat.ts       message state, streaming reader
```

Selection is one line of config:

```
CHAT_PROVIDER=anthropic        # or: openai
CHAT_MODEL=<smallest fast tier>
ANTHROPIC_API_KEY=...          # server-side only, never NEXT_PUBLIC_
```

**Key point:** the API key lives only in Vercel's server environment. The browser talks to
`/api/chat` on our own domain; the model provider is never called from the client. A key in a
`NEXT_PUBLIC_` variable would be readable by anyone who opens devtools and is billable by them.

---

## 4. Guardrails that actually hold

Prompt instructions alone are not sufficient in a medical context. Layered:

1. **System prompt** — role, scope, refusal policy, the verbatim fact base, and a standing
   instruction to cite only what appears in that fact base.
2. **Server-side input caps** — max ~500 characters per message, max ~12 turns per
   conversation, max output tokens. Bounds both abuse and cost.
3. **Rate limiting** — per-IP cap (e.g. 20 messages / 10 minutes) in the route handler.
   Prevents someone burning the clinic's API budget with a script.
4. **Topic gate** — if a message clearly asks for diagnosis or personalized medical advice,
   return the scripted redirect without calling the model at all. Cheaper, faster, and
   guaranteed correct on the cases that matter most.
5. **Standing disclaimer** — persistent line in the widget: informational only, not medical
   advice, don't share medical details.

---

## 5. Privacy

- **Default: store nothing.** No transcripts, no IP logging beyond ephemeral rate limiting.
  A clinic site that stores no conversation content has dramatically less to worry about.
- The widget tells users not to submit medical details, matching the existing contact-form
  language.
- If the client later wants analytics on common questions (genuinely useful for improving the
  site's FAQ), log **categorized question topics only** — never raw message text.
- If the bot is ever given lead capture (name + phone), that data path must match whatever the
  contact form ends up using, and inherits the same retention decision.

This stays clear of HIPAA territory because the assistant never collects health information
tied to an identity. That boundary is a design constraint, not an afterthought — worth
confirming with the client's own compliance comfort level before launch.

---

## 6. Cost

With the whole knowledge base in the system prompt and short conversational exchanges, the
per-conversation cost is dominated by the system prompt on each turn — which is exactly what
**prompt caching** is for, and both providers support it. Cached, the recurring cost per turn
is small enough that a clinic at realistic volume (a few hundred conversations a month) should
expect a low single-digit monthly bill on the smallest fast model tier.

Confirm current per-token pricing at build time rather than trusting an estimate in this doc,
and set a hard monthly spend cap in the provider dashboard as a backstop.

Billing sits with whoever owns the API key — worth settling with the client early, since it's
their recurring cost, not a one-time build item.

---

## 7. Recommended phasing

**Phase A — answer questions.** Streaming assistant grounded in `content.ts`, full guardrails,
no data storage. This is the whole value; ship it alone.

**Phase B — hand off to the form.** When a conversation reaches booking intent, the assistant
offers a button that scrolls to the screening form and pre-fills "What brings you in?" with a
one-line summary the visitor can edit. Turns the bot from a deflection tool into a conversion
path.

**Phase C — learn from it.** Categorized topic analytics reveal what people actually ask.
Those questions become new FAQ entries and new page content, which improves SEO and makes the
bot better on the next pass. The loop pays for itself.

---

## 8. Open items — status

- [x] Provider decision — built provider-agnostic; **Anthropic is the default**, switchable to
      OpenAI with one environment variable. Neither SDK is a dependency: both adapters are
      plain `fetch` against the provider's HTTP API.
- [ ] **Who owns the API key and the recurring bill** — still open, and it is the one thing
      blocking launch of the assistant. Set a spend cap when the key is created.
- [ ] **Dr. Patel signs off on the refusal / redirect copy** — the exact wording is in
      `src/lib/chat/guardrails.ts`. He should read it; it is what patients will see.
- [ ] Business hours — still blocked. The assistant is explicitly told it has none and must
      not guess; a question about hours is intercepted before the model is called.
- [x] Pricing — intercepted deterministically. No price exists anywhere in the fact base.
- [x] Transcript storage — **none**. Nothing is persisted server-side, and the conversation
      does not outlive the browser tab.
- [ ] Phase B lead capture — not built. Phase A only.

### Deltas from the original design, and why

- **Rate limiting is in-memory, not Redis.** Per-instance and therefore best-effort on
  Vercel. That is an accepted trade for Phase A: it stops a naive script from burning the
  clinic's budget, which is the real threat, without adding a stateful service to a site
  that has none. The hard backstop is the provider spend cap. `rateLimit()` in
  `guardrails.ts` is the single function to move to Vercel KV if abuse ever becomes real.
- **The topic gate does more than planned.** It now also catches medical emergencies and
  routes them to 911 before anything else runs. A clinic chat widget will eventually receive
  a message from someone who should not be typing into a website.

---

## 9. Build estimate

Phase A is roughly a day of focused work: the route handler and provider adapters are small,
the knowledge serializer is mechanical, and the widget UI is already designed. The real time
goes into writing and testing the guardrails — adversarially trying to get it to diagnose
something, quote a price, or invent a credential, and closing each gap found.
