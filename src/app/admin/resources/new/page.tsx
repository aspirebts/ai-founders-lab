import type { Metadata } from "next";
import Link from "next/link";
import { Card, PanelHeader } from "@/components/portal/parts";
import { ResourceForm } from "@/components/admin/content-forms";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New resource" };

export default async function NewResourcePage() {
  await requireAdmin();
  return (
    <>
      <PanelHeader eyebrow="Admin · Resources" title="New resource">
        <Link href="/admin/resources" className="label link">
          ← All resources
        </Link>
      </PanelHeader>
      <Card title="Resource">
        <ResourceForm />
      </Card>
    </>
  );
}
