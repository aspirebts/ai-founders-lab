import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, SampleTag, Tag } from "@/components/ui/bits";
import { PanelHeader } from "@/components/portal/parts";
import { Saved, Table } from "@/components/admin/parts";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ResourceRow } from "@/lib/types";

export const metadata: Metadata = { title: "Resources" };

export default async function AdminResourcesPage({ searchParams }: PageProps<"/admin/resources">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
  const resources = (data ?? []) as ResourceRow[];

  return (
    <>
      <PanelHeader
        eyebrow="Admin"
        title="Resources"
        action={
          <ButtonLink href="/admin/resources/new" size="sm">
            New resource
          </ButtonLink>
        }
      >
        Publish articles, guides, learning materials and tool recommendations.
      </PanelHeader>
      <Saved show={Boolean(saved)}>Resource saved.</Saved>
      {resources.length === 0 ? (
        <EmptyState title="No resources yet.">Create the first one.</EmptyState>
      ) : (
        <Table caption="Resources" head={["Title", "Type", "Updated", "Status"]}>
          {resources.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`/admin/resources/${r.id}`} className="link font-medium">
                  {r.title}
                </Link>
                <p className="mt-0.5 line-clamp-1 max-w-md text-sm text-muted">{r.summary}</p>
              </td>
              <td>{labels.resourceKind[r.kind]}</td>
              <td className="whitespace-nowrap">{formatDate(r.updated_at)}</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <Tag tone={r.is_published ? "solid" : "default"}>{r.is_published ? "Published" : "Draft"}</Tag>
                  {r.members_only && <Tag tone="signal">Members</Tag>}
                  {r.is_sample && <SampleTag />}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
