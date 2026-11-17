"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, notConfigured } from "@/lib/env";
import {
  applicationSchema,
  consultationSchema,
  contactSchema,
  eventRegistrationSchema,
  newsletterSchema,
  parseForm,
  waitlistSchema,
} from "@/lib/validation";
import type { FormState } from "@/lib/types";

const UNIQUE_VIOLATION = "23505";
const genericError: FormState = {
  status: "error",
  message: "Something went wrong on our side. Please try again in a moment.",
};

/** Hidden field that people never see. Bots that fill it are silently ignored. */
function isBot(formData: FormData) {
  return Boolean(formData.get("company_website"));
}

export async function joinWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = {
    status: "success",
    message: "You are on the list. We will email you when dates are announced.",
  };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(waitlistSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("waitlist_entries").insert(data);
  if (dbError && dbError.code !== UNIQUE_VIOLATION) {
    console.error("joinWaitlist", dbError.message);
    return genericError;
  }
  // A duplicate is reported as success: the person is on the list either way,
  // and we avoid confirming to strangers whether an email is already registered.
  return success;
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = { status: "success", message: "Subscribed. Look out for the next issue." };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(newsletterSchema, formData);
  if (error) return { ...error, message: error.fieldErrors?.email?.[0] ?? error.message };

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("newsletter_subscribers").insert(data);
  if (dbError && dbError.code !== UNIQUE_VIOLATION) {
    console.error("subscribeNewsletter", dbError.message);
    return genericError;
  }
  return success;
}

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = { status: "success" };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(applicationSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { consent, ...application } = data;
  const { error: dbError } = await supabase
    .from("applications")
    .insert({ ...application, user_id: user?.id ?? null });
  if (dbError) {
    console.error("submitApplication", dbError.message);
    return genericError;
  }
  return success;
}

export async function requestConsultation(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = {
    status: "success",
    message: "Request received. We will reply by email to arrange a time and confirm the fee.",
  };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(consultationSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error: dbError } = await supabase
    .from("consultation_requests")
    .insert({ ...data, user_id: user?.id ?? null });
  if (dbError) {
    console.error("requestConsultation", dbError.message);
    return genericError;
  }
  return success;
}

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = { status: "success", message: "Message sent. We will reply by email." };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(contactSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("contact_messages").insert(data);
  if (dbError) {
    console.error("sendContactMessage", dbError.message);
    return genericError;
  }
  return success;
}

export async function registerForEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const success: FormState = {
    status: "success",
    message: "You are registered. Joining details will be sent to your email before the event.",
  };
  if (isBot(formData)) return success;

  const { data, error } = parseForm(eventRegistrationSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { data: result, error: dbError } = await supabase.rpc("register_for_event", {
    p_event_id: data.event_id,
    p_full_name: data.full_name,
    p_email: data.email,
  });
  if (dbError) {
    console.error("registerForEvent", dbError.message);
    return genericError;
  }

  switch (result) {
    case "registered":
    case "already_registered":
      return success;
    case "full":
      return { status: "error", message: "This event is now full." };
    case "closed":
      return { status: "error", message: "Registration for this event has closed." };
    default:
      return { status: "error", message: "Please check your name and email and try again." };
  }
}
