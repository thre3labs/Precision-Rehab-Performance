import { Phone, MessageSquare, CalendarCheck } from "lucide-react";
import { site } from "@/lib/content";

/**
 * Persistent mobile-only conversion bar. Keeps call / text / book actions
 * one thumb-tap away on the device most patients will actually convert on.
 */
export function MobileCTABar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-navy-900/10 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(10,34,68,0.12)] sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={site.phoneHref}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-navy-800 active:bg-navy-50"
        aria-label="Call Precision Rehab & Performance"
      >
        <Phone className="h-5 w-5" strokeWidth={2.25} />
        <span className="text-[11px] font-semibold">Call</span>
      </a>
      <a
        href={site.smsHref}
        className="flex flex-col items-center justify-center gap-0.5 border-x border-navy-900/10 py-2.5 text-navy-800 active:bg-navy-50"
        aria-label="Text Precision Rehab & Performance"
      >
        <MessageSquare className="h-5 w-5" strokeWidth={2.25} />
        <span className="text-[11px] font-semibold">Text</span>
      </a>
      <a
        href="#screening"
        className="flex flex-col items-center justify-center gap-0.5 bg-gold-500 py-2.5 text-navy-950 active:bg-gold-400"
        aria-label="Book your free 15 minute screening"
      >
        <CalendarCheck className="h-5 w-5" strokeWidth={2.25} />
        <span className="text-[11px] font-bold">Free Screening</span>
      </a>
    </div>
  );
}
