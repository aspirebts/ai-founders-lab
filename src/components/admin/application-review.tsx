"use client";

import { updateApplication } from "@/lib/actions/admin";
import { FormMessage, SelectField, SubmitButton, TextArea, useForm } from "@/components/ui/form";
import { labels } from "@/lib/content/site";

export function ApplicationReview({ id, status, notes }: { id: string; status: string; notes: string | null }) {
  const { state, form, pending } = useForm(updateApplication);
  return (
    <form {...form} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <SelectField label="Status" name="status" options={labels.applicationStatus} placeholder={null} defaultValue={status} />
      <TextArea
        label="Internal notes"
        name="admin_notes"
        optional
        rows={6}
        defaultValue={notes ?? ""}
        hint="Visible to administrators only."
      />
      <SubmitButton pending={pending} pendingLabel="Saving…">
        Save review
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
