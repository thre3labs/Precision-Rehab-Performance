import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/chat/guardrails";
import { deliverLead, leadDeliveryConfigured, type Lead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ============================================================================
 * CONTACT / FREE-SCREENING SUBMISSION
 * ============================================================================
 * This route used to validate the input, `console.log` it, and return
 * `{ ok: true }`. The form then told the patient "Request received — we'll be
 * in touch shortly" and nobody was ever notified. It is the most expensive
 * class of bug a clinic site can have, because it looks like it works.
 *
 * It now returns success only when a configured destination has accepted the
 * lead. See src/lib/leads.ts for the destinations and how to configure them.
 *
 * WHAT THIS ROUTE DELIBERATELY DOES NOT DO
 *   - It does not log lead contents, on success or on failure. See leads.ts.
 *   - It does not retry. A patient watching a spinner is worse served by a
 *     slow retry loop than by a fast, honest failure that shows them the phone
 *     number. Durability belongs in the destination (a webhook with a queue),
 *     not in an HTTP handler the browser is blocked on.
 * ============================================================================
 */

const MAX = { name: 120, phone: 40, email: 160, reason: 2000, choice: 40 };

/** Trim, bound, and drop anything that is not a usable string. */
function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  // Vercel sets x-forwarded-for; fall back to a constant so a missing header
  // shares one bucket rather than bypassing the limit entirely.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please call or text the clinic instead." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot. The field is hidden from people and from screen readers, so only
  // a bot filling every input reaches this. Answer 200 so it does not retry or
  // go looking for another way in, but deliver nothing.
  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const phone = clean(body.phone, MAX.phone);

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone number are required." },
      { status: 400 },
    );
  }

  // If there is nowhere to send this, say so rather than accepting it into
  // nothing. The form shows the phone number when it sees a failure.
  if (!leadDeliveryConfigured()) {
    console.error(
      "[contact] no lead destination configured — set LEAD_WEBHOOK_URL or " +
        "RESEND_API_KEY + LEAD_NOTIFY_EMAIL. Submission was NOT delivered.",
    );
    return NextResponse.json(
      { error: "The form isn't available right now." },
      { status: 503 },
    );
  }

  const lead: Lead = {
    name,
    phone,
    email: clean(body.email, MAX.email) || undefined,
    preferredContact: clean(body.preferredContact, MAX.choice) || undefined,
    screeningType: clean(body.screeningType, MAX.choice) || undefined,
    reason: clean(body.reason, MAX.reason) || undefined,
    submittedAt: new Date().toISOString(),
  };

  const delivered = await deliverLead(lead);

  if (!delivered) {
    return NextResponse.json(
      { error: "We couldn't send your request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
