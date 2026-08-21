import { Phone } from "lucide-react";
import { site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full border-[50px] border-white" />
      </div>
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to Get Back to What You Love?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-navy-300">
          Schedule your free 15-minute screening with Dr. Patel — in person
          in Melbourne, FL or virtually. No obligation.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button href="#screening" variant="primary" className="text-base">
            Schedule Your Free 15-Minute Screening
          </Button>
          <Button
            href={site.phoneHref}
            variant="ghost"
            icon={<Phone className="h-4 w-4" strokeWidth={2.5} />}
            className="text-base"
          >
            Call {site.phoneDisplay}
          </Button>
        </div>
      </Container>
    </section>
  );
}
