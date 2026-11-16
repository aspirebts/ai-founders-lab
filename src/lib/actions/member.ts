"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { parseForm, profileSchema, projectSchema, stageSchema } from "@/lib/validation";
import type { FormState } from "@/lib/types";
import { z } from "zod";

async function session() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

const failed: FormState = { status: "error", message: "We could not save that. Please try again." };

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user } = await session();
  const { data, error } = parseForm(profileSchema, formData);
  if (error) return error;

  const { error: dbError } = await supabase.from("profiles").update(data).eq("id", user.id);
  if (dbError) {
    console.error("updateProfile", dbError.message);
    return failed;
  }
  revalidatePath("/portal", "layout");
  return { status: "success", message: "Profile saved." };
}

/**
 * Records the public URL of an avatar the browser has just uploaded.
 * The URL must point inside the caller's own folder in the avatars bucket.
 */
export async function setAvatar(path: string | null): Promise<FormState> {
  const { supabase, user } = await session();

  let avatarUrl: string | null = null;
  if (path !== null) {
    const valid = z
      .string()
      .max(200)
      .regex(/^[0-9a-f-]{36}\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i)
      .safeParse(path);
    if (!valid.success || !path.startsWith(`${user.id}/`)) {
      return { status: "error", message: "That image could not be used." };
    }
    avatarUrl = `${env.supabaseUrl}/storage/v1/object/public/avatars/${path}`;
  }

  const { error } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  if (error) return failed;
  revalidatePath("/portal", "layout");
  return { status: "success", message: avatarUrl ? "Photo updated." : "Photo removed." };
}

export async function updateJourneyStage(formData: FormData) {
  const { supabase, user } = await session();
  const parsed = stageSchema.safeParse({ journey_stage: formData.get("journey_stage") });
  if (!parsed.success) return;
  await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  refresh();
}

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, user } = await session();
  const { data, error } = parseForm(projectSchema, formData);
  if (error) return error;

  const id = formData.get("id");
  const query =
    typeof id === "string" && id
      ? supabase.from("projects").update(data).eq("id", id).eq("owner_id", user.id)
      : supabase.from("projects").insert({ ...data, owner_id: user.id });

  const { error: dbError } = await query;
  if (dbError) {
    console.error("saveProject", dbError.message);
    return failed;
  }
  revalidatePath("/portal", "layout");
  return { status: "success", message: id ? "Project updated." : "Project added." };
}

export async function deleteProject(formData: FormData) {
  const { supabase, user } = await session();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await supabase.from("projects").delete().eq("id", id.data).eq("owner_id", user.id);
  refresh();
}

export async function cancelRegistration(formData: FormData) {
  const { supabase, user } = await session();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await supabase.from("event_registrations").delete().eq("id", id.data).eq("user_id", user.id);
  refresh();
}
