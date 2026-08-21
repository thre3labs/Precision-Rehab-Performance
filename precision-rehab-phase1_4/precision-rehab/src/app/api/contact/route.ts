import { NextRequest, NextResponse } from "next/server";

/**
 * ============================================================================
 * CONTACT FORM SUBMISSION HANDLER — STUB
 * ============================================================================
 * This is a working stub: it validates input and returns success so the
 * Phase 1 demo form is fully functional end-to-end. It does NOT yet persist
 * leads anywhere or send the automated confirmation text — both are
 * documented below and in PROJECT_NOTES.md so they can be wired up without
 * touching the frontend.
 *
 * RECOMMENDED PRODUCTION ARCHITECTURE (provider-agnostic)
 * ----------------------------------------------------------------------------
 * 1. Lead storage: write each submission to a simple store (e.g. a
 *    lightweight database, Airtable, or the CRM the clinic ends up using)
 *    so nothing is lost even if downstream steps fail.
 *
 * 2. Automated "Contact Form Submission -> Text" workflow:
 *    Don't call a single SMS vendor's SDK directly from this route.
 *    Instead, POST the lead to a small "notifications" service/webhook
 *    (e.g. a serverless function) that owns the actual SMS provider
 *    integration. That indirection means the PT practice can swap SMS
 *    vendors later (Twilio, OpenPhone, CallRail, a PT-specific EMR/CRM
 *    with built-in texting, etc.) without ever touching this website's
 *    code — only the webhook target changes.
 *
 *    Twilio Programmable Messaging is a strong default recommendation:
 *    inexpensive, reliable, well-documented, and easy for a future
 *    developer/agency to swap out. Trigger it from this route (or from
 *    the lead-storage step's "on create" hook) to send:
 *      "Thanks for contacting Precision Rehab & Performance. We've
 *       received your request and will be in touch shortly."
 *
 * 3. "Missed Call -> Text" workflow:
 *    This one is triggered by phone activity, not the website, so it
 *    belongs to whatever handles the clinic's phone line — most cleanly
 *    a call-tracking/VoIP number (e.g. Twilio Voice, CallRail, OpenPhone,
 *    or a PT-focused practice-management phone system). Configure that
 *    provider's "missed call" event to fire an SMS automatically. This
 *    requires no website code at all; it's a phone-system setting. Using
 *    a dedicated tracking number for the site's "Call Now" links also
 *    gives you call-source attribution for marketing spend.
 *
 * 4. Compliance note: physical therapy leads can involve health
 *    information. Confirm whatever storage/CRM and SMS vendor combination
 *    is chosen is appropriate for the type of data actually collected
 *    (this form intentionally avoids collecting detailed medical history).
 * ============================================================================
 */

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  preferredContact?: string;
  screeningType?: string;
  reason?: string;
};

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name || !body.phone) {
    return NextResponse.json(
      { error: "Name and phone number are required." },
      { status: 400 }
    );
  }

  // TODO (production): persist `body` to lead storage, then trigger the
  // notifications webhook described above to send the confirmation text.
  console.log("New contact form lead:", {
    ...body,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
