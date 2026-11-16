import type { Metadata } from "next";
import { EmptyState, Tag } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { Card, PanelHeader } from "@/components/portal/parts";
import { ExportLink } from "@/components/admin/parts";
import { setEnquiryStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Enquiries" };

function StatusButtons({ id, table, current, options }: { id: string; table: string; current: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options
        .filter((o) => o !== current)
        .map((o) => (
          <form key={o} action={setEnquiryStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="status" value={o} />
            <ActionButton>Mark {o}</ActionButton>
          </form>
        ))}
    </div>
  );
}

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: consultations }, { data: messages }] = await Promise.all([
    supabase.from("consultation_requests").select("*").order("created_at", { ascending: false }).limit(300),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(300),
  ]);

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Enquiries">
        Consultation requests and messages from the contact page. Reply by email, then update the status
        here.
      </PanelHeader>

      <div className="space-y-5">
        <Card title={`Consultation requests · ${consultations?.length ?? 0}`} action={<ExportLink type="consultations" />}>
          {!consultations?.length ? (
            <EmptyState title="No consultation requests yet." />
          ) : (
            <ul className="divide-y divide-line">
              {consultations.map((c) => (
                <li key={c.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p>
                      <span className="font-medium">{c.full_name}</span>{" "}
                      <a href={`mailto:${c.email}`} className="link text-sm text-muted">
                        {c.email}
                      </a>
                    </p>
                    <Tag tone={c.status === "new" ? "signal" : "default"}>{c.status}</Tag>
                  </div>
                  <p className="label mt-2 text-muted">
                    {labels.consultationTopic[c.topic as keyof typeof labels.consultationTopic]} · {formatDate(c.created_at)}
                    {c.availability ? ` · ${c.availability}` : ""}
                  </p>
                  <p className="mt-3 max-w-3xl break-words whitespace-pre-line text-ink-soft">{c.details}</p>
                  <div className="mt-4">
                    <StatusButtons id={c.id} table="consultation_requests" current={c.status} options={["new", "contacted", "scheduled", "closed"]} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={`Messages · ${messages?.length ?? 0}`} action={<ExportLink type="messages" />}>
          {!messages?.length ? (
            <EmptyState title="No messages yet." />
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p>
                      <span className="font-medium">{m.full_name}</span>{" "}
                      <a href={`mailto:${m.email}`} className="link text-sm text-muted">
                        {m.email}
                      </a>
                    </p>
                    <Tag tone={m.status === "new" ? "signal" : "default"}>{m.status}</Tag>
                  </div>
                  <p className="mt-2 font-medium">{m.subject}</p>
                  <p className="label mt-1 text-muted">{formatDate(m.created_at)}</p>
                  <p className="mt-3 max-w-3xl break-words whitespace-pre-line text-ink-soft">{m.message}</p>
                  <div className="mt-4">
                    <StatusButtons id={m.id} table="contact_messages" current={m.status} options={["new", "replied", "closed"]} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
