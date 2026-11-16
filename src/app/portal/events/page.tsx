import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, SampleTag, Tag } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { LocalTime } from "@/components/ui/local-time";
import { Card, PanelHeader } from "@/components/portal/parts";
import { cancelRegistration } from "@/lib/actions/member";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/content/site";
import type { EventRow } from "@/lib/types";

export const metadata: Metadata = { title: "Events" };

export default async function PortalEventsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [{ data: events }, { data: registrations }] = await Promise.all([
    supabase.from("events").select("*").eq("is_published", true).gte("starts_at", nowIso).order("starts_at"),
    supabase.from("event_registrations").select("id, event_id").eq("user_id", user.id),
  ]);

  const upcoming = (events ?? []) as EventRow[];
  const regByEvent = new Map((registrations ?? []).map((r) => [r.event_id, r.id]));
  const mine = upcoming.filter((e) => regByEvent.has(e.id));
  const others = upcoming.filter((e) => !regByEvent.has(e.id));

  return (
    <>
      <PanelHeader eyebrow="Events" title="Your events">
        Events you have registered for, and what is coming up.
      </PanelHeader>

      <div className="space-y-5">
        <Card title={`Registered · ${mine.length}`}>
          {mine.length === 0 ? (
            <EmptyState title="You have not registered for any upcoming events.">
              Register for an event below and it will appear here.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {mine.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <Link href={`/events/${e.slug}`} className="display display-sm link">
                      {e.title}
                    </Link>
                    <p className="label mt-1.5 text-muted">
                      <LocalTime iso={e.starts_at} endIso={e.ends_at} /> · {e.location}
                    </p>
                  </div>
                  <form action={cancelRegistration}>
                    <input type="hidden" name="id" value={regByEvent.get(e.id)} />
                    <ActionButton danger confirm={`Cancel your place at "${e.title}"?`}>
                      Cancel registration
                    </ActionButton>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Upcoming">
          {others.length === 0 ? (
            <p className="text-ink-soft">
              {upcoming.length === 0 ? "No events are scheduled right now." : "You are registered for everything on the calendar."}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {others.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{labels.eventKind[e.kind]}</Tag>
                      {e.is_sample && <SampleTag />}
                    </div>
                    <p className="mt-2 font-medium">{e.title}</p>
                    <p className="label mt-1 text-muted">
                      <LocalTime iso={e.starts_at} /> · {e.location}
                    </p>
                  </div>
                  <ButtonLink href={`/events/${e.slug}`} size="sm" variant="outline">
                    View and register
                  </ButtonLink>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
