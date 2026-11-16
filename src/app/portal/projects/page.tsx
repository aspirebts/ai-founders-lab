import type { Metadata } from "next";
import { EmptyState, Tag } from "@/components/ui/bits";
import { ActionButton } from "@/components/ui/form";
import { Card, PanelHeader } from "@/components/portal/parts";
import { ProjectForm } from "@/components/portal/project-form";
import { deleteProject } from "@/lib/actions/member";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { stageLabel } from "@/lib/content/site";
import type { ProjectRow } from "@/lib/types";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as ProjectRow[];

  return (
    <>
      <PanelHeader eyebrow="Projects" title="Projects and startups">
        Keep track of what you are building. Projects are private unless you choose to share them with
        other members.
      </PanelHeader>

      <div className="space-y-5">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet.">Add the idea or product you are working on below.</EmptyState>
        ) : (
          projects.map((p) => (
            <section key={p.id} className="border border-line bg-white/40">
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{stageLabel[p.stage]}</Tag>
                    <Tag tone={p.is_public ? "signal" : "default"}>{p.is_public ? "Shared with members" : "Private"}</Tag>
                  </div>
                  <h2 className="display display-sm mt-3">{p.name}</h2>
                  <p className="mt-1 text-ink-soft">{p.one_liner}</p>
                  {p.description && <p className="mt-3 max-w-2xl text-sm whitespace-pre-line text-ink-soft">{p.description}</p>}
                  {p.url && (
                    <p className="mt-3 text-sm">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="link break-all">
                        {p.url}
                      </a>
                    </p>
                  )}
                </div>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <ActionButton danger confirm={`Delete "${p.name}"? This cannot be undone.`}>
                    Delete
                  </ActionButton>
                </form>
              </div>
              <details className="border-t border-line">
                <summary className="label cursor-pointer px-5 py-3 hover:text-signal-deep">Edit project</summary>
                <div className="border-t border-line p-5">
                  <ProjectForm project={p} />
                </div>
              </details>
            </section>
          ))
        )}

        <Card title="Add a project">
          <ProjectForm />
        </Card>
      </div>
    </>
  );
}
