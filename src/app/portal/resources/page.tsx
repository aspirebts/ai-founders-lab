import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/bits";
import { PanelHeader } from "@/components/portal/parts";
import { ResourceList } from "@/components/site/resource-list";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResourceRow } from "@/lib/types";

export const metadata: Metadata = { title: "Resources" };

export default async function PortalResourcesPage() {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("id, slug, title, kind, summary, external_url, members_only, is_published, is_sample, published_at, created_at, updated_at")
    .eq("is_published", true)
    .order("members_only", { ascending: false })
    .order("published_at", { ascending: false });
  const items = (data ?? []) as Omit<ResourceRow, "body">[];

  return (
    <>
      <PanelHeader eyebrow="Resources" title="Learning library">
        Everything published by the Lab, including materials reserved for members.
      </PanelHeader>
      {items.length === 0 ? (
        <EmptyState title="Nothing has been published yet.">New materials will appear here.</EmptyState>
      ) : (
        <ResourceList items={items} basePath="/portal/resources" />
      )}
    </>
  );
}
