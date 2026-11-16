import type { ReactNode } from "react";

/** Mono eyebrow with an index, e.g. "01 — The thesis". */
export function Eyebrow({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      {index && <span className="text-signal">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "signal" | "solid" }) {
  const tones = {
    default: "border-current/40",
    signal: "border-signal-deep text-signal-deep",
    solid: "border-ink bg-ink text-paper",
  };
  return (
    <span className={`label inline-flex items-center border px-2 py-1 leading-none ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Marks placeholder content so nobody mistakes it for the real thing. */
export function SampleTag({ children = "Sample" }: { children?: ReactNode }) {
  return (
    <span
      className="label inline-flex items-center gap-1.5 border border-dashed border-current/60 px-2 py-1 leading-none"
      title="Placeholder content shown until real content is published"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
      {children}
    </span>
  );
}

/** Standard page opening for interior pages. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="wrap border-b border-line pt-14 pb-12 md:pt-24 md:pb-16">
      <Eyebrow className="text-muted">{eyebrow}</Eyebrow>
      <h1 className="display display-lg mt-6 max-w-[18ch]">{title}</h1>
      {lede && <p className="lede mt-8 max-w-2xl text-ink-soft">{lede}</p>}
      {children && <div className="mt-10">{children}</div>}
    </header>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-ink/30 px-6 py-10 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}
