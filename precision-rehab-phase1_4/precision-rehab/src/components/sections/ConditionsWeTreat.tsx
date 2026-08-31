import { CheckCircle2 } from "lucide-react";
import { conditionsTreated } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Compact pill/tag layout rather than a card grid — this list is expected
 * to grow as more conditions are added, and pills wrap naturally at any
 * length without the section's height ballooning.
 */
export function ConditionsWeTreat() {
  return (
    <section id="conditions" className="scroll-mt-20 bg-navy-50 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>What We Treat</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Conditions We Treat
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-700">
            {conditionsTreated.intro}
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {conditionsTreated.items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/8 bg-white px-4 py-2 text-[13.5px] font-bold text-navy-800 shadow-soft"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
