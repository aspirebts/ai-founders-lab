import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/bits";
import { EventList } from "@/components/site/event-list";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getUpcomingEvents } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming online workshops, masterclasses, founder sessions and community events from AI Founders Lab.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title={
          <>
            Learn in the <em>open.</em>
          </>
        }
        lede="Online workshops, masterclasses, founder sessions and community events. Open to members and visitors. Times are shown in your local time zone."
      />

      <section className="wrap py-14 md:py-20">
        <Suspense fallback={<p className="label text-muted">Loading events…</p>}>
          <Events />
        </Suspense>
      </section>

      <section className="border-t border-line bg-bone">
        <div className="wrap grid gap-8 py-16 md:grid-cols-2 md:items-end md:py-20">
          <h2 className="display display-md max-w-[16ch]">Hear about new events first.</h2>
          <div>
            <p className="mb-5 text-ink-soft">
              New sessions are announced in The Lab Notes before they appear here.
            </p>
            <NewsletterForm source="events" />
          </div>
        </div>
      </section>
    </>
  );
}

async function Events() {
  const events = await getUpcomingEvents();
  if (events.length === 0) {
    return (
      <div className="border-t border-ink py-12">
        <p className="display display-sm">No events are scheduled right now.</p>
        <p className="mt-3 text-ink-soft">New sessions are added regularly. Subscribe below to be told.</p>
      </div>
    );
  }
  return (
    <>
      <p className="label mb-6 text-muted">
        {events.length} upcoming {events.length === 1 ? "event" : "events"}
      </p>
      <EventList events={events} />
    </>
  );
}
