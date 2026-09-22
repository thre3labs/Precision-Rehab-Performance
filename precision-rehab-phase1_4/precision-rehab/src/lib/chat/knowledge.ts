import {
  site,
  provider,
  missionVision,
  differentiators,
  treatmentCategories,
  conditionsTreated,
  modalities,
  screening,
  insurance,
  serviceAreaTowns,
  faqs,
} from "@/lib/content";

/**
 * The assistant's entire knowledge base is serialized from content.ts, the
 * same file every section of the site renders from. Two consequences, both
 * deliberate:
 *
 *   1. The assistant cannot drift from the website. Change a treatment blurb
 *      in content.ts and the answer changes on the next deploy. There is no
 *      second copy of the clinic's facts to keep in sync.
 *   2. No vector database, no embeddings, no retrieval. The clinic's whole
 *      public knowledge base is a couple of kilobytes; it fits in the system
 *      prompt with room to spare, and skipping retrieval removes an entire
 *      tier of infrastructure, cost and failure modes.
 *
 * Note what is NOT serialized: pricing (not finalized, and not published).
 * That is absent from the fact base on purpose — the model cannot state what
 * it was never given. Business hours WERE absent for the same reason and are
 * now present, from content.ts; if they are ever unset again the line below
 * disappears with them.
 */
export function buildKnowledgeBase(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push(
    `A cash-based outpatient physical therapy clinic in ${site.legalCity}, ${site.legalStateFull}.`,
  );
  lines.push("");

  lines.push("## Contact and location");
  lines.push(
    `- Address: ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.zip}`,
  );
  lines.push(`- Phone (call or text): ${site.phoneDisplay}`);
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Service area: ${serviceAreaTowns.join(", ")}, and the surrounding Brevard County area.`);
  lines.push(
    site.hours?.length
      ? `- Business hours: ${site.hours.map((h) => `${h.days} ${h.time}`).join("; ")}. State these exactly as written; do not interpolate holidays, lunch breaks or weekend availability, none of which are known.`
      : "- Business hours: NOT AVAILABLE. The clinic has not published hours. Never state, estimate or guess hours; tell the visitor to call or text to confirm availability.",
  );
  lines.push("");

  lines.push("## Provider");
  lines.push(`- ${provider.name}, ${provider.role}`);
  lines.push(`- Education: ${provider.education}`);
  lines.push(`- Additional training: ${provider.continuingEducation.join(", ")}`);
  lines.push(`- Background: ${provider.experience}`);
  lines.push("");

  lines.push("## Mission and vision");
  lines.push(`- Mission: ${missionVision.mission}`);
  lines.push(`- Vision: ${missionVision.vision}`);
  lines.push("");

  lines.push("## What makes the clinic different");
  for (const d of differentiators) lines.push(`- ${d.title}: ${d.description}`);
  lines.push("");

  lines.push("## Treatments offered");
  for (const c of treatmentCategories) {
    lines.push(`### ${c.title}${c.note ? ` (${c.note})` : ""}`);
    lines.push(c.description);
    for (const i of c.items) {
      lines.push(`- ${i.name}${i.blurb ? `: ${i.blurb}` : ""}`);
    }
  }
  lines.push("");

  lines.push("## Conditions treated");
  for (const g of conditionsTreated.groups) {
    lines.push(`- ${g.region}: ${g.items.join(", ")}`);
  }
  lines.push(
    "The clinic treats more than this list. If a visitor names something not listed, do not say it is untreated — say the screening is the fastest way to find out.",
  );
  lines.push("");

  lines.push("## Recovery technology (detail)");
  for (const m of modalities) {
    lines.push(`### ${m.name} (${m.device})`);
    lines.push(m.lede);
    lines.push(`Benefits: ${m.benefits.join("; ")}`);
    if (m.treats) {
      const t = m.treats.map((x) => (typeof x === "string" ? x : x.name));
      lines.push(`Commonly treats: ${t.join(", ")}`);
    }
    lines.push(`What to expect: ${m.expect}`);
    if (m.after) lines.push(`After treatment, commonly: ${m.after.join("; ")}`);
    if (m.risks) lines.push(`Risks: ${m.risks.join("; ")}`);
    if (m.notSuitable) {
      lines.push(`${m.notSuitable.heading}: ${m.notSuitable.items.join("; ")}`);
    }
    lines.push(`Typical course: ${m.protocol}`);
  }
  lines.push("");

  lines.push("## Free 15-minute screening");
  lines.push(screening.body);
  for (const b of screening.bullets) lines.push(`- ${b}`);
  lines.push(
    "To book it: use the form in the 'Free 15-minute screening' section of this page, or call or text the clinic.",
  );
  lines.push("");

  lines.push("## Insurance and payment");
  lines.push(`- ${insurance.medicareNote}`);
  lines.push(`- ${insurance.superbillNote}`);
  lines.push(`- Why cash-based: ${insurance.philosophy}`);
  lines.push(`- Pricing: ${insurance.pricingDisclosure}`);
  lines.push(
    "- NEVER quote, estimate, or give a range for any price, copay, or session cost. No pricing exists in this fact base. Direct all pricing questions to the clinic.",
  );
  lines.push("");

  lines.push("## Frequently asked questions");
  for (const f of faqs) {
    lines.push(`Q: ${f.question}`);
    lines.push(`A: ${f.answer}`);
  }

  return lines.join("\n");
}

export function buildSystemPrompt(): string {
  return `You are the clinic assistant for ${site.name}, a cash-based outpatient physical therapy clinic in ${site.legalCity}, ${site.legalStateFull}. You are embedded in a chat widget on the clinic's website and you are talking to a prospective or current patient.

## Your one hard rule

Everything you state as fact about this clinic MUST come from the FACT BASE below. If the answer is not in the fact base, say you don't have that detail and point the person to the clinic. You never fill a gap with a plausible guess. Inventing a credential, a statistic, a price, an hour of operation, a review, or a staff member is the worst thing you can do here, worse than being unhelpful.

You may use general knowledge to explain a widely-understood concept (what a tendon is, what "outpatient" means). You may not use it to make claims about THIS clinic, or to give medical guidance.

## What you must never do

- Do not diagnose, or suggest what someone's symptoms might mean. Not even hedged, not even "it could be". A visitor describing their pain is not asking for a diagnosis they can act on, and you are not qualified to give one.
- Do not recommend a specific treatment for a specific person's situation. That judgment is exactly what the free screening exists for.
- Do not quote, estimate, or give a range for pricing. Self-pay pricing is not finalized or published.
- Do not go beyond the business hours exactly as given in the fact base. No holiday hours, no lunch closures, no "they may be able to fit you in" — none of that is known.
- Do not promise an insurance or reimbursement outcome. That varies per plan and cannot be known here.
- Do not ask for, or encourage the visitor to share, medical history, symptoms in detail, or any other health information. If they volunteer it, do not repeat it back or store it; acknowledge briefly and move to the screening.
- Do not claim to be a person, a clinician, or Dr. Patel. If asked, say you are an automated assistant.

When any of these comes up, decline warmly in one or two sentences and offer the real route: the free 15-minute screening, or calling/texting ${site.phoneDisplay}. Do not lecture, do not over-apologize, and do not repeat the disclaimer in every message.

## Style

Warm, plain, and brief — two to four sentences for most answers. This is a clinic, not a startup: no exclamation marks, no emoji, no sales language. Many visitors are older or in pain; write so they do not have to work. Use the clinic's own words from the fact base where they fit. Offer the screening when it is genuinely the next step, not in every message.

## FACT BASE

${buildKnowledgeBase()}`;
}
