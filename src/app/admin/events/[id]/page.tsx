import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { Card, PanelHeader } from "@/components/portal/parts";
import { EventForm } from "@/components/admin/content-forms";
import { Table } from "@/components/admin/parts";
import { deleteEvent, removeRegistration } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { EventRow } from "@/lib/types";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: PageProps<"/admin/events/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data }, { data: registrations }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_registrations").select("*").eq("event_id", id).order("created_at"),
  ]);
  if (!data) notFound();
  const event = data as EventRow;
  const regs = registrations ?? [];

  return (
    <>
      <PanelHeader
        eyebrow="Admin · Events"
        title={event.title}
        action={
          event.is_published ? (
            <Link href={`/events/${event.slug}`} className="label link" target="_blank">
              View on site ↗
            </Link>
          ) : undefined
        }
      >
        <Link href="/admin/events" className="label link">
          ← All events
        </Link>
      </PanelHeader>

      <div className="space-y-5">
        <Card
          title={`Registrations · ${regs.length}${event.capacity ? ` / ${event.capacity}` : ""}`}
          action={
            <a href={`/admin/export/registrations?event=${event.id}`} className="label link">
              Export CSV ↓
            </a>
          }
        >
          {regs.length === 0 ? (
            <EmptyState title="Nobody has registered yet." />
          ) : (
            <Table caption="Registrations" head={["Name", "Email", "Member", "Registered", ""]}>
              {regs.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.full_name}</td>
                  <td>
                    <a href={`mailto:${r.email}`} className="link">
                      {r.email}
                    </a>
                  </td>
                  <td>{r.user_id ? "Yes" : "No"}</td>
                  <td className="whitespace-nowrap">{formatDate(r.created_at)}</td>
                  <td className="text-right">
                    <form action={removeRegistration}>
                      <input type="hidden" name="id" value={r.id} />
                      <ActionButton danger confirm={`Remove ${r.full_name} from this event?`}>
                        Remove
                      </ActionButton>
                    </form>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card title="Event details">
          <EventForm event={event} />
        </Card>

        <Card title="Delete">
          <form action={deleteEvent}>
            <input type="hidden" name="id" value={event.id} />
            <ActionButton danger confirm="Delete this event and all of its registrations?">
              Delete event
            </ActionButton>
          </form>
        </Card>
      </div>
    </>
  );
}
