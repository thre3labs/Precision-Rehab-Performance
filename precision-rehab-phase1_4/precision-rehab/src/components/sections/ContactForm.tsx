"use client";

import { useState, FormEvent } from "react";
import { site } from "@/lib/content";
import { track, trackLead } from "@/components/analytics/Analytics";

/**
 * Lead capture form. Submits to /api/contact, which delivers the lead to a
 * configured destination and returns success ONLY if one accepted it.
 *
 * That contract is the whole point. This form previously showed "Request
 * received" unconditionally, because the endpoint logged the lead and returned
 * ok. If the endpoint cannot deliver, this form must say so and put the phone
 * number in front of the patient — never claim a request went through.
 *
 * Field choices are deliberately minimal for a healthcare intake, and the
 * "what brings you in" field explicitly asks visitors not to submit detailed
 * medical history: this form is not a PHI-safe channel and should not invite
 * people to treat it as one.
 *
 * Fields use --field-bg / --field-border rather than the card surface, so they
 * never disappear into the panel behind them.
 */
export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      // Records that a screening was requested. Never the form contents —
      // see the note on trackLead(). Fired only after the server confirms
      // delivery, so the conversion count matches leads the clinic received.
      trackLead();
      track("free_screening_submit");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-card form-done" role="status">
        <span className="done-mark" aria-hidden="true">
          <svg className="ico" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3>Request received</h3>
        <p>
          Thanks for reaching out. We&rsquo;ll be in touch shortly to schedule
          your free 15-minute screening.
        </p>
      </div>
    );
  }

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
      aria-label="Contact and free screening request form"
    >
      <h3>Request your free screening</h3>
      <p>Prefer to skip the form? Call or text us directly instead.</p>

      {/*
        Spam honeypot. Hidden from sighted users, from screen readers
        (aria-hidden) and from the keyboard (tabIndex -1), so a real visitor
        can never fill it in. A bot that fills every field does, and the server
        drops that submission. autoComplete="off" stops a browser helpfully
        filling it for someone.
      */}
      <div aria-hidden="true" className="hp-field">
        <label htmlFor="p-company">Company</label>
        <input
          id="p-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="fields">
        <div className="field full">
          <label htmlFor="p-name">Full name</label>
          <input
            id="p-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Smith"
          />
        </div>
        <div className="field">
          <label htmlFor="p-phone">Phone number</label>
          <input
            id="p-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(321) 555-0100"
          />
        </div>
        <div className="field">
          <label htmlFor="p-email">Email</label>
          <input
            id="p-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@email.com"
          />
        </div>
        <div className="field">
          <label htmlFor="p-contact">Preferred contact method</label>
          <select id="p-contact" name="preferredContact" defaultValue="phone">
            <option value="phone">Phone call</option>
            <option value="text">Text message</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="p-type">Screening preference</label>
          <select id="p-type" name="screeningType" defaultValue="not_sure">
            <option value="not_sure">Not sure yet</option>
            <option value="in_person">In person</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="p-reason">
            What brings you in?{" "}
            <span className="hint">
              (brief summary, please avoid sharing detailed medical history
              here)
            </span>
          </label>
          <textarea
            id="p-reason"
            name="reason"
            rows={3}
            placeholder="e.g. Knee pain after running, post-surgery recovery, general strength &amp; mobility..."
          />
        </div>
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Request free screening"}
      </button>

      {status === "error" && (
        <p className="form-err" role="alert">
          We couldn&rsquo;t send your request, so it has{" "}
          <strong>not</strong> reached the clinic. Please call or text{" "}
          <a href={site.phoneHref} onClick={() => track("phone_click")}>
            {site.phoneDisplay}
          </a>{" "}
          instead and we&rsquo;ll get you booked.
        </p>
      )}

      <p className="privacy">
        <svg
          className="ico"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: "14px", height: "14px" }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>
          Your information is used only to contact you about your inquiry and is
          never sold or shared. Please don&rsquo;t submit sensitive medical
          details through this form. A team member will follow up to discuss
          your care.
        </span>
      </p>
    </form>
  );
}
