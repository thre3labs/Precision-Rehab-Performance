import { ReactNode } from "react";

export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${
        light ? "text-gold-300" : "text-gold-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-gold-300" : "bg-gold-500"}`} />
      {children}
    </span>
  );
}
