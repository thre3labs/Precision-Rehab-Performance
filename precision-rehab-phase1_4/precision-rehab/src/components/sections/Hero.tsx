import Image from "next/image";
import { Phone } from "lucide-react";
import { site, missionVision } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Brand pattern backdrop — echoes the compass mark from the logo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full border-[60px] border-white" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full border-[40px] border-gold-300" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Copy column */}
          <div>
            <Eyebrow light>Melbourne, Florida &middot; Outpatient Physical Therapy</Eyebrow>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Precision Care Built Around You
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">
              Precision Rehab &amp; Performance is a cash-based outpatient
              physical therapy clinic in Melbourne, FL, led directly by{" "}
              <span className="font-semibold text-white">Dr. Kushal Patel, PT, DPT</span>.
              Individualized, hands-on treatment for pain, injury recovery,
              and performance, with select insurance also accepted.
            </p>

            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Button href="#screening" variant="primary" className="text-base">
                Book Your Free 15-Minute Screening
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

            <p className="mt-4 text-sm text-navy-300">
              Available in person in Melbourne, FL or virtually &middot; No
              obligation
            </p>
          </div>

          {/* Visual column */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold-500/20 via-transparent to-transparent blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-sm sm:p-10">
              <div className="flex justify-center">
                <Image
                  src="/images/mark-transparent.png"
                  alt="Precision Rehab & Performance mark"
                  width={184}
                  height={200}
                  className="h-32 w-auto drop-shadow-[0_8px_24px_rgba(198,134,42,0.35)] sm:h-40"
                  priority
                />
              </div>

              <p className="mt-6 text-center text-[15px] font-semibold leading-snug text-white">
                &ldquo;{missionVision.vision}&rdquo;
              </p>
              <p className="mt-3 text-center text-sm text-navy-300">
                — Our Vision
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  "Post-Op & Injury Recovery",
                  "Chronic Pain",
                  "Sports & Performance",
                  "Dry Needling · Shockwave",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-center text-[13px] font-semibold leading-snug text-navy-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
