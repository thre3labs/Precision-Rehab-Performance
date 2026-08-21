import {
  Activity,
  Bone,
  Sparkles,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { serviceCategories } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const icons = [Activity, Bone, Sparkles, Trophy];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-stone-25 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Services &amp; Conditions</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Do You See Your Problem Here?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            Precision Rehab &amp; Performance treats a focused set of
            conditions with real depth — from everyday pain to
            post-surgical recovery to getting back to sport.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={category.title}
                className="group flex flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700 text-white shadow-soft">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-950">
                  {category.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-navy-600">
                  {category.description}
                </p>
                <ul className="mt-4 space-y-2 border-t border-navy-900/5 pt-4">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13.5px] font-medium text-navy-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                {category.note && (
                  <span className="mt-4 inline-block w-fit rounded-full bg-gold-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-700">
                    {category.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-[15px] text-navy-600">
            Don&rsquo;t see your exact condition listed? We likely still
            treat it — the fastest way to find out is a free 15-minute
            screening.
          </p>
          <Button href="#screening" variant="secondary">
            Ask About Your Condition
          </Button>
        </div>
      </Container>
    </section>
  );
}
