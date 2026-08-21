import Image from "next/image";
import { GraduationCap, MapPinned, Syringe, Camera } from "lucide-react";
import { provider } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function AboutPT() {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Photo placeholder — clearly marked, swap for real headshot */}
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-100 to-navy-50 shadow-card">
              {provider.photo ? (
                <Image
                  src={provider.photo}
                  alt={`${provider.name}, physical therapist at Precision Rehab & Performance`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 border-2 border-dashed border-navy-200 p-6 text-center">
                  <Camera className="h-9 w-9 text-navy-300" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-navy-400">
                    Professional photo of Dr. Patel
                  </p>
                  <p className="text-xs text-navy-300">Placeholder — to be added</p>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
                <p className="text-sm font-bold text-navy-950">{provider.name}</p>
                <p className="text-xs text-navy-500">{provider.role}</p>
              </div>
            </div>
          </div>

          <div>
            <Eyebrow>Meet Your Physical Therapist</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {provider.name}
            </h2>

            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-navy-700">
              <p>{provider.experience}</p>
              <p>{provider.personalNote}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-navy-900/8 bg-navy-50/60 p-4">
                <GraduationCap className="h-5 w-5 text-navy-700" strokeWidth={1.75} />
                <p className="mt-2 text-[13px] font-bold text-navy-900">Education</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-navy-600">
                  {provider.education}
                </p>
              </div>
              <div className="rounded-xl border border-navy-900/8 bg-navy-50/60 p-4">
                <MapPinned className="h-5 w-5 text-navy-700" strokeWidth={1.75} />
                <p className="mt-2 text-[13px] font-bold text-navy-900">Experience</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-navy-600">
                  VA, DC, Indiana &amp; Florida, incl. Brevard County
                </p>
              </div>
              <div className="rounded-xl border border-navy-900/8 bg-navy-50/60 p-4">
                <Syringe className="h-5 w-5 text-navy-700" strokeWidth={1.75} />
                <p className="mt-2 text-[13px] font-bold text-navy-900">Certifications</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-navy-600">
                  {provider.continuingEducation.join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-9">
              <Button href="#screening" variant="primary">
                Talk to Dr. Patel — Book Your Free Screening
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
