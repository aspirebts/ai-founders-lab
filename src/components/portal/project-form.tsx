"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { saveProject } from "@/lib/actions/member";
import { Checkbox, FormMessage, SelectField, SubmitButton, TextArea, TextField, useForm } from "@/components/ui/form";
import { stageLabel } from "@/lib/content/site";
import type { ProjectRow } from "@/lib/types";

export function ProjectForm({ project }: { project?: ProjectRow }) {
  const router = useRouter();
  const { state, form, pending } = useForm(saveProject);
  const ref = useRef<HTMLFormElement>(null);
  const e = state.fieldErrors ?? {};
  const prefix = project ? `p-${project.id.slice(0, 8)}` : "new";

  useEffect(() => {
    if (state.status === "success") {
      if (!project) ref.current?.reset();
      router.refresh();
    }
  }, [state, project, router]);

  return (
    <form {...form} ref={ref} className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField idPrefix={prefix} label="Project name" name="name" defaultValue={project?.name} errors={e.name} />
        <SelectField
          idPrefix={prefix}
          label="Stage"
          name="stage"
          options={stageLabel}
          placeholder={null}
          defaultValue={project?.stage ?? "discover"}
          errors={e.stage}
        />
      </div>
      <TextField
        idPrefix={prefix}
        label="One-line description"
        name="one_liner"
        defaultValue={project?.one_liner}
        placeholder="What it is and who it is for"
        errors={e.one_liner}
      />
      <TextArea
        idPrefix={prefix}
        label="Details"
        name="description"
        optional
        rows={3}
        defaultValue={project?.description ?? ""}
        errors={e.description}
      />
      <TextField
        idPrefix={prefix}
        label="Link"
        name="url"
        optional
        inputMode="url"
        defaultValue={project?.url ?? ""}
        errors={e.url}
      />
      <Checkbox idPrefix={prefix} name="is_public" defaultChecked={project?.is_public ?? false}>
        Share this project with other members in the community showcase.
      </Checkbox>
      <div className="flex flex-wrap items-center gap-5">
        <SubmitButton pending={pending} pendingLabel="Saving…" size="sm">
          {project ? "Save changes" : "Add project"}
        </SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
