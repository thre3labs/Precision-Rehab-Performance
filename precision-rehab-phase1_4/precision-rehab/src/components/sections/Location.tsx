import { Clock, MapPin, Navigation } from "lucide-react";
import { serviceAreaTowns, site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function Location() {
  return (
    <section id="location" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Visit the Clinic</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Physical Therapy in Melbourne, FL
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-700">
            Conveniently located in Melbourne and proud to serve patients
            throughout Brevard County.
          </p>
        </div>

        <div className="mt-12 grid gap-8 overflow-hidden rounded-2xl border border-navy-900/8 shadow-card lg:grid-cols-2">
          <div className="min-h-[320px] w-full">
            <iframe
              title={`Map to ${site.name}`}
              src={site.mapEmbedSrc}
              className="h-full min-h-[320px] w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-500" />
              <div>
                <p className="font-bold text-navy-950">
                  {site.address.line1}, {site.address.line2}
                </p>
                <p className="text-navy-600">
                  {site.address.city}, {site.address.state} {site.address.zip}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold-500" />
              <div>
                <p className="font-bold text-navy-950">Hours</p>
                <p className="text-navy-600">
                  {site.hours ? "See hours below" : "Hours coming soon — call or text to confirm availability"}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <Button
                href={site.mapLinkHref}
                variant="secondary"
                icon={<Navigation className="h-4 w-4" strokeWidth={2.5} />}
              >
                Get Directions
              </Button>
            </div>

            <div className="mt-8 border-t border-navy-900/8 pt-6">
              <p className="text-[13px] font-bold uppercase tracking-wide text-navy-500">
                Proudly serving
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-navy-700">
                {serviceAreaTowns.join(" · ")}
                {" "}and the surrounding Brevard County area.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
