import type { Metadata } from "next";
import { EmptyState, Tag } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { PanelHeader } from "@/components/portal/parts";
import { ExportLink, Table } from "@/components/admin/parts";
import { deleteSubscriber, setSubscriberStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);
  const rows = data ?? [];
  const activeCount = rows.filter((r) => r.status === "subscribed").length;

  return (
    <>
      <PanelHeader eyebrow="Admin" title="Newsletter subscribers" action={<ExportLink type="subscribers" />}>
        {activeCount} active {activeCount === 1 ? "subscriber" : "subscribers"}. Export the list to send
        from your email tool.
      </PanelHeader>
      {rows.length === 0 ? (
        <EmptyState title="No subscribers yet." />
      ) : (
        <Table caption="Newsletter subscribers" head={["Email", "Source", "Subscribed", "Status", ""]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="font-medium">{r.email}</td>
              <td className="text-muted">{r.source ?? ""}</td>
              <td className="whitespace-nowrap">{formatDate(r.created_at)}</td>
              <td>
                <Tag tone={r.status === "subscribed" ? "solid" : "default"}>{r.status}</Tag>
              </td>
              <td>
                <div className="flex justify-end gap-4">
                  <form action={setSubscriberStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={r.status === "subscribed" ? "unsubscribed" : "subscribed"} />
                    <ActionButton>{r.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}</ActionButton>
                  </form>
                  <form action={deleteSubscriber}>
                    <input type="hidden" name="id" value={r.id} />
                    <ActionButton danger confirm={`Delete ${r.email}?`}>
                      Delete
                    </ActionButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
