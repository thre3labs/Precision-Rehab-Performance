import { GraduationCap, HeartPulse, MapPinned, Syringe } from "lucide-react";
import { Container } from "@/components/ui/Container";

const points = [
  {
    icon: GraduationCap,
    label: "Doctor of Physical Therapy",
    detail: "University of St. Augustine, 2022",
  },
  {
    icon: MapPinned,
    label: "Multi-State Experience",
    detail: "VA · DC · Indiana · Florida, incl. Brevard County",
  },
  {
    icon: Syringe,
    label: "Certified in Dry Needling",
    detail: "Advanced continuing education",
  },
  {
    icon: HeartPulse,
    label: "Cash-Based Model",
    detail: "Treatment built around you, not a claim",
  },
];

/**
 * Compact credibility strip placed directly beneath the hero — gives
 * skimming visitors an immediate, factual reason to trust the clinic
 * before they scroll further.
 */
export function TrustBar() {
  return (
    <section className="border-b border-navy-900/5 bg-white py-8 sm:py-10">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 sm:gap-x-8">
          {points.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold leading-tight text-navy-900">{label}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-navy-500">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
