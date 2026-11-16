import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Tag } from "@/components/ui/bits";
import { PanelHeader } from "@/components/portal/parts";
import { ExportLink, FilterChips, Table } from "@/components/admin/parts";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName } from "@/lib/content/programs";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ApplicationRow, ApplicationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Applications" };

export default async function AdminApplicationsPage({ searchParams }: PageProps<"/admin/applications">) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = typeof status === "string" && status in labels.applicationStatus ? status : undefined;

  const supabase = await createClient();
  let query = supabase.from("applications").select("*").order("created_at", { ascending: false }).limit(500);
  if (active) query = query.eq("status", active);
  const { data } = await query;
  const rows = (data ?? []) as ApplicationRow[];

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Applications" action={<ExportLink type="applications" />}>
        Review cohort applications. Open one to read it in full, set a status and add notes.
      </PanelHeader>
      <FilterChips base="/admin/applications" param="status" active={active} options={labels.applicationStatus} />
      {rows.length === 0 ? (
        <EmptyState title="No applications match this view." />
      ) : (
        <Table caption="Applications" head={["Applicant", "Programme", "Background", "Idea", "Received", "Status"]}>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                <Link href={`/admin/applications/${a.id}`} className="link font-medium">
                  {a.full_name}
                </Link>
                <p className="text-sm text-muted">{a.email}</p>
              </td>
              <td>{programName(a.program_slug)}</td>
              <td>{labels.background[a.background as keyof typeof labels.background]?.split(":")[0]}</td>
              <td>{labels.ideaStage[a.idea_stage as keyof typeof labels.ideaStage]}</td>
              <td className="whitespace-nowrap">{formatDate(a.created_at)}</td>
              <td>
                <Tag tone={a.status === "submitted" ? "signal" : a.status === "accepted" ? "solid" : "default"}>
                  {labels.applicationStatus[a.status as ApplicationStatus]}
                </Tag>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
