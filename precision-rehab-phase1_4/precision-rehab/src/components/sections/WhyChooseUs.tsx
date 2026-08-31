import { Check, X } from "lucide-react";
import { differentiators } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const comparison = [
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
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="scroll-mt-20 bg-navy-950 py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow light>Why Precision Rehab &amp; Performance</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              A Different Model From Traditional, High-Volume PT
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-300">
              Many outpatient clinics are built to move as many patients
              through the door as possible. Precision Rehab &amp;
              Performance is built the opposite way, around one patient at
              a time.
            </p>

            <ul className="mt-8 space-y-6">
              {differentiators.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-navy-300">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-gold-400">
              Traditional PT vs. Precision Rehab &amp; Performance
            </p>
            <div className="mt-6 divide-y divide-white/10">
              {comparison.map((row) => (
                <div key={row.label} className="grid grid-cols-[1fr_auto] gap-4 py-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-navy-400">
                      {row.label}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-1">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-navy-500" />
                    <span className="text-[13.5px] leading-snug text-navy-400">
                      {row.traditional}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-1">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    <span className="text-[13.5px] font-semibold leading-snug text-white">
                      {row.precision}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
