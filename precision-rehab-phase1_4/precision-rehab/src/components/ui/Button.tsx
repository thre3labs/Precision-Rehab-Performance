import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold tracking-tight transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-soft hover:shadow-card hover:-translate-y-0.5",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-700 shadow-soft hover:-translate-y-0.5",
  ghost:
    "bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  icon,
  onClick,
  type,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isExternalish = href.startsWith("tel:") || href.startsWith("sms:") || href.startsWith("mailto:");
    return (
      <Link href={href} className={classes} {...(isExternalish ? {} : {})}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}
