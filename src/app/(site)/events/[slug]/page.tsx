import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Markdown from "react-markdown";
import { SampleTag, Tag } from "@/components/ui/bits";
import { LocalTime } from "@/components/ui/local-time";
import { EventRegisterForm } from "@/components/forms/event-register-form";
import { getProfile, getUser } from "@/lib/auth";
import { labels } from "@/lib/content/site";
import { getEventBySlug } from "@/lib/data/public";
import { formatDateTimeUTC, hasPassed } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return event ? { title: event.title, description: event.summary } : { title: "Event" };
}

export default function EventPage({ params }: PageProps<"/events/[slug]">) {
  return (
    <Suspense fallback={<div className="wrap label py-24 text-muted">Loading event…</div>}>
      <EventContent params={params} />
    </Suspense>
  );
}

async function EventContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  // Whether registration is still open depends on the time of the request.
  await connection();
  const isPast = hasPassed(event.starts_at);

  return (
    <article>
      <header className="wrap border-b border-line pt-14 pb-12 md:pt-20 md:pb-16">
        <p className="label text-muted">
          <Link href="/events" className="link">
            Events
          </Link>{" "}
          / {labels.eventKind[event.kind]}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag>{labels.eventKind[event.kind]}</Tag>
          {event.is_sample && <SampleTag>Sample event</SampleTag>}
        </div>
        <h1 className="display display-lg mt-6 max-w-[20ch]">{event.title}</h1>
        <p className="lede mt-6 max-w-2xl text-ink-soft">{event.summary}</p>
      </header>

      <div className="wrap grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          {event.is_sample && (
            <p className="mb-8 border border-dashed border-ink/50 p-4 text-sm text-ink-soft">
              This is a sample event shown to demonstrate how events work. Registration is functional,
              but the session is a placeholder until the real programme is announced.
            </p>
          )}
          <div className="prose-afl">
            <Markdown>{event.description || event.summary}</Markdown>
          </div>
        </div>

        <aside className="md:col-span-5 lg:col-span-4 lg:col-start-9">
          <div className="on-ink sticky top-24 p-6">
            <dl className="space-y-4 border-b border-line-dark pb-6">
              <div>
                <dt className="label text-muted-dark">When</dt>
                <dd className="mt-1 font-medium">
                  <LocalTime iso={event.starts_at} endIso={event.ends_at} />
                </dd>
                <dd className="label mt-1 text-muted-dark">{formatDateTimeUTC(event.starts_at)}</dd>
              </div>
              <div>
                <dt className="label text-muted-dark">Where</dt>
                <dd className="mt-1 font-medium">{event.location}</dd>
              </div>
              <div>
                <dt className="label text-muted-dark">Cost</dt>
                <dd className="mt-1 font-medium">Free</dd>
              </div>
              {event.capacity && (
                <div>
                  <dt className="label text-muted-dark">Places</dt>
                  <dd className="mt-1 font-medium">Limited to {event.capacity}</dd>
                </div>
              )}
            </dl>
            <div className="pt-6">
              {isPast ? (
                <p className="text-muted-dark">Registration for this event has closed.</p>
              ) : (
                <Suspense fallback={<EventRegisterForm eventId={event.id} />}>
                  <RegisterWithDefaults eventId={event.id} />
                </Suspense>
              )}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

/** Prefills the form for signed-in members. */
async function RegisterWithDefaults({ eventId }: { eventId: string }) {
  const user = await getUser();
  if (!user) return <EventRegisterForm eventId={eventId} />;
  const profile = await getProfile();
  return (
    <EventRegisterForm
      eventId={eventId}
      defaults={{ full_name: profile?.full_name ?? "", email: user.email ?? "" }}
    />
  );
}
