import Link from "next/link";
import { SampleTag, Tag } from "@/components/ui/bits";
import { LocalTime } from "@/components/ui/local-time";
import { labels } from "@/lib/content/site";
import { dayAndMonth } from "@/lib/format";
import type { EventRow } from "@/lib/types";

export function EventList({ events }: { events: EventRow[] }) {
  return (
    <ul className="border-t border-ink">
      {events.map((event) => {
        const d = dayAndMonth(event.starts_at);
        return (
          <li key={event.id} className="border-b border-line">
            <Link
              href={`/events/${event.slug}`}
              className="group grid gap-4 py-7 transition-colors hover:bg-bone/60 md:grid-cols-12 md:items-start md:gap-6 md:px-3"
            >
              <div className="flex items-baseline gap-3 md:col-span-2 md:block">
                <p className="display text-5xl md:text-6xl">{d.day}</p>
                <p className="label text-muted md:mt-2">
                  {d.month} {d.year}
                </p>
              </div>
              <div className="md:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag>{labels.eventKind[event.kind]}</Tag>
                  {event.is_sample && <SampleTag>Sample event</SampleTag>}
                </div>
                <h3 className="display display-sm mt-3 transition-colors group-hover:text-signal-deep">
                  {event.title}
                </h3>
                <p className="mt-2 max-w-xl text-ink-soft">{event.summary}</p>
              </div>
              <div className="flex items-end justify-between gap-4 md:col-span-3 md:flex-col md:items-end md:text-right">
                <p className="label text-muted">
                  <LocalTime iso={event.starts_at} />
                  <br />
                  {event.location}
                </p>
                <span className="label inline-flex items-center gap-2 text-ink">
                  Details
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
