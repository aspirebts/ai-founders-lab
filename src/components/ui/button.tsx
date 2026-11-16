import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "signal" | "outline" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-signal hover:text-ink",
  signal: "bg-signal text-ink hover:bg-paper hover:text-ink",
  outline: "border border-current hover:bg-ink hover:text-paper hover:border-ink",
  ghost: "underline decoration-1 underline-offset-4 hover:text-signal-deep",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${variant === "ghost" ? "" : sizes[size]} ${extra}`;
}

export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover/btn:translate-x-1"
    >
      →
    </span>
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string };

export function ButtonLink({
  variant,
  size,
  arrow = true,
  children,
  className = "",
  ...props
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow = false,
  children,
  className = "",
  ...props
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
