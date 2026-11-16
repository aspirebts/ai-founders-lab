"use client";

import { useSyncExternalStore } from "react";
import { formatDateTimeUTC } from "@/lib/format";

const subscribe = () => () => {};

/**
 * Renders a time in UTC on the server, then in the visitor's own time zone
 * once the page is interactive. Suits a global audience.
 */
export function LocalTime({ iso, endIso }: { iso: string; endIso?: string }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  let text = formatDateTimeUTC(iso);
  if (hydrated) {
    const start = new Date(iso);
    const date = start.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const zone =
      new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(start)
        .find((p) => p.type === "timeZoneName")?.value ?? "";
    text = `${date}, ${time(start)}${endIso ? ` to ${time(new Date(endIso))}` : ""} ${zone}`.trim();
  }

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
