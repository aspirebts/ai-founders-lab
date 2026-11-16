import Link from "next/link";
import { SampleTag, Tag } from "@/components/ui/bits";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ResourceRow } from "@/lib/types";

type Item = Omit<ResourceRow, "body">;

export function ResourceList({ items, basePath = "/resources" }: { items: Item[]; basePath?: string }) {
  return (
    <ul className="border-t border-ink">
      {items.map((r) => (
        <li key={r.id} className="border-b border-line">
          <Link
            href={`${basePath}/${r.slug}`}
            className="group grid gap-3 py-7 transition-colors hover:bg-bone/60 md:grid-cols-12 md:items-baseline md:gap-6 md:px-3"
          >
            <div className="flex flex-wrap items-center gap-2 md:col-span-3">
              <Tag>{labels.resourceKind[r.kind]}</Tag>
              {r.members_only && <Tag tone="signal">Members</Tag>}
              {r.is_sample && <SampleTag />}
            </div>
            <div className="md:col-span-7">
              <h3 className="display display-sm transition-colors group-hover:text-signal-deep">{r.title}</h3>
              <p className="mt-2 max-w-xl text-ink-soft">{r.summary}</p>
            </div>
            <p className="label text-muted md:col-span-2 md:text-right">
              {formatDate(r.published_at)}
              <span aria-hidden="true" className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
