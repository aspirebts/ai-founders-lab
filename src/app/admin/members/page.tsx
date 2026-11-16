import type { Metadata } from "next";
import { EmptyState, Tag } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { PanelHeader } from "@/components/portal/parts";
import { ExportLink, Table } from "@/components/admin/parts";
import { enrolMember, removeEnrolment, setMemberRole } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName, programs } from "@/lib/content/programs";
import { stageLabel } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { JourneyStage } from "@/lib/types";

export const metadata: Metadata = { title: "Members" };

type MemberRow = {
  id: string;
  email: string;
  full_name: string;
  role: "member" | "admin";
  journey_stage: JourneyStage;
  is_listed: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

export default async function AdminMembersPage() {
  const me = await requireAdmin();
  const supabase = await createClient();
  const [{ data: memberData }, { data: enrolments }] = await Promise.all([
    supabase.rpc("admin_list_members"),
    supabase.from("enrollments").select("id, user_id, program_slug"),
  ]);
  const members = (memberData ?? []) as MemberRow[];
  const byUser = new Map<string, { id: string; program_slug: string }[]>();
  (enrolments ?? []).forEach((e) => byUser.set(e.user_id, [...(byUser.get(e.user_id) ?? []), e]));

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Members" action={<ExportLink type="members" />}>
        {members.length} registered {members.length === 1 ? "member" : "members"}. Enrol members in
        programmes and manage who has admin access.
      </PanelHeader>
      {members.length === 0 ? (
        <EmptyState title="No members yet." />
      ) : (
        <Table caption="Members" head={["Member", "Stage", "Joined", "Programmes", "Role"]}>
          {members.map((m) => {
            const enrolled = byUser.get(m.id) ?? [];
            const available = programs.filter((p) => !enrolled.some((e) => e.program_slug === p.slug));
            return (
              <tr key={m.id}>
                <td>
                  <p className="font-medium">{m.full_name || "Unnamed member"}</p>
                  <a href={`mailto:${m.email}`} className="link text-sm text-muted">
                    {m.email}
                  </a>
                  {m.is_listed && <p className="label mt-1 text-muted">Listed in directory</p>}
                </td>
                <td>{stageLabel[m.journey_stage]}</td>
                <td className="whitespace-nowrap">
                  {formatDate(m.created_at)}
                  <p className="label mt-1 text-muted">
                    {m.last_sign_in_at ? `Last seen ${formatDate(m.last_sign_in_at)}` : "Never signed in"}
                  </p>
                </td>
                <td>
                  <ul className="space-y-1.5">
                    {enrolled.map((e) => (
                      <li key={e.id} className="flex items-center gap-3">
                        <span>{programName(e.program_slug)}</span>
                        <form action={removeEnrolment}>
                          <input type="hidden" name="id" value={e.id} />
                          <ActionButton danger confirm={`Remove ${m.full_name} from ${programName(e.program_slug)}?`}>
                            Remove
                          </ActionButton>
                        </form>
                      </li>
                    ))}
                  </ul>
                  {available.length > 0 && (
                    <form action={enrolMember} className="mt-2 flex items-center gap-2">
                      <input type="hidden" name="user_id" value={m.id} />
                      <label className="sr-only" htmlFor={`enrol-${m.id}`}>
                        Enrol {m.full_name} in a programme
                      </label>
                      <select id={`enrol-${m.id}`} name="program_slug" className="select-chevron border border-ink/30 bg-white/50 py-1 pr-8 pl-2 text-sm">
                        {available.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ActionButton>Enrol</ActionButton>
                    </form>
                  )}
                </td>
                <td>
                  <Tag tone={m.role === "admin" ? "solid" : "default"}>{m.role}</Tag>
                  {m.id !== me.id && (
                    <form action={setMemberRole} className="mt-2">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="role" value={m.role === "admin" ? "member" : "admin"} />
                      <ActionButton
                        confirm={
                          m.role === "admin"
                            ? `Remove admin access from ${m.email}?`
                            : `Give ${m.email} full admin access?`
                        }
                      >
                        {m.role === "admin" ? "Remove admin" : "Make admin"}
                      </ActionButton>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
