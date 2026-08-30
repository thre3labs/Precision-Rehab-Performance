import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Treatments } from "@/components/sections/Treatments";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { AboutPT } from "@/components/sections/AboutPT";
import { FreeScreening } from "@/components/sections/FreeScreening";
import { Insurance } from "@/components/sections/Insurance";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Phase 1 landing page. Sections are ordered to move a visitor through a
 * logical conversion funnel: hero -> treatments -> differentiation -> provider
 * bio -> free screening conversion point -> insurance/cash-pay objection
 * handling -> location/local SEO -> FAQ -> final CTA.
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
        <Treatments />
        <WhyChooseUs />
        <AboutPT />
        <FreeScreening />
        <Insurance />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
