import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import type { EventRow, ResourceRow } from "@/lib/types";

/**
 * Cached reads of public content. These run as an anonymous visitor, so row
 * level security guarantees only published, public rows are returned.
 * Admin actions call updateTag("events") / updateTag("resources") on change.
 */

export async function getUpcomingEvents(limit?: number): Promise<EventRow[]> {
  "use cache";
  cacheTag("events");
  cacheLife("minutes");

  let query = createPublicClient()
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("getUpcomingEvents", error.message);
    return [];
  }
  return (data ?? []) as EventRow[];
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  "use cache";
  cacheTag("events");
  cacheLife("minutes");

  const { data } = await createPublicClient()
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as EventRow | null) ?? null;
}

export type ResourceSummary = Omit<ResourceRow, "body">;

/** All published resources, without bodies. Members-only items are listed but their content is not exposed here. */
export async function getPublicResources(): Promise<ResourceSummary[]> {
  "use cache";
  cacheTag("resources");
  cacheLife("minutes");

  const { data, error } = await createPublicClient()
    .from("resources")
    .select(
      "id, slug, title, kind, summary, external_url, members_only, is_published, is_sample, published_at, created_at, updated_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) {
    console.error("getPublicResources", error.message);
    return [];
  }
  return (data ?? []) as ResourceSummary[];
}

export async function getPublicResourceBySlug(slug: string): Promise<ResourceRow | null> {
  "use cache";
  cacheTag("resources");
  cacheLife("minutes");

  const { data } = await createPublicClient()
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as ResourceRow | null) ?? null;
}
