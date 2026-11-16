import Link from "next/link";

/**
 * The mark: "Apex and Dot".
 * Two strokes meet to form an A (the lab, the tools, the structure).
 * The single dot beneath the apex is the founder: one person, at the centre.
 */
export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect width="32" height="32" fill="var(--mark-bg, #11110f)" />
      <path
        d="M7 25 L16 6.5 L25 25"
        stroke="var(--mark-fg, #f3efe6)"
        strokeWidth="2.6"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <circle cx="16" cy="20.5" r="2.9" fill="#e8421a" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[1.02rem] leading-none tracking-[-0.02em] ${className}`}>
      <span className="font-semibold">AI Founders</span>{" "}
      <span
        className="font-[family-name:var(--font-display)] text-[1.18rem] italic"
        style={{ fontVariationSettings: '"opsz" 36, "WONK" 1' }}
      >
        Lab
      </span>
    </span>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="AI Founders Lab, home"
      className="inline-flex items-center gap-2.5"
      style={
        inverted
          ? ({ "--mark-bg": "#f3efe6", "--mark-fg": "#11110f" } as React.CSSProperties)
          : undefined
      }
    >
      <Mark />
      <Wordmark />
    </Link>
  );
}
