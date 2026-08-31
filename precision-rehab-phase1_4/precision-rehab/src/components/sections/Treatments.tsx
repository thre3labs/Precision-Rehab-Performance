"use client";

import { useState } from "react";
import {
  Activity,
  Sparkles,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import { treatmentCategories } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const icons = [Activity, Sparkles, Trophy];

/**
 * All category panels render in the markup at all times (only the active
 * one is visually hidden via the `hidden` attribute) so every treatment,
 * condition, and modality stays present in the page's HTML for SEO and
 * accessibility — switching tabs is a pure visual toggle, not a content
 * fetch or unmount.
 */
export function Treatments() {
  const [active, setActive] = useState(0);

  return (
    <section id="treatments" className="scroll-mt-20 bg-gold-50 py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>How We Can Help</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
            Get Back on Track with Precision
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            Whether you&rsquo;re dealing with pain, recovering from surgery,
            or trying to get back to the activities you love, we&rsquo;ll
            help you move better, feel stronger, and get back to doing what
            matters most.
          </p>
        </div>

        {/* Category selector */}
        <div
          role="tablist"
          aria-label="Treatment categories"
          className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center"
        >
          {treatmentCategories.map((category, i) => {
            const Icon = icons[i % icons.length];
            const isActive = i === active;
            return (
              <button
                key={category.title}
                type="button"
                role="tab"
                id={`treatment-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`treatment-panel-${i}`}
                onClick={() => setActive(i)}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-center text-[13px] font-bold transition-colors sm:text-[13.5px] ${
                  isActive
                    ? "border-navy-700 bg-navy-700 text-white shadow-soft"
                    : "border-navy-900/10 bg-white text-navy-700 hover:border-navy-700/40"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {category.title}
              </button>
            );
          })}
        </div>

        {/* Active category panel */}
        <div className="mx-auto mt-6 max-w-3xl">
          {treatmentCategories.map((category, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={category.title}
                id={`treatment-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`treatment-tab-${i}`}
                hidden={i !== active}
                className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-soft sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-4 border-b border-navy-900/5 pb-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white shadow-soft">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-navy-950">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-navy-600">
                      {category.description}
                    </p>
                  </div>
                  {category.note && (
                    <span className="shrink-0 rounded-full bg-gold-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-700">
                      {category.note}
                    </span>
                  )}
                </div>

                <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-500" />
                      <div>
                        <span className="text-[14px] font-bold text-navy-800">
                          {item.name}
                        </span>
                        {item.blurb && (
                          <p className="mt-0.5 text-[13px] leading-snug text-navy-500">
                            {item.blurb}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-[15px] text-navy-600">
            Don&rsquo;t see your exact condition listed? We likely still
            treat it. The fastest way to find out is a free 15-minute
            screening.
          </p>
        </div>
      </Container>
    </section>
  );
}
