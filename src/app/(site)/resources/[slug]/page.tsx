import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResourceArticle } from "@/components/site/resource-article";
import { ClosingCta } from "@/components/site/cta";
import { getPublicResourceBySlug } from "@/lib/data/public";

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublicResourceBySlug(slug);
  return resource ? { title: resource.title, description: resource.summary } : { title: "Resource" };
}

export default function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  return (
    <>
      <Suspense fallback={<div className="wrap label py-24 text-muted">Loading…</div>}>
        <Content params={params} />
      </Suspense>
      <ClosingCta />
    </>
  );
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Read as an anonymous visitor: members-only resources are not served here.
  const resource = await getPublicResourceBySlug(slug);
  if (!resource) notFound();
  return <ResourceArticle resource={resource} back={{ href: "/resources", label: "Resources" }} />;
}
