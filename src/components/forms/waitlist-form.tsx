"use client";

import { joinWaitlist } from "@/lib/actions/public";
import { FormMessage, Honeypot, SelectField, SubmitButton, TextField, useForm } from "@/components/ui/form";
import { programs } from "@/lib/content/programs";

const programOptions = Object.fromEntries(programs.map((p) => [p.slug, p.name]));

export function WaitlistForm({
  source,
  defaultProgram = "founder-cohort",
  showProgram = true,
}: {
  source: string;
  defaultProgram?: string;
  showProgram?: boolean;
}) {
  const { state, form, pending } = useForm(joinWaitlist);

  if (state.status === "success") {
    return (
      <div role="status" className="ticks p-6">
        <p className="label text-signal-deep">Confirmed</p>
        <p className="display display-sm mt-3">You are on the list.</p>
        <p className="mt-3 text-ink-soft">
          We will email you as soon as dates are announced. Nothing else is needed from you for now.
        </p>
      </div>
    );
  }

  return (
    <form {...form} className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <TextField
        label="Full name"
        name="full_name"
        autoComplete="name"
        errors={state.fieldErrors?.full_name}
      />
      <TextField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      {showProgram ? (
        <SelectField
          label="Programme"
          name="program_slug"
          options={programOptions}
          placeholder={null}
          defaultValue={defaultProgram in programOptions ? defaultProgram : "founder-cohort"}
          errors={state.fieldErrors?.program_slug}
        />
      ) : (
        <input type="hidden" name="program_slug" value={defaultProgram} />
      )}
      <FormMessage state={state} />
      <SubmitButton pending={pending} pendingLabel="Joining…" size="lg" className="w-full sm:w-auto">
        Join the waitlist
      </SubmitButton>
      <p className="text-sm text-muted">
        We will only use your details to contact you about this programme. See our{" "}
        <a href="/privacy" className="link">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
