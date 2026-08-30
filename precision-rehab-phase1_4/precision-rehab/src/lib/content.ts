/**
 * ============================================================================
 * SITE CONTENT — SINGLE SOURCE OF TRUTH
 * ============================================================================
 * Every fact on the landing page is pulled from this file. This keeps the
 * site honest (nothing invented outside this file) and makes it fast to
 * update once the client confirms outstanding details.
 *
 * Anything wrapped in [BRACKETS] or flagged `NEEDS_CLIENT_INPUT` is a
 * placeholder — confirmed with the client before production launch.
 * See NEEDS_CLIENT_INPUT below and PROJECT_NOTES.md for the full punch list.
 * ============================================================================
 */

export const site = {
  name: "Precision Rehab & Performance",
  shortName: "Precision Rehab",
  tagline: "Precision Rehab & Performance",
  legalCity: "Melbourne",
  legalState: "FL",
  legalStateFull: "Florida",
  // NEEDS_CLIENT_INPUT: production domain (client owns via Domain.com).
  // Placeholder used for canonical/OG URLs and JSON-LD until DNS is connected.
  url: "https://www.precisionrehabfl.com",
  phoneDisplay: "(321) 372-1055",
  phoneHref: "tel:+13213721055",
  // Same number is presented for both calling and texting per client info.
  // NEEDS_CLIENT_INPUT: confirm this line is SMS/text-enabled (see PROJECT_NOTES.md).
  smsHref: "sms:+13213721055",
  email: "Kushal.patel@precisionrpt.com",
  address: {
    line1: "1305 S Apollo Blvd",
    line2: "Unit 101",
    city: "Melbourne",
    state: "FL",
    zip: "32901",
    country: "US",
  },
  // Google Maps embed built from the confirmed address — no API key required.
  mapEmbedSrc:
    "https://www.google.com/maps?q=1305+S+Apollo+Blvd+Unit+101+Melbourne+FL+32901&output=embed",
  mapLinkHref:
    "https://www.google.com/maps/search/?api=1&query=1305+S+Apollo+Blvd+Unit+101+Melbourne+FL+32901",
  // NEEDS_CLIENT_INPUT: business hours were not included in the one-pager.
  hours: null as { days: string; time: string }[] | null,
  // NEEDS_CLIENT_INPUT: confirm/replace once social profiles exist.
  social: {
    google: null as string | null,
    instagram: null as string | null,
    facebook: null as string | null,
  },
};

export const provider = {
  name: "Dr. Kushal Patel, PT, DPT",
  firstName: "Dr. Patel",
  credentials: "PT, DPT",
  role: "Owner & Founder, Doctor of Physical Therapy",
  education:
    "Doctorate of Physical Therapy from the University of St. Augustine, 2022",
  experience:
    "Dr. Patel has practiced across Virginia, Washington D.C., Indiana, and Florida — including time spent treating patients right here in Brevard County — before opening Precision Rehab & Performance.",
  continuingEducation: ["Dry Needling Certification"],
  personalNote:
    "Outside the clinic, Dr. Patel stays active himself — working out, playing pickleball, and learning golf — and is a die-hard fan of his home-state Indiana teams (Colts, Pacers). He opened Precision Rehab & Performance because he believes every patient deserves individualized, hands-on care focused on one outcome: getting back to a pain-free life.",
  photo: "/images/kushal-patel.jpg",
};

export const missionVision = {
  mission:
    "Our mission is to address the root cause of pain, not just the symptoms, by applying precise assessments, individualized care, and intentional, movement-based solutions.",
  vision:
    "To set a new standard in rehabilitation and performance care by identifying the root cause, delivering precision treatment, and transforming how people move and perform.",
};

export const differentiators = [
  {
    title: "One-on-One, Every Visit",
    description:
      "You work directly with Dr. Patel — not passed between aides or juggled with three other patients an hour.",
  },
  {
    title: "Individualized Treatment Plans",
    description:
      "Your plan of care is built around your body, your goals, and your timeline — not a generic protocol.",
  },
  {
    title: "Direct Access to Your Therapist",
    description:
      "Questions between visits, progress check-ins, and treatment adjustments come straight from Dr. Patel.",
  },
  {
    title: "Performance-Minded Rehab",
    description:
      "Care that goes beyond pain relief — built to help you return to the activities, sport, and lifestyle you care about.",
  },
] as const;

export type TreatmentCategory = {
  title: string;
  description: string;
  items: string[];
  note?: string;
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    title: "Physical Therapy & Rehabilitation",
    description:
      "Comprehensive, hands-on physical therapy for injury, surgery recovery, and chronic pain.",
    items: [
      "Physical Therapy",
      "Manual Therapy",
      "Post-Op Rehab",
      "Chronic Pain Management",
    ],
  },
  {
    title: "Conditions We Treat",
    description:
      "Common pain points and problem areas patients bring to Precision Rehab & Performance.",
    items: [
      "Hip Pain",
      "Knee Pain",
      "Foot Pain",
      "Back Pain",
      "Cervical (Neck) Pain",
    ],
  },
  {
    title: "Recovery Modalities",
    description:
      "Cash-based modalities used alongside your treatment plan to accelerate recovery.",
    items: ["Dry Needling", "Shockwave Therapy", "Cupping"],
    note: "Cash-pay only",
  },
  {
    title: "Performance & Maintenance",
    description:
      "For patients who want to stay ahead of injury and keep performing at their best.",
    items: [
      "Injury Prevention",
      "Strength & Performance Training",
      "Return to Sport",
      "Gait Analysis",
      "Maintenance Training",
    ],
  },
];

export const screening = {
  heading: "Not Sure If We're the Right Fit? Find Out for Free.",
  body:
    "Before you commit to a plan of care, talk directly with Dr. Patel about what's going on, what treatment could look like, and whether Precision Rehab & Performance is the right fit for you — no obligation, no pressure.",
  bullets: [
    "15 minutes with Dr. Patel, not a sales rep",
    "Available in person at the Melbourne clinic or virtually from anywhere",
    "No obligation to book further care",
    "Leave with a clear next step, either way",
  ],
};

export const insurance = {
  heading: "Insurance & Cash-Based Care",
  intro:
    "Precision Rehab & Performance is proudly cash-based, which allows Dr. Patel to design a treatment plan around what you actually need — not what a claims adjuster approves.",
  medicareNote:
    "Medicare is currently accepted. All other insurance plans are out-of-network.",
  superbillNote:
    "For out-of-network plans, a superbill can be provided so you can seek reimbursement directly from your insurance provider.",
  philosophy:
    "Reduced reimbursement rates and increasing insurance restrictions have made it harder for many practices to provide the individualized, hands-on care patients actually need. A cash-based model lets Dr. Patel treat the whole patient, spend the time each visit actually requires, and build a plan aimed at getting you back to a pain-free life as efficiently as possible — instead of a plan built around what a claim will cover.",
  cta: "Contact the clinic to talk through your specific insurance situation, cash-pay options, and what treatment could look like for you.",
  // Explicit disclosure per client instruction — pricing is not displayed at this stage.
  pricingDisclosure:
    "Self-pay pricing is being finalized and will be shared directly when you contact the clinic.",
};

export const serviceAreaTowns = [
  "Melbourne",
  "West Melbourne",
  "Palm Bay",
  "Indialantic",
  "Melbourne Beach",
  "Suntree",
  "Viera",
  "Rockledge",
];

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "Do I need a referral to see a physical therapist in Florida?",
    answer:
      "Florida allows direct access to physical therapy, meaning many patients can be evaluated without a physician referral. Some insurance plans or specific situations may still require one — contact the clinic and we'll help you confirm what applies to your situation.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Precision Rehab & Performance currently accepts Medicare. All other insurance plans are out-of-network, though a superbill can be provided so you can pursue reimbursement directly from your provider.",
  },
  {
    question: "Do you offer cash-pay physical therapy?",
    answer:
      "Yes — Precision Rehab & Performance operates on a cash-based model, which allows for individualized, one-on-one treatment plans that aren't limited by insurance restrictions. Contact the clinic to discuss self-pay options for your specific needs.",
  },
  {
    question: "What is the free 15-minute screening?",
    answer:
      "It's a complimentary conversation with Dr. Patel to discuss what you're dealing with, answer your questions, and help you understand what treatment could look like — with no obligation to book further care.",
  },
  {
    question: "Can the free screening be done virtually?",
    answer:
      "Yes. The free 15-minute screening is available either in person at the Melbourne clinic or virtually, whichever is more convenient for you.",
  },
  {
    question: "What conditions do you treat?",
    answer:
      "Precision Rehab & Performance treats a range of conditions including hip, knee, foot, back, and cervical (neck) pain, post-operative recovery, and chronic pain — along with performance training, injury prevention, and return-to-sport programs for active patients.",
  },
  {
    question: "What happens during my first visit?",
    answer:
      "Your first visit is a thorough one-on-one evaluation with Dr. Patel to understand your condition, history, and goals, which is then used to build a treatment plan specific to you. Contact the clinic for current scheduling and what to bring.",
  },
  {
    question: "How do I know if physical therapy is right for me?",
    answer:
      "If you're dealing with pain, recovering from an injury or surgery, or want to get ahead of an issue before it limits you, physical therapy is worth exploring. The free 15-minute screening is designed exactly for this — a no-obligation way to find out.",
  },
];

// ============================================================================
// NEEDS_CLIENT_INPUT — punch list surfaced in the UI and in PROJECT_NOTES.md
// ============================================================================
export const openItems = [
  "Production domain / DNS target (client owns domain via Domain.com)",
  "Business hours",
  "Confirm phone line is SMS/text-enabled (for 'text us' CTAs and automated texts)",
  "Additional clinic space / in-session photography (Dr. Patel headshot is in)",
  "Finalized self-pay / cash pricing (intentionally not displayed yet, per direction)",
  "Google Business Profile URL (for review widget + citations)",
  "Facebook / Instagram profile URLs, if applicable",
  "Confirmation on any additional insurance plans as they're added",
  "Preferred scheduling method (phone/text/form now — online booking system later?)",
];
