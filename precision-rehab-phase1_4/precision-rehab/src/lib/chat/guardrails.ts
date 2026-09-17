import { site } from "@/lib/content";

/**
 * Layered guardrails. The system prompt does most of the work, but prompt
 * instructions alone are not sufficient in a medical setting, so the cases
 * that matter most are handled here — before the model is ever called.
 *
 * That has three benefits: it is cheaper, it is faster, and it is
 * deterministic. A regex cannot be talked out of its answer.
 */

export const MAX_MESSAGE_CHARS = 500;
export const MAX_TURNS = 12;
export const MAX_OUTPUT_TOKENS = 600;

const CALL_TO_ACTION = `The fastest way to get a real answer is the free 15-minute screening with Dr. Patel — there's a form on this page — or call or text the clinic at ${site.phoneDisplay}.`;

type Gate = { pattern: RegExp; reply: string };

/**
 * Ordered — first match wins, so the most serious gate (diagnosis) is checked
 * before the softer ones.
 *
 * These patterns are intentionally broad. A false positive costs a visitor one
 * redirect to a human, which is a fine outcome on a clinic site. A false
 * negative costs a diagnosis from a chatbot, which is not.
 */
const GATES: Gate[] = [
  {
    // asking what their symptoms mean, or for a diagnosis
    pattern:
      // "should i get" is deliberately NOT here: "should I get dry needling"
      // is a treatment question, and the next gate answers it better.
      /\b(do i have|what('?s| is) wrong with|is (this|it|my)\s+\w+\s+(a|an|serious|torn|broken|fractured)|diagnos\w*|should i (see|be worried)|is (this|it) (serious|normal|bad)|why does my \w+ hurt|what could (this|it|my)\b)/i,
    reply: `I'm not able to tell you what's causing your symptoms — I'm an automated assistant, not a clinician, and that really does need a proper assessment. ${CALL_TO_ACTION}`,
  },
  {
    // asking for a personalized treatment recommendation
    pattern:
      // "do i need" is scoped to clinical decisions only. A bare `do i need`
      // swallowed "do i need a referral in Florida?", which is an FAQ the site
      // answers and the assistant should be allowed to answer too.
      /\b(what (treatment|therapy) (should|would) i|should i get\b|which (treatment|modality|therapy) (is|would be) (best|right)|would (dry needling|shockwave|laser|cupping) (help|work|be good) for (me|my)|do i need (surgery|an? (mri|x-?ray|scan|injection)|injections?)\b)/i,
    reply: `Which treatment fits you is something Dr. Patel decides after actually assessing you — I'd be guessing, and that's not useful to you. ${CALL_TO_ACTION} I'm happy to explain what any of the treatments are in the meantime.`,
  },
  {
    // pricing
    pattern:
      /\b(how much|what (do|does|would) (it|this|that|a session|treatment) cost|price|pricing|pay per|per session|cost of|rates?|fees?|copay|co-pay|charge|afford|cheap|expensive)\b/i,
    reply: `Self-pay pricing is still being finalized, so I don't have numbers to give you — and I'd rather say that than guess. The clinic will walk you through it directly: call or text ${site.phoneDisplay}, or ask during the free 15-minute screening.`,
  },
  {
    // hours / when are you open
    pattern:
      /\b(hours|what time|when (are|do) you (open|close|available)|open (on|today|tomorrow|saturday|sunday|weekends?)|closing time|opening time)\b/i,
    reply: `The clinic hasn't published its hours yet, so I don't want to give you a time that turns out to be wrong. Call or text ${site.phoneDisplay} and they'll confirm availability.`,
  },
  {
    // emergencies — route to real help, immediately and without hedging
    pattern:
      /\b(emergency|can'?t breathe|chest pain|numbness in (both|my) (legs|arms)|lost feeling|can'?t feel my|severe bleeding|passed out|suicid|kill myself|911)\b/i,
    reply:
      "If this is a medical emergency, please call 911 or go to your nearest emergency room now — don't wait on a website chat. This clinic provides outpatient physical therapy by appointment and isn't set up for urgent care.",
  },
];

export type GateResult = { blocked: true; reply: string } | { blocked: false };

export function checkTopicGate(message: string): GateResult {
  for (const g of GATES) {
    if (g.pattern.test(message)) return { blocked: true, reply: g.reply };
  }
  return { blocked: false };
}

/* --------------------------------------------------------------------------
 * Rate limiting.
 *
 * In-memory and per-instance. On Vercel that means it is best-effort: a
 * serverless instance can be recycled, and concurrent instances each keep
 * their own counter, so the real ceiling is higher than the number below.
 *
 * That is an accepted trade for Phase A. It stops a naive script from burning
 * the clinic's API budget, which is the actual threat here, without adding a
 * Redis dependency to a site that has no other stateful service. If abuse ever
 * becomes real, this is the function to move to Vercel KV or Upstash.
 * -------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfter };
  }

  recent.push(now);
  hits.set(key, recent);

  // opportunistic cleanup so the map cannot grow without bound
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { ok: true };
}
