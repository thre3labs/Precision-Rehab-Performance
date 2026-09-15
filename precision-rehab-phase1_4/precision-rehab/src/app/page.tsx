import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ConditionsWeTreat } from "@/components/sections/ConditionsWeTreat";
import { Treatments } from "@/components/sections/Treatments";
import { Modalities } from "@/components/sections/Modalities";
import { AboutPT } from "@/components/sections/AboutPT";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FreeScreening } from "@/components/sections/FreeScreening";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Phase 1 landing page. Sections move a visitor through a conversion funnel:
 * hero -> what we treat -> how we treat it -> the technology behind it ->
 * who treats you -> why this model -> the free screening -> location -> FAQ.
 *
 * Phase 2: every section below is already a standalone component, so promoting
 * any of them to its own route (e.g. `/treatments`, `/about`) is a matter of
 * moving the component into a new page file — no rewrite required.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ConditionsWeTreat />
        <Treatments />
        <Modalities />
        <AboutPT />
        <WhyChooseUs />
        <FreeScreening />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
