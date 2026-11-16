"use client";

import { requestConsultation, sendContactMessage } from "@/lib/actions/public";
import { FormMessage, Honeypot, SelectField, SubmitButton, TextArea, TextField, useForm } from "@/components/ui/form";
import { labels } from "@/lib/content/site";
import type { FormState } from "@/lib/types";

function Done({ label, state }: { label: string; state: FormState }) {
  return (
    <div role="status" className="ticks p-6">
      <p className="label text-signal-deep">{label}</p>
      <p className="mt-3 text-lg font-medium">{state.message}</p>
    </div>
  );
}

export function ConsultationForm() {
  const { state, form, pending } = useForm(requestConsultation);
  const e = state.fieldErrors ?? {};
  if (state.status === "success") return <Done label="Request received" state={state} />;

  return (
    <form {...form} className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField idPrefix="consult" label="Full name" name="full_name" autoComplete="name" errors={e.full_name} />
        <TextField idPrefix="consult" label="Email address" name="email" type="email" autoComplete="email" errors={e.email} />
      </div>
      <SelectField
        idPrefix="consult"
        label="What would you like help with?"
        name="topic"
        options={labels.consultationTopic}
        errors={e.topic}
      />
      <TextArea
        idPrefix="consult"
        label="Tell us about your situation"
        name="details"
        minLength={20}
        hint="Where you are, what you are stuck on, and what a useful outcome would look like."
        errors={e.details}
      />
      <TextField
        idPrefix="consult"
        label="Your time zone and general availability"
        name="availability"
        optional
        placeholder="For example: GMT+1, weekday evenings"
        errors={e.availability}
      />
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg">Request a consultation</SubmitButton>
    </form>
  );
}

export function ContactForm() {
  const { state, form, pending } = useForm(sendContactMessage);
  const e = state.fieldErrors ?? {};
  if (state.status === "success") return <Done label="Message sent" state={state} />;

  return (
    <form {...form} className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField idPrefix="msg" label="Full name" name="full_name" autoComplete="name" errors={e.full_name} />
        <TextField idPrefix="msg" label="Email address" name="email" type="email" autoComplete="email" errors={e.email} />
      </div>
      <TextField idPrefix="msg" label="Subject" name="subject" errors={e.subject} />
      <TextArea idPrefix="msg" label="Message" name="message" minLength={10} errors={e.message} />
      <FormMessage state={state} />
      <SubmitButton pending={pending} size="lg">Send message</SubmitButton>
    </form>
  );
}
