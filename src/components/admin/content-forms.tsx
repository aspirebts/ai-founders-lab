"use client";

import { saveEvent, saveResource } from "@/lib/actions/admin";
import { Checkbox, FormMessage, SelectField, SubmitButton, TextArea, TextField, useForm } from "@/components/ui/form";
import { labels } from "@/lib/content/site";
import { toDateTimeLocalUTC } from "@/lib/format";
import type { EventRow, ResourceRow } from "@/lib/types";

const slugHint = "Lowercase letters, numbers and hyphens. This becomes the page address.";

export function EventForm({ event }: { event?: EventRow }) {
  const { state, form, pending } = useForm(saveEvent);
  const e = state.fieldErrors ?? {};
  return (
    <form {...form} className="space-y-5">
      {event && <input type="hidden" name="id" value={event.id} />}
      <TextField label="Title" name="title" defaultValue={event?.title} errors={e.title} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="URL slug" name="slug" defaultValue={event?.slug} hint={slugHint} placeholder="my-event-name" errors={e.slug} />
        <SelectField label="Type" name="kind" options={labels.eventKind} placeholder={null} defaultValue={event?.kind ?? "workshop"} errors={e.kind} />
      </div>
      <TextArea label="Summary" name="summary" rows={2} defaultValue={event?.summary} hint="One or two sentences, shown in lists." errors={e.summary} />
      <TextArea
        label="Description"
        name="description"
        optional
        rows={10}
        defaultValue={event?.description}
        hint="Markdown is supported: ## headings, - lists, **bold**, [links](https://…)."
        errors={e.description}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Starts (UTC)"
          name="starts_at"
          type="datetime-local"
          defaultValue={event ? toDateTimeLocalUTC(event.starts_at) : undefined}
          hint="Enter times in UTC. Visitors see their own local time."
          errors={e.starts_at}
        />
        <TextField
          label="Ends (UTC)"
          name="ends_at"
          type="datetime-local"
          defaultValue={event ? toDateTimeLocalUTC(event.ends_at) : undefined}
          errors={e.ends_at}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Location" name="location" defaultValue={event?.location ?? "Online"} errors={e.location} />
        <TextField
          label="Capacity"
          name="capacity"
          type="number"
          min={1}
          optional
          defaultValue={event?.capacity ?? ""}
          hint="Leave empty for unlimited places."
          errors={e.capacity}
        />
      </div>
      <div className="space-y-3 border-t border-line pt-5">
        <Checkbox name="is_published" defaultChecked={event?.is_published ?? false}>
          Published: visible on the website and open for registration.
        </Checkbox>
        <Checkbox name="is_sample" defaultChecked={event?.is_sample ?? false}>
          Label as sample content.
        </Checkbox>
      </div>
      <div className="flex flex-wrap items-center gap-5 border-t border-ink pt-5">
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {event ? "Save event" : "Create event"}
        </SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function ResourceForm({ resource }: { resource?: ResourceRow }) {
  const { state, form, pending } = useForm(saveResource);
  const e = state.fieldErrors ?? {};
  return (
    <form {...form} className="space-y-5">
      {resource && <input type="hidden" name="id" value={resource.id} />}
      <TextField label="Title" name="title" defaultValue={resource?.title} errors={e.title} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="URL slug" name="slug" defaultValue={resource?.slug} hint={slugHint} placeholder="my-article-title" errors={e.slug} />
        <SelectField label="Type" name="kind" options={labels.resourceKind} placeholder={null} defaultValue={resource?.kind ?? "article"} errors={e.kind} />
      </div>
      <TextArea label="Summary" name="summary" rows={2} defaultValue={resource?.summary} hint="One or two sentences, shown in lists." errors={e.summary} />
      <TextArea
        label="Body"
        name="body"
        optional
        rows={18}
        defaultValue={resource?.body}
        hint="Markdown is supported: ## headings, - lists, **bold**, [links](https://…)."
        errors={e.body}
        className="font-mono text-sm"
      />
      <TextField
        label="External link"
        name="external_url"
        optional
        inputMode="url"
        defaultValue={resource?.external_url ?? ""}
        hint="For tools or materials hosted elsewhere."
        errors={e.external_url}
      />
      <div className="space-y-3 border-t border-line pt-5">
        <Checkbox name="is_published" defaultChecked={resource?.is_published ?? false}>
          Published.
        </Checkbox>
        <Checkbox name="members_only" defaultChecked={resource?.members_only ?? false}>
          Members only: hidden from the public site, shown in the member portal.
        </Checkbox>
        <Checkbox name="is_sample" defaultChecked={resource?.is_sample ?? false}>
          Label as sample content.
        </Checkbox>
      </div>
      <div className="flex flex-wrap items-center gap-5 border-t border-ink pt-5">
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {resource ? "Save resource" : "Create resource"}
        </SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
