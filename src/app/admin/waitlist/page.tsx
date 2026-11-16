import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { PanelHeader } from "@/components/portal/parts";
import { ExportLink, FilterChips, Table } from "@/components/admin/parts";
import { deleteWaitlistEntry } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName, programs } from "@/lib/content/programs";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Waitlist" };

const programOptions = Object.fromEntries(programs.map((p) => [p.slug, p.name]));

export default async function AdminWaitlistPage({ searchParams }: PageProps<"/admin/waitlist">) {
  await requireAdmin();
  const { program } = await searchParams;
  const active = typeof program === "string" && program in programOptions ? program : undefined;

  const supabase = await createClient();
  let query = supabase.from("waitlist_entries").select("*").order("created_at", { ascending: false }).limit(1000);
  if (active) query = query.eq("program_slug", active);
  const { data } = await query;
  const rows = data ?? [];

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Waitlist" action={<ExportLink type="waitlist" />}>
        {rows.length} {rows.length === 1 ? "person" : "people"} waiting for the next intake.
      </PanelHeader>
      <FilterChips base="/admin/waitlist" param="program" active={active} options={programOptions} />
      {rows.length === 0 ? (
        <EmptyState title="Nobody on this list yet." />
      ) : (
        <Table caption="Waitlist entries" head={["Name", "Email", "Programme", "Source", "Joined", ""]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="font-medium">{r.full_name}</td>
              <td>
                <a href={`mailto:${r.email}`} className="link">
                  {r.email}
                </a>
              </td>
              <td>{programName(r.program_slug)}</td>
              <td className="text-muted">{r.source ?? ""}</td>
              <td className="whitespace-nowrap">{formatDate(r.created_at)}</td>
              <td className="text-right">
                <form action={deleteWaitlistEntry}>
                  <input type="hidden" name="id" value={r.id} />
                  <ActionButton danger confirm={`Remove ${r.full_name} from the waitlist?`}>
                    Remove
                  </ActionButton>
                </form>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
