import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ConditionsWeTreat } from "@/components/sections/ConditionsWeTreat";
import { Treatments } from "@/components/sections/Treatments";
import { AboutPT } from "@/components/sections/AboutPT";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FreeScreening } from "@/components/sections/FreeScreening";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Phase 1 landing page. Sections are ordered to move a visitor through a
 * logical conversion funnel: hero -> conditions we treat -> treatments ->
 * provider bio -> differentiation -> free screening conversion point ->
 * location/local SEO -> FAQ -> final CTA.
 *
 * Phase 2: each <Section /> below is already a standalone component, so
 * promoting any of them to its own route (e.g. `/treatments`,
 * `/about`, `/free-screening`) is a matter of moving the component into a
 * new page file — no rewrite required.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ConditionsWeTreat />
        <Treatments />
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
