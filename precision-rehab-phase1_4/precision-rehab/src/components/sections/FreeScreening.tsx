import { CheckCircle2, Phone, Video, Building2 } from "lucide-react";
import { screening, site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/sections/ContactForm";

export function FreeScreening() {
  return (
    <section
      id="screening"
      className="scroll-mt-20 bg-gradient-to-b from-gold-50 via-white to-white py-20 sm:py-28"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Eyebrow>Free 15-Minute Screening</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {screening.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-700">
              {screening.body}
            </p>

            <ul className="mt-8 space-y-3.5">
              {screening.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span className="text-[15px] font-medium text-navy-800">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">
                <Building2 className="h-4 w-4" /> In Person
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">
                <Video className="h-4 w-4" /> Virtual
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href={site.phoneHref}
                variant="secondary"
                icon={<Phone className="h-4 w-4" strokeWidth={2.5} />}
              >
                Call {site.phoneDisplay}
              </Button>
            </div>
          </div>

          <div id="contact">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
