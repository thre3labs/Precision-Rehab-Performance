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
  // Production domain, confirmed by the client and already live on Vercel.
  //
  // THIS VALUE IS LOAD-BEARING. Every canonical tag, every Open Graph and
  // Twitter URL, every sitemap entry, the robots.txt sitemap line and the
  // JSON-LD `url` are built from it. It must be the exact scheme and host the
  // site is actually served from, with no trailing slash.
  //
  // It previously read "https://www.precisionrehabfl.com" — a placeholder that
  // turns out to belong to an unrelated company (Precision Rehab Enterprises,
  // a therapy staffing agency in South Florida). While it was set, this site
  // told search engines that another company's domain was the canonical
  // version of every page, and every share preview asked that domain for its
  // image, which returned 404. Both fail silently: the site looks fine to a
  // visitor, and only a crawler or a link preview shows the damage.
  url: "https://www.precisionrehabpt.com",
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
  /**
   * Business hours, as lettered on the clinic's own front door.
   *
   * `days` and `time` are what a patient reads on the page. `openTime` and
   * `closeTime` are 24-hour and exist for schema.org's
   * openingHoursSpecification, which will not accept "8:00 AM". Keeping both
   * on one object means the page and the structured data cannot drift into
   * disagreeing about when the clinic is open — which is the kind of mismatch
   * that sends someone to a locked door.
   *
   * `days` here covers Monday to Friday; `dayOfWeek` is the machine-readable
   * list schema.org wants for exactly those days.
   */
  hours: [
    {
      days: "Monday–Friday",
      time: "8:00 AM – 4:30 PM",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ] as string[],
      openTime: "08:00",
      closeTime: "16:30",
    },
  ] as
    | {
        days: string;
        time: string;
        dayOfWeek: string[];
        openTime: string;
        closeTime: string;
      }[]
    | null,
  /**
   * Coordinates of the clinic, taken from Google's own Business Profile
   * listing rather than geocoded by us — so they are the exact point Google
   * already places the business at, which is what we want the structured data
   * to agree with.
   *
   * Pulled from the `!8m2!3d<lat>!4d<lng>` segment of the profile's Maps URL.
   * Note that is NOT the `@lat,lng,17z` pair earlier in the same URL: that one
   * is only wherever the map happened to be panned when the link was copied,
   * and it differs here by about 250 metres.
   */
  geo: { lat: 28.088401, lng: -80.617183 },
  // NEEDS_CLIENT_INPUT: confirm/replace once social profiles exist.
  social: {
    /**
     * The Google Business Profile, in its canonical `?cid=` form.
     *
     * Deliberately not the long `/maps/place/...` URL the browser gives you:
     * that carries session parameters (`entry=ttu`, `g_ep=...`) which are
     * ephemeral tracking cruft, and it encodes a map viewport that has nothing
     * to do with the business. The CID is the listing's permanent identifier,
     * so this URL keeps resolving to the same profile forever.
     *
     * CID 7794277478580003042 = 0x6c2ad6122796a0e2. Google's own Place ID for
     * the listing is /g/11zdtdlrv3, kept here as a comment in case a future
     * integration needs it.
     */
    google: "https://www.google.com/maps?cid=7794277478580003042" as
      | string
      | null,
    instagram: null as string | null,
    facebook: null as string | null,
  },
};

export const provider = {
  name: "Dr. Kushal Patel, PT, DPT",
  firstName: "Dr. Patel",
  credentials: "PT, DPT",
  role: "Owner & Founder, Doctor of Physical Therapy",
  // Team-facing headline for the About section — still just Dr. Patel today,
  // but framed as "our team, led by..." rather than a solo-provider bio.
  teamHeadline: "Led by Dr. Kushal Patel, PT, DPT",
  education:
    "Doctorate of Physical Therapy from the University of St. Augustine, 2022",
  experience:
    "Dr. Kushal Patel is a dedicated physical therapist with extensive experience working in outpatient orthopedics. He takes a hands-on, individualized approach to help patients reduce pain, restore movement, and improve their quality of life. He has a certification in dry needling which he incorporates to help patients manage their pain and improve mobility. He founded this clinic with a passion for providing exceptional care that goes beyond traditional therapy to create a meaningful, lasting impact on the community he serves.",
  continuingEducation: ["Dry Needling Certification"],
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
      "You work directly with Dr. Patel, not passed between aides or juggled with three other patients an hour.",
  },
  {
    title: "Individualized Treatment Plans",
    description:
      "Your plan of care is built around your body, your goals, and your timeline, not a generic protocol.",
  },
  {
    title: "Direct Access to Your Therapist",
    description:
      "Questions between visits, progress check-ins, and treatment adjustments come straight from Dr. Patel.",
  },
  {
    title: "Performance-Minded Rehab",
    description:
      "Care that goes beyond pain relief, built to help you return to the activities, sport, and lifestyle you care about.",
  },
] as const;

// Side-by-side used in the "Why Precision Rehab" section. Deliberately framed
// as a model comparison, not a claim about any named competitor.
export const comparison = [
  {
    label: "Time with your provider",
    traditional: "Split across 2–3 patients per hour",
    precision: "Dedicated, one-on-one every visit",
  },
  {
    label: "Who treats you",
    traditional: "Rotates between aides & techs",
    precision: "Directly with Dr. Patel, start to finish",
  },
  {
    label: "Treatment plan",
    traditional: "Standardized protocol",
    precision: "Built around your body & goals",
  },
  {
    label: "Care limited by",
    traditional: "What insurance approves",
    precision: "What you actually need",
  },
] as const;

export type TreatmentItem = {
  name: string;
  // One-line, general/standard description of what the item is and what it
  // commonly helps with. Left undefined for self-explanatory items (like a
  // body-part pain location) that don't need further explanation.
  blurb?: string;
};

export type TreatmentCategory = {
  title: string;
  description: string;
  items: TreatmentItem[];
  note?: string;
  /**
   * Card image. Landscape; rendered as a 116x86 cover-cropped thumbnail, so
   * anything from ~240px wide up is enough. width/height must match the file
   * on disk — next/image uses them to reserve the box, and a wrong ratio here
   * is a layout-shift bug waiting to happen. Replace a photo by overwriting
   * the file and updating these two numbers.
   */
  image: { src: string; width: number; height: number; alt: string };
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    title: "Physical Therapy & Rehabilitation",
    description:
      "Comprehensive, hands-on physical therapy for injury, surgery recovery, and chronic pain.",
    image: {
      src: "/images/treat-rehab.jpg",
      width: 531,
      height: 354,
      alt: "A physical therapist assessing an older patient's neck and shoulders in a treatment room",
    },
    items: [
      {
        name: "Physical Therapy",
        blurb: "Hands-on care to reduce pain, restore movement, and rebuild strength.",
      },
      {
        name: "Manual Therapy",
        blurb: "Joint and soft-tissue techniques that ease stiffness and improve mobility.",
      },
      {
        name: "Post-Op Rehab",
        blurb: "Guided recovery to safely rebuild strength and motion after surgery.",
      },
      {
        name: "Chronic Pain Management",
        blurb: "Individualized care for persistent pain that hasn't improved elsewhere.",
      },
    ],
  },
  {
    title: "Recovery Modalities",
    description:
      "Cash-based modalities used alongside your treatment plan to accelerate recovery.",
    image: {
      src: "/images/treat-modalities.jpg",
      width: 523,
      height: 342,
      alt: "Cupping therapy being applied to a patient's back",
    },
    items: [
      {
        name: "Dry Needling",
        blurb: "Relieves tight muscle knots and trigger points causing chronic tension.",
      },
      {
        name: "Shockwave Therapy",
        blurb: "Often used for plantar fasciitis, tennis elbow, and stubborn tendon pain.",
      },
      {
        name: "Cupping",
        blurb: "Eases muscle tightness and improves mobility via localized blood flow.",
      },
      {
        name: "Class IV Laser Therapy",
        // The "250+ teams" figure is LightForce's own marketing claim, supplied
        // by the client. It is a statement about the manufacturer's install
        // base, not a clinical outcome claim, and it is the clinic's to stand
        // behind. Everything else on this page describes what a treatment does.
        blurb:
          "Aids post-activity recovery. LightForce lasers are used by 250+ pro, college and Olympic teams.",
      },
    ],
    note: "Cash-pay only",
  },
  {
    title: "Performance & Maintenance",
    description:
      "For patients who want to stay ahead of injury and keep performing at their best.",
    image: {
      src: "/images/treat-performance.jpg",
      width: 532,
      height: 348,
      alt: "An athlete gripping a loaded barbell at the start of a deadlift",
    },
    items: [
      {
        name: "Injury Prevention",
        blurb: "Movement screening to catch weaknesses before they become injuries.",
      },
      {
        name: "Strength & Performance Training",
        blurb: "Progressive strength work built around your sport or activity goals.",
      },
      {
        name: "Return to Sport",
        blurb: "A guided progression back to full activity after injury.",
      },
      {
        name: "Gait Analysis",
        blurb: "Identifies patterns in your walk or run that contribute to pain.",
      },
      {
        name: "Maintenance Training",
        blurb: "Ongoing sessions to stay strong and ahead of future injury.",
      },
    ],
  },
];

// Standalone "Conditions We Treat" section — split out from the treatment
// categories above so it can stand on its own as a full page section.
// Grouped by body region: a flat list of two dozen items reads as a wall on
// mobile, and "where does it hurt" is how patients arrive at the question.
export const conditionsTreated = {
  intro:
    "Common pain points and problem areas patients bring to Precision Rehab & Performance, grouped by where it hurts.",
  groups: [
    {
      region: "Neck & Back",
      items: [
        "Neck pain",
        "TMJ pain",
        "Back pain",
        "Rib pain",
        "SI joint dysfunction",
      ],
    },
    {
      region: "Shoulder & Arm",
      items: ["Shoulder pain", "Elbow pain", "Wrist & hand pain"],
    },
    {
      region: "Hip & Leg",
      items: ["Hip pain", "Knee pain", "Ankle pain", "Foot pain"],
    },
    {
      region: "Surgery & Sport",
      items: [
        "Pre-surgical therapy",
        "Post-surgical rehabilitation",
        "Sport injuries",
      ],
    },
    {
      region: "Ongoing Conditions",
      items: [
        "Arthritis",
        "Fibromyalgia",
        "Balance impairments",
        "Acute pain",
        "Chronic pain",
      ],
    },
  ],
};

// ============================================================================
// RECOVERY MODALITIES — the "Advanced Recovery Technology" section.
// Content comes from the client's Services document. Clinical claims,
// contraindications and session protocols are reproduced from that source and
// were not authored here; they should be re-confirmed by Dr. Patel before any
// change. Layout variations (which figure appears where) live in the
// component, not in this data.
// ============================================================================
export type Modality = {
  id: string;
  name: string;
  /** one-line summary shown on the collapsed accordion head */
  summary: string;
  /** device or credential line under the summary */
  device: string;
  /** thumbnail on the accordion head */
  thumb: { src: string; width: number; height: number; product?: boolean };
  lede: string;
  benefits: string[];
  /** plain list, or name + short outcome note */
  treats?: (string | { name: string; note: string })[];
  treatsHeading?: string;
  expect: string;
  after?: string[];
  notSuitable?: { heading: string; items: string[] };
  risks?: string[];
  protocol: string;
};

export const modalities: Modality[] = [
  {
    id: "shock",
    name: "Shockwave Therapy",
    summary:
      "Acoustic pressure waves that break up stubborn scar tissue and calcification, and switch on the body's own repair cells.",
    device: "Chattanooga Intelect® RPW 2",
    thumb: { src: "/images/svc-shockwave.jpg", width: 820, height: 820 },
    lede: "Radial Pressure Wave (RPW) therapy is a noninvasive treatment that involves the application of acoustic waves to injured soft tissue to alleviate pain and promote healing. RPW therapy is popular among patients because it is quick and effective. It also reduces the need for injections, drugs or surgical correction in many cases.",
    benefits: [
      "Promotes the formation of new blood vessels, increasing oxygen and nutrient delivery to the tissue",
      "Activates the cells responsible for tissue repair, such as fibroblasts and osteoblasts",
      "Breaks down scar tissue, fibrosis and calcifications",
      "Releases natural growth factors that reduce inflammation and promote tissue regeneration",
      "Desensitizes nerve receptors, helping to decrease pain",
      "Quick and effective, eliminating the need for drugs or surgical correction in many cases",
    ],
    treatsHeading: "Commonly treats",
    treats: [
      { name: "Tendinopathy", note: "Less pain, better movement" },
      { name: "Plantar fasciitis", note: "Relief standing and walking" },
      { name: "Osteoarthritis", note: "Calms acute symptoms" },
      { name: "Frozen shoulder", note: "More pain-free movement" },
      { name: "Myofascial pain", note: "Lowers pain intensity" },
      { name: "Tennis elbow", note: "For pickleball and tennis" },
      { name: "Golfer's elbow", note: "For golf" },
    ],
    expect:
      "Dr. Patel reviews your symptoms, medical history and treatment goals to determine whether RPW shockwave is appropriate. You'll be positioned comfortably and the treatment area exposed, then gel is applied. Expect mild to moderate discomfort during treatment, especially over the areas that need it most. Depending on the area, anywhere from 2,000 to 3,000 shocks are delivered per session.",
    after: [
      "Temporary soreness or aching in the treated area",
      "Mild bruising or redness near the treatment area",
      "Temporary fatigue of the treated area",
      "A temporary increase in symptoms before improvement occurs",
    ],
    notSuitable: {
      heading: "Not suitable if you",
      items: [
        "Are pregnant",
        "Have active cancer",
        "Have open wounds in the area",
        "Have had a cortisone injection within the past 6 weeks",
      ],
    },
    protocol:
      "1–2× per week for 4–8 sessions for best results. Expect 20–40% relief after the first visit.",
  },
  {
    id: "dn",
    name: "Dry Needling",
    summary:
      "A thin sterile needle into the muscle or tendon itself, releasing trigger points that keep you tight and sore.",
    device: "Dr. Patel is certified",
    thumb: { src: "/images/svc-needling.jpg", width: 900, height: 601 },
    lede: "Dry needling uses a sterile thin monofilament needle through the skin into affected tendons, ligaments or muscles, in order to relieve pain, decrease muscle tension, and improve mobility. It is based on Western medicine principles and research, and works by enhancing the body's ability to heal while reducing pain in the process.",
    benefits: [
      "Decreases muscle pain and tenderness",
      "Reduces muscle tightness and spasm",
      "Improves range of motion and flexibility",
      "Reduces cervicogenic headaches and migraines",
      "Improves muscle function and movement",
      "Reduces sensitivity in painful areas",
    ],
    expect:
      "Dr. Patel reviews your symptoms, medical history and goals to determine whether dry needling is appropriate. You'll be positioned comfortably and the area cleaned, then a sterile, single-use filament needle is inserted into the targeted muscle or tissue. You may feel a muscle twitch, cramping, aching, pressure, or a brief return of your familiar symptoms. The needle stays in place a short time and is then removed. Electrical stimulation may be added to help restore normal contractile force. Treatment is often followed by stretching, movement exercises or manual therapy.",
    after: [
      "Temporary soreness or aching in the treated area",
      "Mild bruising or pinpoint bleeding",
      "Temporary fatigue or heaviness of the treated muscle",
      "A temporary increase in symptoms before improvement occurs",
    ],
    risks: [
      "Dizziness, lightheadedness, nausea or fainting",
      "Injury to nerves or other tissues, which is uncommon",
      "In certain areas of the body, pneumothorax (collapsed lung) is a rare but potentially serious complication that could require rest or hospitalization",
    ],
    notSuitable: {
      heading: "Precautions & contraindications",
      items: [
        "History of pneumothorax or pneumonia",
        "An active infection or open wound at the treatment site",
        "Significant bleeding disorders",
        "Medications that significantly increase bleeding risk, including some anticoagulants",
        "A history of significant fainting with needles",
        "Certain immune-system conditions or increased infection risk",
        "Pregnancy, depending on the treatment area and protocol",
        "Certain medical conditions or implanted devices such as a pacemaker, depending on technique",
        "Significant fear of, or inability to tolerate, needles",
      ],
    },
    protocol:
      "1× per week per area. Many patients notice significant improvement after the first visit; follow-up plans are discussed after treatment.",
  },
  {
    id: "laser",
    name: "Class IV Laser Therapy",
    summary:
      "Painless laser energy that drives circulation and tissue healing. Sessions run 5–10 minutes, with most patients feeling relief in three to five visits.",
    device: "LightForce® 15W",
    thumb: {
      src: "/images/svc-laser.jpg",
      width: 560,
      height: 560,
      product: true,
    },
    lede: "Class IV laser therapy is a non-invasive healing method that uses laser energy to help damaged tissues reduce pain and inflammation, and to speed up the body's natural healing phase for a wide range of acute and chronic pain conditions. Treatments typically last 5–10 minutes and most patients experience relief in just three to five sessions.",
    benefits: [
      "Reduces pain and discomfort",
      "Decreases inflammation and swelling",
      "Improves local circulation",
      "Promotes tissue healing and recovery",
      "Supports soft-tissue healing",
      "Reduces muscle tension and spasm",
      "Improves joint mobility and function",
      "Reduces recovery time following certain injuries or procedures",
      "Supports healing of certain wounds and other soft-tissue conditions",
    ],
    treatsHeading: "Commonly treats",
    treats: [
      "Neck pain",
      "Shoulder pain",
      "Back pain",
      "Knee pain",
      "Sprains and strains",
      "Plantar fasciitis",
      "Carpal tunnel",
      "Tennis elbow",
      "Soft-tissue injuries",
    ],
    expect:
      "Dr. Patel evaluates your condition to determine whether laser therapy is appropriate. The area may be exposed and cleaned, and protective eyewear is worn by both of you where the laser system requires it. The applicator is placed over or moved across the area. Treatment is generally painless: you may feel mild warmth, a gentle heating sensation, or little to nothing at all. Power, wavelength, time and area are set to your condition and goals, and sessions typically take several minutes.",
    after: [
      "Minimal to no increase in pain",
      "Increased warmth in the tissue around the treated area",
    ],
    protocol: "1–2× per week, depending on the area being treated.",
  },
];

export const screening = {
  heading: "Not Sure If We're the Right Fit? Find Out for Free.",
  body:
    "Before you commit to a plan of care, talk directly with Dr. Patel about what's going on, what treatment could look like, and whether Precision Rehab & Performance is the right fit for you. No obligation, no pressure.",
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
    "Precision Rehab & Performance is proudly cash-based, which allows Dr. Patel to design a treatment plan around what you actually need, not what a claims adjuster approves.",
  medicareNote:
    "Medicare is currently accepted. All other insurance plans are out-of-network.",
  superbillNote:
    "For out-of-network plans, a superbill can be provided so you can seek reimbursement directly from your insurance provider.",
  philosophy:
    "Reduced reimbursement rates and increasing insurance restrictions have made it harder for many practices to provide the individualized, hands-on care patients actually need. A cash-based model lets Dr. Patel treat the whole patient, spend the time each visit actually requires, and build a plan aimed at getting you back to a pain-free life as efficiently as possible, instead of a plan built around what a claim will cover.",
  cta: "Contact the clinic to talk through your specific insurance situation, cash-pay options, and what treatment could look like for you.",
  // Explicit disclosure per client instruction — pricing is not displayed at this stage.
  pricingDisclosure:
    "Self-pay pricing is being finalized and will be shared directly when you contact the clinic.",
};

// ============================================================================
// FEATURE SWITCHES
// ----------------------------------------------------------------------------
// chatAssistant turns the clinic assistant on and off as one piece: the widget
// in the page, the /api/chat endpoint behind it, AND the section of the privacy
// policy that describes it. They are tied to this single flag on purpose — a
// published privacy notice that describes a feature the site does not have is
// the same class of error as one that fails to describe a feature it does.
//
// Turning it back on: set this true, then set ANTHROPIC_API_KEY in Vercel and
// redeploy. Without the key the widget renders but answers that it is not
// switched on yet, which is the honest fallback, not a working assistant.
// ============================================================================
export const features = {
  chatAssistant: false,
};

// ============================================================================
// LEGAL NOTICES
// ----------------------------------------------------------------------------
// effectiveDate is set by the practice, not guessed here. The privacy page
// renders a loud unset-date banner while it is null, deliberately — a legal
// notice with a missing or invented date is worse than one that is obviously
// incomplete. Confirmed by the client as September 1, 2026.
//
// npp and nondiscrimination are the two notices supplied separately (HIPAA 140
// and BOM 244b). Each stays null until its document exists; the footer only
// renders a link once one is set, so nothing ever points at a dead URL.
// ============================================================================
export const legal = {
  privacy: {
    effectiveDate: "September 1, 2026" as string | null,
  },
  npp: null as { page: string; pdf: string; effectiveDate: string } | null,
  nondiscrimination: null as { page: string; pdf: string } | null,
};

/**
 * The photo tour that fills the panel in the Location section — the panel that
 * used to hold a drawn map with an amber route that went nowhere.
 *
 * The order is the content, not decoration: it is the sequence a patient
 * actually experiences the building, so the section answers "what am I walking
 * into?", which is the only question a photo tour exists to answer.
 *
 * Every caption is either confirmed in this file or visible in its own
 * photograph. Two earlier drafts were cut for failing that test — "dumbbells to
 * 50lb" (not legible) and "two treatment rooms" (two are photographed, which is
 * not evidence there are exactly two).
 *
 * Widths and heights are per photograph and they are NOT uniform: three were
 * shot portrait and were re-cropped to 5:4 by hand rather than letting the
 * browser crop them at render time.
 */
export type ClinicTourSlide = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export const clinicTour: ClinicTourSlide[] = [
  {
    src: "/images/clinic/exterior.jpg",
    width: 1400,
    height: 1050,
    alt: "The building at 1305 S Apollo Blvd seen from the car park, with the monument sign at the entrance",
    caption: "Arriving — easy to find, easy to park",
  },
  {
    src: "/images/clinic/entrance.jpg",
    width: 1219,
    height: 975,
    alt: "The ground-floor glass entrance, lettered with the clinic name, hours and phone number",
    caption: "The door — ground-floor entrance, Suite 101",
  },
  {
    src: "/images/clinic/waiting.jpg",
    width: 1400,
    height: 1050,
    alt: "The waiting area, with seating and the reception desk beyond",
    caption: "Waiting — the front of house",
  },
  {
    src: "/images/clinic/reception.jpg",
    width: 1400,
    height: 1050,
    alt: "The reception desk",
    caption: "Checking in — reception",
  },
  {
    src: "/images/clinic/treatment-1.jpg",
    width: 1086,
    height: 869,
    alt: "A private treatment room with a treatment table, anatomy charts and a window",
    caption: "Treatment — a private room with a door that closes",
  },
  {
    src: "/images/clinic/treatment-2.jpg",
    width: 1086,
    height: 869,
    alt: "A second treatment room with a treatment table and anatomy charts",
    caption: "Treatment — another treatment room",
  },
  {
    src: "/images/clinic/performance-1.jpg",
    width: 1400,
    height: 1050,
    alt: "The performance space, with a rack, a bench and a rack of dumbbells",
    caption: "Training — a real performance space",
  },
  {
    src: "/images/clinic/performance-2.jpg",
    width: 1400,
    height: 1050,
    alt: "Hands-on work alongside loading in the performance space",
    caption: "Together — hands-on work and loading, one session",
  },
];

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
      "Florida allows direct access to physical therapy, meaning many patients can be evaluated without a physician referral. Some insurance plans or specific situations may still require one. Contact the clinic and we'll help you confirm what applies to your situation.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Precision Rehab & Performance currently accepts Medicare. All other insurance plans are out-of-network, though a superbill can be provided so you can pursue reimbursement directly from your provider.",
  },
  {
    question: "Do you offer cash-pay physical therapy?",
    answer:
      "Yes, Precision Rehab & Performance operates on a cash-based model, which allows for individualized, one-on-one treatment plans that aren't limited by insurance restrictions. Contact the clinic to discuss self-pay options for your specific needs.",
  },
  {
    question: "What is the free 15-minute screening?",
    answer:
      "It's a complimentary conversation with Dr. Patel to discuss what you're dealing with, answer your questions, and help you understand what treatment could look like, with no obligation to book further care.",
  },
  {
    question: "Can the free screening be done virtually?",
    answer:
      "Yes. The free 15-minute screening is available either in person at the Melbourne clinic or virtually, whichever is more convenient for you.",
  },
  {
    question: "What conditions do you treat?",
    answer:
      "Precision Rehab & Performance treats a range of conditions including hip, knee, foot, back, and cervical (neck) pain, post-operative recovery, and chronic pain, along with performance training, injury prevention, and return-to-sport programs for active patients.",
  },
  {
    question: "What happens during my first visit?",
    answer:
      "Your first visit is a thorough one-on-one evaluation with Dr. Patel to understand your condition, history, and goals, which is then used to build a treatment plan specific to you. Contact the clinic for current scheduling and what to bring.",
  },
  {
    question: "How do I know if physical therapy is right for me?",
    answer:
      "If you're dealing with pain, recovering from an injury or surgery, or want to get ahead of an issue before it limits you, physical therapy is worth exploring. The free 15-minute screening is designed exactly for this: a no-obligation way to find out.",
  },
];

// ============================================================================
// NEEDS_CLIENT_INPUT — punch list surfaced in the UI and in PROJECT_NOTES.md
// ============================================================================
export const openItems = [
  // SEO-blocking. These are the values structured data and the Google Business
  // Profile both need, and both are currently absent rather than guessed.
  "Lead destination — set LEAD_WEBHOOK_URL or RESEND_API_KEY + LEAD_NOTIFY_EMAIL in Vercel, or the screening form refuses submissions (by design)",
  "Confirm clinic email domain: content.ts has precisionrpt.com, the site is precisionrehabpt.com",
  "Confirm phone line is SMS/text-enabled (for 'text us' CTAs and automated texts)",
  "Additional clinic space / in-session photography (Dr. Patel headshot is in)",
  "Finalized self-pay / cash pricing (intentionally not displayed yet, per direction)",
  "Facebook / Instagram profile URLs, if applicable",
  "Confirmation on any additional insurance plans as they're added",
  "Preferred scheduling method (phone/text/form now — online booking system later?)",
];
