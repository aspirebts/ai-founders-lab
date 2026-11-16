import Link from "next/link";
import type { ReactNode } from "react";

export function Table({ head, children, caption }: { head: string[]; children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto border border-line bg-white/40">
      <table className="w-full min-w-[40rem] border-collapse text-left text-[0.92rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink">
            {head.map((h) => (
              <th key={h} scope="col" className="label px-4 py-3 font-normal whitespace-nowrap text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-line [&>tr:last-child]:border-b-0 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function FilterChips({
  base,
  param,
  active,
  options,
}: {
  base: string;
  param: string;
  active?: string;
  options: Record<string, string>;
}) {
  const chip = (on: boolean) =>
    `label border px-3 py-2 transition-colors ${on ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"}`;
  return (
    <nav aria-label="Filter" className="mb-5 flex flex-wrap gap-2">
      <Link href={base} className={chip(!active)}>
        All
      </Link>
      {Object.entries(options).map(([value, label]) => (
        <Link key={value} href={`${base}?${param}=${value}`} className={chip(active === value)}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function ExportLink({ type }: { type: string }) {
  return (
    <a href={`/admin/export/${type}`} className="label inline-flex h-9 items-center border border-ink px-3.5 transition-colors hover:bg-ink hover:text-paper">
      Export CSV ↓
    </a>
  );
}

export function Saved({ show, children = "Saved." }: { show: boolean; children?: ReactNode }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-6 border-l-2 border-ok py-1 pl-3 text-sm font-medium text-ok">
      {children}
    </p>
  );
}
