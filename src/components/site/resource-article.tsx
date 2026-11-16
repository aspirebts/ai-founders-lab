import Link from "next/link";
import Markdown from "react-markdown";
import { SampleTag, Tag } from "@/components/ui/bits";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ResourceRow } from "@/lib/types";

export function ResourceArticle({
  resource,
  back,
}: {
  resource: ResourceRow;
  back: { href: string; label: string };
}) {
  return (
    <article>
      <header className="wrap border-b border-line pt-14 pb-12 md:pt-20 md:pb-16">
        <p className="label text-muted">
          <Link href={back.href} className="link">
            {back.label}
          </Link>{" "}
          / {labels.resourceKind[resource.kind]}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag>{labels.resourceKind[resource.kind]}</Tag>
          {resource.members_only && <Tag tone="signal">Members</Tag>}
          {resource.is_sample && <SampleTag>Sample content</SampleTag>}
        </div>
        <h1 className="display display-lg mt-6 max-w-[20ch]">{resource.title}</h1>
        <p className="lede mt-6 max-w-2xl text-ink-soft">{resource.summary}</p>
        {resource.published_at && (
          <p className="label mt-8 text-muted">Published {formatDate(resource.published_at)}</p>
        )}
      </header>
      <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-8 md:col-start-3">
          {resource.is_sample && (
            <p className="mb-8 border border-dashed border-ink/50 p-4 text-sm text-ink-soft">
              This is sample content, included to show how resources are presented. It will be replaced
              by the Lab&apos;s own published material.
            </p>
          )}
          <div className="prose-afl">
            <Markdown>{resource.body}</Markdown>
          </div>
          {resource.external_url && (
            <p className="mt-10">
              <a href={resource.external_url} target="_blank" rel="noopener noreferrer" className="link font-medium">
                Open the linked resource ↗
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
