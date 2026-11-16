import type { Metadata } from "next";
import Link from "next/link";
import { Card, PanelHeader } from "@/components/portal/parts";
import { EventForm } from "@/components/admin/content-forms";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "New event" };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <>
      <PanelHeader eyebrow="Admin · Events" title="New event">
        <Link href="/admin/events" className="label link">
          ← All events
        </Link>
      </PanelHeader>
      <Card title="Event details">
        <EventForm />
      </Card>
    </>
  );
}
