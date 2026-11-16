import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, SampleTag, Tag } from "@/components/ui/bits";
import { PanelHeader } from "@/components/portal/parts";
import { Saved, Table } from "@/components/admin/parts";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/content/site";
import { formatDateTimeUTC, hasPassed } from "@/lib/format";
import type { EventRow } from "@/lib/types";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage({ searchParams }: PageProps<"/admin/events">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const supabase = await createClient();
  const [{ data }, { data: regs }] = await Promise.all([
    supabase.from("events").select("*").order("starts_at", { ascending: false }),
    supabase.from("event_registrations").select("event_id"),
  ]);
  const events = (data ?? []) as EventRow[];
  const counts = new Map<string, number>();
  (regs ?? []).forEach((r) => counts.set(r.event_id, (counts.get(r.event_id) ?? 0) + 1));

  return (
    <>
      <PanelHeader
        eyebrow="Admin"
        title="Events"
        action={
          <ButtonLink href="/admin/events/new" size="sm">
            New event
          </ButtonLink>
        }
      >
        Create and publish events, and see who has registered.
      </PanelHeader>
      <Saved show={Boolean(saved)}>Event saved.</Saved>
      {events.length === 0 ? (
        <EmptyState title="No events yet.">Create the first one.</EmptyState>
      ) : (
        <Table caption="Events" head={["Event", "When", "Registrations", "Status"]}>
          {events.map((e) => (
            <tr key={e.id}>
              <td>
                <Link href={`/admin/events/${e.id}`} className="link font-medium">
                  {e.title}
                </Link>
                <p className="label mt-1 text-muted">{labels.eventKind[e.kind]}</p>
              </td>
              <td className="whitespace-nowrap">
                {formatDateTimeUTC(e.starts_at)}
                {hasPassed(e.starts_at) && <p className="label mt-1 text-muted">Past</p>}
              </td>
              <td>
                {counts.get(e.id) ?? 0}
                {e.capacity ? ` / ${e.capacity}` : ""}
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <Tag tone={e.is_published ? "solid" : "default"}>{e.is_published ? "Published" : "Draft"}</Tag>
                  {e.is_sample && <SampleTag />}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
