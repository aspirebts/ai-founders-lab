import Link from "next/link";
import { Tag } from "@/components/ui/bits";
import { Card, PanelHeader } from "@/components/portal/parts";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName } from "@/lib/content/programs";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const supabase = await createClient();
  const count = (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q.then((r) => r.count ?? 0);
  };
  const nowIso = new Date().toISOString();

  const [applications, toReview, waitlist, members, subscribers, consultations, messages, registrations, upcomingEvents, recent] =
    await Promise.all([
      count("applications"),
      count("applications", ["status", "submitted"]),
      count("waitlist_entries"),
      count("profiles"),
      count("newsletter_subscribers", ["status", "subscribed"]),
      count("consultation_requests", ["status", "new"]),
      count("contact_messages", ["status", "new"]),
      count("event_registrations"),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("starts_at", nowIso)
        .eq("is_published", true)
        .then((r) => r.count ?? 0),
      supabase
        .from("applications")
        .select("id, full_name, program_slug, status, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const stats = [
    { label: "Applications", value: applications, note: `${toReview} awaiting review`, href: "/admin/applications" },
    { label: "Waitlist", value: waitlist, note: "people waiting", href: "/admin/waitlist" },
    { label: "Members", value: members, note: "registered accounts", href: "/admin/members" },
    { label: "Subscribers", value: subscribers, note: "newsletter", href: "/admin/subscribers" },
    { label: "Upcoming events", value: upcomingEvents, note: `${registrations} registrations in total`, href: "/admin/events" },
    { label: "New enquiries", value: consultations + messages, note: `${consultations} consultations, ${messages} messages`, href: "/admin/enquiries" },
  ];

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Overview">
        Everything coming in through the website, in one place.
      </PanelHeader>

      <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-3">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="group block h-full bg-paper p-5 transition-colors hover:bg-bone">
              <p className="label text-muted">{s.label}</p>
              <p className="display mt-3 text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-ink-soft">{s.note}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Card
        title="Latest applications"
        className="mt-5"
        action={
          <Link href="/admin/applications" className="label link">
            View all
          </Link>
        }
      >
        {!recent.data?.length ? (
          <p className="text-ink-soft">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.data.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <Link href={`/admin/applications/${a.id}`} className="link font-medium">
                    {a.full_name}
                  </Link>
                  <p className="label mt-1 text-muted">
                    {programName(a.program_slug)} · {formatDate(a.created_at)}
                  </p>
                </div>
                <Tag tone={a.status === "submitted" ? "signal" : "default"}>
                  {labels.applicationStatus[a.status as ApplicationStatus]}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
