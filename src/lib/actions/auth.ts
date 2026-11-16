"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { forgotSchema, loginSchema, parseForm, registerSchema, resetSchema } from "@/lib/validation";
import type { FormState } from "@/lib/types";

/** Only allow redirects to paths on this site. */
function safeNext(value: FormDataEntryValue | null, fallback = "/portal") {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : fallback;
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const { data, error } = parseForm(registerSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { data: result, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name },
      emailRedirectTo: `${env.siteUrl}/auth/confirm`,
    },
  });

  if (authError) {
    if (authError.code === "weak_password") {
      return { status: "error", fieldErrors: { password: [authError.message] } };
    }
    if (authError.code === "user_already_exists") {
      return {
        status: "error",
        message: "An account with this email already exists. Try signing in instead.",
      };
    }
    console.error("register", authError.code, authError.message);
    return { status: "error", message: "We could not create your account. Please try again." };
  }

  // When email confirmation is enabled there is no session yet.
  if (!result.session) {
    return {
      status: "success",
      message: "Check your inbox. We have sent you a link to confirm your email address.",
    };
  }
  redirect(safeNext(formData.get("next"), "/portal/profile?welcome=1"));
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const { data, error } = parseForm(loginSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword(data);
  if (authError) {
    if (authError.code === "email_not_confirmed") {
      return {
        status: "error",
        message: "Please confirm your email address first. Check your inbox for the link.",
      };
    }
    return { status: "error", message: "The email or password is incorrect." };
  }
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const { data, error } = parseForm(forgotSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${env.siteUrl}/auth/confirm?next=/reset-password`,
  });
  if (authError) console.error("requestPasswordReset", authError.message);

  // Same response whether or not the account exists.
  return {
    status: "success",
    message: "If an account exists for that address, a reset link is on its way.",
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { data, error } = parseForm(resetSchema, formData);
  if (error) return error;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      status: "error",
      message: "This reset link has expired. Request a new one and try again.",
    };
  }

  const { error: authError } = await supabase.auth.updateUser({ password: data.password });
  if (authError) {
    return { status: "error", fieldErrors: { password: [authError.message] } };
  }
  redirect("/portal");
}
