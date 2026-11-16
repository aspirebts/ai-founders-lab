import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton } from "@/components/ui/form";
import { Card, PanelHeader } from "@/components/portal/parts";
import { ResourceForm } from "@/components/admin/content-forms";
import { deleteResource } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResourceRow } from "@/lib/types";

export const metadata: Metadata = { title: "Edit resource" };

export default async function EditResourcePage({ params }: PageProps<"/admin/resources/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const resource = data as ResourceRow;
  const href = resource.members_only ? `/portal/resources/${resource.slug}` : `/resources/${resource.slug}`;

  return (
    <>
      <PanelHeader
        eyebrow="Admin · Resources"
        title={resource.title}
        action={
          resource.is_published ? (
            <Link href={href} className="label link" target="_blank">
              View on site ↗
            </Link>
          ) : undefined
        }
      >
        <Link href="/admin/resources" className="label link">
          ← All resources
        </Link>
      </PanelHeader>
      <div className="space-y-5">
        <Card title="Resource">
          <ResourceForm resource={resource} />
        </Card>
        <Card title="Delete">
          <form action={deleteResource}>
            <input type="hidden" name="id" value={resource.id} />
            <ActionButton danger confirm="Permanently delete this resource?">
              Delete resource
            </ActionButton>
          </form>
        </Card>
      </div>
    </>
  );
}
