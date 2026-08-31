import Image from "next/image";
import { Camera } from "lucide-react";
import { provider } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
                  <p className="text-xs text-navy-300">Placeholder, to be added</p>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
                <p className="text-sm font-bold text-navy-950">{provider.name}</p>
                <p className="text-xs text-navy-500">{provider.role}</p>
              </div>
            </div>
          </div>

          <div>
            <Eyebrow>Meet Our Team</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {provider.teamHeadline}
            </h2>

            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-navy-700">
              <p>{provider.experience}</p>
              <p>{provider.personalNote}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
