/**
 * ============================================================================
 * LEAD DELIVERY
 * ============================================================================
 * Where a submitted screening request actually goes.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: the form must never tell a patient
 * "request received" unless a real destination accepted it. The previous
 * implementation wrote the lead to the server log and returned success, so a
 * patient typed their name, phone and symptoms, read "we'll be in touch
 * shortly", and nobody was notified. A form that fails loudly is a bad
 * experience; a form that fails silently costs the clinic the patient and the
 * patient their appointment. If nothing below is configured, the route says so
 * and the page shows the phone number instead.
 *
 * ----------------------------------------------------------------------------
 * CONFIGURATION — set either of these in Vercel, or both
 * ----------------------------------------------------------------------------
 *
 *   LEAD_WEBHOOK_URL    An https endpoint that receives the lead as JSON.
 *                       Point it at Zapier, Make, n8n, a CRM intake hook, or
 *                       a Slack/Teams incoming webhook. This is the lowest
 *                       commitment option: no vendor SDK, no account needed
 *                       here, and the clinic can change where leads land
 *                       without anyone touching this code.
 *
 *   RESEND_API_KEY      Sends an email notification through Resend's REST API
 *   LEAD_NOTIFY_EMAIL   (no SDK, just fetch). LEAD_NOTIFY_EMAIL is where the
 *   LEAD_FROM_EMAIL     clinic wants leads; LEAD_FROM_EMAIL must be an address
 *                       on a domain verified in Resend, and defaults to
 *                       onboarding@resend.dev, which only delivers to the
 *                       Resend account owner. For real use, verify the clinic
 *                       domain in Resend and set this.
 *
 * None of these carry a NEXT_PUBLIC_ prefix, and none of them may. Anything
 * with that prefix is compiled into the JavaScript every visitor downloads.
 *
 * ----------------------------------------------------------------------------
 * PRIVACY
 * ----------------------------------------------------------------------------
 * The form asks people not to include medical history, and the lead is not a
 * clinical record. Even so it carries a name, a phone number and a sentence
 * about why someone wants physical therapy, so:
 *
 *   - lead contents are NEVER written to a log. Failures log the destination
 *     and the status code, never the payload. Vercel logs are visible to
 *     anyone with project access and are not a place for patient details.
 *   - whatever LEAD_WEBHOOK_URL points at becomes a place patient contact
 *     details are stored. Choose it as deliberately as any other vendor, and
 *     keep /privacy accurate about it — the policy describes this flow, and
 *     the two are meant to move together.
 * ============================================================================
 */

export type Lead = {
  name: string;
  phone: string;
  email?: string;
  preferredContact?: string;
  screeningType?: string;
  reason?: string;
  submittedAt: string;
};

/** True when at least one delivery destination is configured. */
export function leadDeliveryConfigured(): boolean {
  return Boolean(
    process.env.LEAD_WEBHOOK_URL ||
      (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL),
  );
}

const LABELS: Record<string, string> = {
  phone: "Phone call",
  text: "Text message",
  email: "Email",
  in_person: "In person",
  virtual: "Virtual",
  not_sure: "Not sure yet",
};
const label = (v?: string) => (v ? (LABELS[v] ?? v) : "—");

function plainText(lead: Lead): string {
  return [
    `New free-screening request from the website`,
    ``,
    `Name:              ${lead.name}`,
    `Phone:             ${lead.phone}`,
    `Email:             ${lead.email || "—"}`,
    `Prefers:           ${label(lead.preferredContact)}`,
    `Screening:         ${label(lead.screeningType)}`,
    ``,
    `What brings them in:`,
    lead.reason?.trim() || "(not provided)",
    ``,
    `Submitted: ${lead.submittedAt}`,
  ].join("\n");
}

/** Escapes text before it goes into the HTML email body. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWebhook(lead: Lead, url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "free_screening_request", ...lead }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[leads] webhook responded ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[leads] webhook failed: ${(err as Error).name}`);
    return false;
  }
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return false;

  const from = process.env.LEAD_FROM_EMAIL || "onboarding@resend.dev";
  const text = plainText(lead);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        // The patient's own address, so the clinic can hit reply. Only set
        // when they gave one.
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject: `Free screening request — ${lead.name}`,
        text,
        html: `<pre style="font:14px/1.6 ui-monospace,monospace">${esc(text)}</pre>`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[leads] resend responded ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[leads] resend failed: ${(err as Error).name}`);
    return false;
  }
}

/**
 * Delivers to every configured destination. Succeeds if AT LEAST ONE accepted
 * the lead — with both configured, a Zapier outage should not lose a patient
 * whose details reached the clinic's inbox regardless.
 */
export async function deliverLead(lead: Lead): Promise<boolean> {
  const attempts: Promise<boolean>[] = [];

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) attempts.push(sendWebhook(lead, webhook));
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) {
    attempts.push(sendEmail(lead));
  }
  if (attempts.length === 0) return false;

  const results = await Promise.all(attempts);
  return results.some(Boolean);
}
