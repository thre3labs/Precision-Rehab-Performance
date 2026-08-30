import {
  Activity,
  Bone,
  Sparkles,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { treatmentCategories } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const icons = [Activity, Bone, Sparkles, Trophy];

export function Treatments() {
  return (
    <section id="treatments" className="scroll-mt-20 bg-stone-25 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>How We Can Help</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            What&rsquo;s Holding You Back?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            Whether you&rsquo;re dealing with pain, recovering from surgery,
            or trying to get back to the activities you love, we&rsquo;ll
            help you move better, feel stronger, and get back to doing what
            matters most.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-6">
          {treatmentCategories.map((category, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={category.title}
                className="group flex flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft transition-shadow hover:shadow-card sm:p-7"
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
                <ul className="mt-5 space-y-4 border-t border-navy-900/5 pt-5">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      <div>
                        <span className="text-[13.5px] font-bold text-navy-800">
                          {item.name}
                        </span>
                        {item.blurb && (
                          <p className="mt-0.5 text-[13px] leading-snug text-navy-500">
                            {item.blurb}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {category.note && (
                  <span className="mt-5 inline-block w-fit rounded-full bg-gold-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-700">
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
