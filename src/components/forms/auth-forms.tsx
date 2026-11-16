"use client";

import Link from "next/link";
import { login, register, requestPasswordReset, updatePassword } from "@/lib/actions/auth";
import { FormMessage, SubmitButton, TextField, useForm } from "@/components/ui/form";

export function LoginForm({ next }: { next?: string }) {
  const { state, form, pending } = useForm(login);
  const e = state.fieldErrors ?? {};
  return (
    <form {...form} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <TextField label="Email address" name="email" type="email" autoComplete="email" errors={e.email} />
      <div>
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          errors={e.password}
        />
        <p className="mt-2 text-right text-sm">
          <Link href="/forgot-password" className="link text-muted">
            Forgot your password?
          </Link>
        </p>
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const { state, form, pending } = useForm(register);
  const e = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="ticks p-6">
        <p className="label text-signal-deep">One more step</p>
        <p className="mt-3 text-lg font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form {...form} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <TextField label="Full name" name="full_name" autoComplete="name" errors={e.full_name} />
      <TextField label="Email address" name="email" type="email" autoComplete="email" errors={e.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters."
        errors={e.password}
      />
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" pendingLabel="Creating account…" className="w-full">
        Create account
      </SubmitButton>
      <p className="text-sm text-muted">
        By creating an account you agree to our{" "}
        <Link href="/privacy" className="link">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { state, form, pending } = useForm(requestPasswordReset);
  if (state.status === "success") {
    return (
      <div role="status" className="ticks p-6">
        <p className="label text-signal-deep">Check your inbox</p>
        <p className="mt-3 text-lg font-medium">{state.message}</p>
      </div>
    );
  }
  return (
    <form {...form} className="space-y-5">
      <TextField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" className="w-full">
        Send reset link
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm() {
  const { state, form, pending } = useForm(updatePassword);
  return (
    <form {...form} className="space-y-5">
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters."
        errors={state.fieldErrors?.password}
      />
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg" pendingLabel="Saving…" className="w-full">
        Set new password
      </SubmitButton>
    </form>
  );
}
