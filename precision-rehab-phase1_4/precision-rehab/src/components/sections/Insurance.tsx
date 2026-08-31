import { FileCheck2, HandCoins, ShieldCheck } from "lucide-react";
import { insurance } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Insurance() {
  return (
    <section id="insurance" className="scroll-mt-20 bg-navy-50/60 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Insurance &amp; Cash-Based Care</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Care Built Around You — Not a Claim
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-700">
            {insurance.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-navy-700" strokeWidth={1.75} />
            <h3 className="mt-4 text-[15px] font-bold text-navy-950">Medicare</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">
              {insurance.medicareNote}
            </p>
          </div>
          <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft">
            <FileCheck2 className="h-6 w-6 text-navy-700" strokeWidth={1.75} />
            <h3 className="mt-4 text-[15px] font-bold text-navy-950">Out-of-Network Plans</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">
              {insurance.superbillNote}
            </p>
          </div>
          <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft">
            <HandCoins className="h-6 w-6 text-navy-700" strokeWidth={1.75} />
            <h3 className="mt-4 text-[15px] font-bold text-navy-950">Cash-Pay Options</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">
              {insurance.pricingDisclosure}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-navy-900 p-8 text-center sm:p-10">
          <p className="text-[15px] leading-relaxed text-navy-200">
            {insurance.philosophy}
          </p>
        </div>
      </Container>
    </section>
  );
}
