"use client";

import { useState, FormEvent } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

type ContactMethod = "phone" | "text" | "email";
type ScreeningType = "in_person" | "virtual" | "not_sure";

const inputClasses =
  "w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-navy-400 shadow-sm transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20";

const labelClasses = "mb-1.5 block text-[13px] font-bold text-navy-800";

/**
 * Lead capture form. Submits to /api/contact (see route.ts) which is a
 * documented stub — see PROJECT_NOTES.md for the recommended architecture
 * to wire this into real lead storage + the automated SMS confirmation.
 *
 * Field choices are deliberately minimal for a healthcare intake: no
 * open free-text medical history field, to avoid inviting visitors to
 * submit sensitive PHI over a basic web form.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-navy-900/8 bg-white p-10 text-center shadow-card">
        <CheckCircle2 className="h-12 w-12 text-gold-500" strokeWidth={1.5} />
        <h3 className="mt-4 text-xl font-bold text-navy-950">Request Received</h3>
        <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-navy-600">
          Thanks for reaching out to Precision Rehab &amp; Performance. We&rsquo;ll
          be in touch shortly to schedule your free 15-minute screening.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-card sm:p-8"
      aria-label="Contact and free screening request form"
    >
      <h3 className="text-xl font-bold text-navy-950">
        Request Your Free Screening
      </h3>
      <p className="mt-1.5 text-[13.5px] text-navy-500">
        Prefer to skip the form? Call or text us directly instead.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClasses}>Full Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} placeholder="Jane Smith" />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClasses} placeholder="(321) 555-0100" />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className={inputClasses} placeholder="jane@email.com" />
        </div>

        <div>
          <label htmlFor="preferredContact" className={labelClasses}>Preferred Contact Method</label>
          <select id="preferredContact" name="preferredContact" defaultValue={"phone" as ContactMethod} className={inputClasses}>
            <option value="phone">Phone Call</option>
            <option value="text">Text Message</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div>
          <label htmlFor="screeningType" className={labelClasses}>Screening Preference</label>
          <select id="screeningType" name="screeningType" defaultValue={"not_sure" as ScreeningType} className={inputClasses}>
            <option value="in_person">In Person</option>
            <option value="virtual">Virtual</option>
            <option value="not_sure">Not Sure Yet</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reason" className={labelClasses}>
            What brings you in? <span className="font-normal text-navy-400">(brief summary, please avoid sharing detailed medical history here)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            className={inputClasses}
            placeholder="e.g. Knee pain after running, post-surgery recovery, general strength & mobility..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-[15px] font-bold text-navy-950 shadow-soft transition hover:bg-gold-400 hover:shadow-card disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Request Free Screening"
        )}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-sm font-medium text-red-600">
          Something went wrong. Please call or text us directly instead.
        </p>
      )}

      <p className="mt-4 flex items-start gap-1.5 text-[12px] leading-snug text-navy-400">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Your information is used only to contact you about your inquiry and
        is never sold or shared. Please don&rsquo;t submit sensitive medical
        details through this form. A team member will follow up to discuss
        your care.
      </p>
    </form>
  );
}
