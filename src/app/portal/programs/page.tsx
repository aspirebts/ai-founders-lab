import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Tag } from "@/components/ui/bits";
import { Card, PanelHeader } from "@/components/portal/parts";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName, programs } from "@/lib/content/programs";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Programmes" };

const statusNote: Record<ApplicationStatus, string> = {
  submitted: "We have your application. It will be reviewed before the cohort is announced.",
  in_review: "Your application is being reviewed.",
  shortlisted: "You have been shortlisted. We will be in touch by email.",
  accepted: "You have been accepted. Welcome aboard.",
  declined: "We were not able to offer you a place this time. You are welcome to apply again.",
};

export default async function PortalProgramsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: enrolments }, { data: applications }] = await Promise.all([
    supabase.from("enrollments").select("id, program_slug, status, created_at").eq("user_id", user.id),
    supabase
      .from("applications")
      .select("id, program_slug, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <PanelHeader eyebrow="Programmes" title="Your programmes">
        Programmes you are enrolled in, and the status of your applications.
      </PanelHeader>

      <div className="space-y-5">
        <Card title="Enrolled">
          {!enrolments?.length ? (
            <EmptyState title="You are not enrolled in a programme yet.">
              When an application is accepted, the programme appears here.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {enrolments.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="display display-sm">{programName(e.program_slug)}</p>
                    <p className="label mt-1 text-muted">Enrolled {formatDate(e.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tag tone="solid">{e.status}</Tag>
                    <Link href={`/programs/${e.program_slug}`} className="label link">
                      Programme details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Applications">
          {!applications?.length ? (
            <p className="text-ink-soft">
              You have not submitted an application while signed in. Applications sent before you
              created your account are still with us, but are not shown here.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {applications.map((a) => (
                <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">{programName(a.program_slug)}</p>
                    <Tag tone={a.status === "accepted" ? "solid" : a.status === "declined" ? "default" : "signal"}>
                      {labels.applicationStatus[a.status as ApplicationStatus]}
                    </Tag>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{statusNote[a.status as ApplicationStatus]}</p>
                  <p className="label mt-2 text-muted">Submitted {formatDate(a.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Open programmes">
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {programs.map((p) => (
              <li key={p.slug} className="flex flex-col bg-paper p-5">
                <p className="label text-muted">
                  {p.kind} · {p.price} · {p.status}
                </p>
                <p className="display display-sm mt-3">{p.name}</p>
                <p className="mt-2 flex-1 text-sm text-ink-soft">{p.summary}</p>
                <div className="mt-5">
                  <ButtonLink href={p.cta.href} size="sm">
                    {p.cta.label}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
