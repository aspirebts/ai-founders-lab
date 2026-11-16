import { NextResponse, type NextRequest } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/format";

const tables: Record<string, { table: string; columns: string[] }> = {
  applications: {
    table: "applications",
    columns: [
      "created_at", "status", "program_slug", "full_name", "email", "country", "linkedin_url", "occupation",
      "background", "technical_level", "idea_stage", "idea_summary", "experience", "motivation",
      "weekly_hours", "referral_source", "admin_notes",
    ],
  },
  waitlist: { table: "waitlist_entries", columns: ["created_at", "full_name", "email", "program_slug", "source"] },
  subscribers: { table: "newsletter_subscribers", columns: ["created_at", "email", "status", "source"] },
  consultations: {
    table: "consultation_requests",
    columns: ["created_at", "status", "full_name", "email", "topic", "details", "availability"],
  },
  messages: { table: "contact_messages", columns: ["created_at", "status", "full_name", "email", "subject", "message"] },
  registrations: { table: "event_registrations", columns: ["created_at", "full_name", "email", "event_id"] },
};

/** CSV downloads for administrators. Row level security applies as well. */
export async function GET(request: NextRequest, { params }: RouteContext<"/admin/export/[type]">) {
  const profile = await getProfile();
  if (profile?.role !== "admin") {
    return new NextResponse("Not found", { status: 404 });
  }

  const { type } = await params;
  const supabase = await createClient();
  let rows: Record<string, unknown>[] = [];
  let columns: string[];

  if (type === "members") {
    columns = ["created_at", "full_name", "email", "role", "journey_stage", "is_listed", "last_sign_in_at"];
    const { data } = await supabase.rpc("admin_list_members");
    rows = data ?? [];
  } else if (tables[type]) {
    columns = tables[type].columns;
    let query = supabase.from(tables[type].table).select(columns.join(",")).order("created_at", { ascending: false });
    const event = request.nextUrl.searchParams.get("event");
    if (type === "registrations" && event && /^[0-9a-f-]{36}$/i.test(event)) query = query.eq("event_id", event);
    const { data } = await query;
    rows = (data ?? []) as unknown as Record<string, unknown>[];
  } else {
    return new NextResponse("Not found", { status: 404 });
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${toCsv(rows, columns)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="afl-${type}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
