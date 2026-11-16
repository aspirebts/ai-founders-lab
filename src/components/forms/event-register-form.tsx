"use client";

import { registerForEvent } from "@/lib/actions/public";
import { FormMessage, Honeypot, SubmitButton, TextField, useForm } from "@/components/ui/form";

export function EventRegisterForm({
  eventId,
  defaults,
}: {
  eventId: string;
  defaults?: { full_name?: string; email?: string };
}) {
  const { state, form, pending } = useForm(registerForEvent);
  const e = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div role="status">
        <p className="label text-signal">Registered</p>
        <p className="display display-sm mt-3">Your place is saved.</p>
        <p className="mt-3 text-muted-dark">{state.message}</p>
      </div>
    );
  }

  return (
    <form {...form} className="relative space-y-4 text-ink">
      <Honeypot />
      <input type="hidden" name="event_id" value={eventId} />
      <div className="space-y-4 bg-paper p-5">
        <TextField
          label="Full name"
          name="full_name"
          autoComplete="name"
          defaultValue={defaults?.full_name}
          errors={e.full_name}
        />
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaults?.email}
          errors={e.email}
        />
        <FormMessage state={state} />
      </div>
      <SubmitButton pending={pending} variant="signal" size="lg" pendingLabel="Registering…" className="w-full">
        Register for this event
      </SubmitButton>
    </form>
  );
}
