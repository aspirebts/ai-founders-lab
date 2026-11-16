"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { eventSchema, parseForm, resourceSchema } from "@/lib/validation";
import { programSlugs } from "@/lib/content/programs";
import type { FormState } from "@/lib/types";

/**
 * Every action re-checks admin access. Row level security enforces the same
 * rule in the database, so these checks are defence in depth, not the only gate.
 */
async function admin() {
  await requireAdmin();
  return createClient();
}

const uuid = z.uuid();
const failed = (message = "That change could not be saved."): FormState => ({ status: "error", message });

// --- Applications -----------------------------------------------------------

export async function updateApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await admin();
  const parsed = z
    .object({
      id: uuid,
      status: z.enum(["submitted", "in_review", "shortlisted", "accepted", "declined"]),
      admin_notes: z.string().trim().max(5000),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failed("Please check the form.");

  const { id, status, admin_notes } = parsed.data;
  const { data: application, error } = await supabase
    .from("applications")
    .update({ status, admin_notes: admin_notes || null, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .select("user_id, program_slug")
    .maybeSingle();
  if (error || !application) return failed();

  // Accepting an applicant who has an account enrols them in the programme.
  let note = "";
  if (status === "accepted") {
    if (application.user_id) {
      await supabase
        .from("enrollments")
        .upsert(
          { user_id: application.user_id, program_slug: application.program_slug, status: "active" },
          { onConflict: "user_id,program_slug" },
        );
      note = " The applicant has been enrolled.";
    } else {
      note = " The applicant has no member account yet; enrol them from Members once they register.";
    }
  }
  refresh();
  return { status: "success", message: `Application updated.${note}` };
}

export async function deleteApplication(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("applications").delete().eq("id", id.data);
  redirect("/admin/applications");
}

// --- Simple row operations --------------------------------------------------

export async function deleteWaitlistEntry(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("waitlist_entries").delete().eq("id", id.data);
  refresh();
}

export async function setSubscriberStatus(formData: FormData) {
  const supabase = await admin();
  const parsed = z
    .object({ id: uuid, status: z.enum(["subscribed", "unsubscribed"]) })
    .safeParse(Object.fromEntries(formData));
  if (parsed.success) {
    await supabase
      .from("newsletter_subscribers")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id);
  }
  refresh();
}

export async function deleteSubscriber(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("newsletter_subscribers").delete().eq("id", id.data);
  refresh();
}

export async function setEnquiryStatus(formData: FormData) {
  const supabase = await admin();
  const parsed = z
    .object({
      id: uuid,
      table: z.enum(["consultation_requests", "contact_messages"]),
      status: z.string().max(20),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const allowed =
    parsed.data.table === "consultation_requests"
      ? ["new", "contacted", "scheduled", "closed"]
      : ["new", "replied", "closed"];
  if (!allowed.includes(parsed.data.status)) return;

  await supabase.from(parsed.data.table).update({ status: parsed.data.status }).eq("id", parsed.data.id);
  refresh();
}

// --- Members ----------------------------------------------------------------

export async function setMemberRole(formData: FormData) {
  const supabase = await admin();
  const parsed = z
    .object({ id: uuid, role: z.enum(["member", "admin"]) })
    .safeParse(Object.fromEntries(formData));
  if (parsed.success) {
    await supabase.rpc("admin_set_role", { p_user_id: parsed.data.id, p_role: parsed.data.role });
  }
  refresh();
}

export async function enrolMember(formData: FormData) {
  const supabase = await admin();
  const parsed = z
    .object({ user_id: uuid, program_slug: z.enum(programSlugs) })
    .safeParse(Object.fromEntries(formData));
  if (parsed.success) {
    await supabase
      .from("enrollments")
      .upsert({ ...parsed.data, status: "active" }, { onConflict: "user_id,program_slug" });
  }
  refresh();
}

export async function removeEnrolment(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("enrollments").delete().eq("id", id.data);
  refresh();
}

// --- Events -----------------------------------------------------------------

export async function saveEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await admin();
  const { data, error } = parseForm(eventSchema, formData);
  if (error) return error;

  const row = {
    ...data,
    starts_at: data.starts_at.toISOString(),
    ends_at: data.ends_at.toISOString(),
  };
  const id = uuid.safeParse(formData.get("id"));
  const { error: dbError } = id.success
    ? await supabase.from("events").update(row).eq("id", id.data)
    : await supabase.from("events").insert(row);

  if (dbError) {
    if (dbError.code === "23505") {
      return { status: "error", fieldErrors: { slug: ["Another event already uses this URL slug."] } };
    }
    console.error("saveEvent", dbError.message);
    return failed();
  }
  updateTag("events");
  redirect("/admin/events?saved=1");
}

export async function deleteEvent(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("events").delete().eq("id", id.data);
  updateTag("events");
  redirect("/admin/events");
}

export async function removeRegistration(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("event_registrations").delete().eq("id", id.data);
  refresh();
}

// --- Resources --------------------------------------------------------------

export async function saveResource(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await admin();
  const { data, error } = parseForm(resourceSchema, formData);
  if (error) return error;

  const id = uuid.safeParse(formData.get("id"));
  let dbError;
  if (id.success) {
    const { data: existing } = await supabase
      .from("resources")
      .select("published_at")
      .eq("id", id.data)
      .maybeSingle();
    const published_at =
      data.is_published && !existing?.published_at ? new Date().toISOString() : existing?.published_at;
    ({ error: dbError } = await supabase
      .from("resources")
      .update({ ...data, published_at })
      .eq("id", id.data));
  } else {
    ({ error: dbError } = await supabase
      .from("resources")
      .insert({ ...data, published_at: data.is_published ? new Date().toISOString() : null }));
  }

  if (dbError) {
    if (dbError.code === "23505") {
      return { status: "error", fieldErrors: { slug: ["Another resource already uses this URL slug."] } };
    }
    console.error("saveResource", dbError.message);
    return failed();
  }
  updateTag("resources");
  redirect("/admin/resources?saved=1");
}

export async function deleteResource(formData: FormData) {
  const supabase = await admin();
  const id = uuid.safeParse(formData.get("id"));
  if (id.success) await supabase.from("resources").delete().eq("id", id.data);
  updateTag("resources");
  redirect("/admin/resources");
}
