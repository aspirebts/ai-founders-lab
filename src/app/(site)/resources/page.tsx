import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/bits";
import { ResourceList } from "@/components/site/resource-list";
import { labels } from "@/lib/content/site";
import { getPublicResources } from "@/lib/data/public";
import type { ResourceKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resources",
  description: "Articles, guides, learning materials and AI tool recommendations for one-person founders.",
};

const kinds = Object.keys(labels.resourceKind) as ResourceKind[];

export default function ResourcesPage({ searchParams }: PageProps<"/resources">) {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={
          <>
            The Lab <em>library.</em>
          </>
        }
        lede="Articles, guides, learning materials and useful AI tools. Free to read. Members get additional programme materials in the portal."
      />
      <section className="wrap py-14 md:py-20">
        <Suspense fallback={<p className="label text-muted">Loading resources…</p>}>
          <Resources searchParams={searchParams} />
        </Suspense>
      </section>
      <section className="on-ink">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="label text-muted-dark">Member library</p>
            <h2 className="display display-md mt-4 max-w-[20ch]">Workbooks and programme materials are in the portal.</h2>
          </div>
          <ButtonLink href="/register" size="lg" variant="signal">
            Create a free account
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

async function Resources({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { type } = await searchParams;
  const active = kinds.find((k) => k === type);
  const all = await getPublicResources();
  const items = active ? all.filter((r) => r.kind === active) : all;

  const chip = (isActive: boolean) =>
    `label border px-3 py-2 transition-colors ${isActive ? "border-ink bg-ink text-paper" : "border-ink/30 hover:border-ink"}`;

  return (
    <>
      <nav aria-label="Filter resources" className="mb-8 flex flex-wrap gap-2">
        <Link href="/resources" className={chip(!active)} aria-current={!active ? "true" : undefined}>
          All
        </Link>
        {kinds.map((k) => (
          <Link key={k} href={`/resources?type=${k}`} className={chip(active === k)} aria-current={active === k ? "true" : undefined}>
            {labels.resourceKind[k]}
          </Link>
        ))}
      </nav>
      {items.length === 0 ? (
        <div className="border-t border-ink py-12">
          <p className="display display-sm">Nothing published here yet.</p>
          <p className="mt-3 text-ink-soft">New resources are added regularly.</p>
        </div>
      ) : (
        <ResourceList items={items} />
      )}
    </>
  );
}
