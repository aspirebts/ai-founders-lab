const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return dateFmt.format(new Date(iso));
}

/** UTC date and time, e.g. "Tue, 1 Dec 2026, 17:00 UTC". */
export function formatDateTimeUTC(iso: string) {
  return `${dateTimeFmt.format(new Date(iso))} UTC`;
}

export function dayAndMonth(iso: string) {
  const d = new Date(iso);
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }),
    year: String(d.getUTCFullYear()),
  };
}

/** Value for <input type="datetime-local">, expressed in UTC. */
export function toDateTimeLocalUTC(iso: string) {
  return new Date(iso).toISOString().slice(0, 16);
}

export function csvEscape(value: unknown) {
  let s = value === null || value === undefined ? "" : String(value);
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]) {
  const lines = [columns.join(",")];
  for (const row of rows) lines.push(columns.map((c) => csvEscape(row[c])).join(","));
  return lines.join("\r\n");
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** True when the given time has passed. Request-time only: do not call from cached code. */
export function hasPassed(iso: string) {
  return new Date(iso).getTime() <= new Date().getTime();
}
