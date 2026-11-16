import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/bits";
import { LocalTime } from "@/components/ui/local-time";
import { Card, PanelHeader } from "@/components/portal/parts";
import { StageTracker } from "@/components/portal/stage-tracker";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName } from "@/lib/content/programs";
import { labels, stageLabel } from "@/lib/content/site";
import type { ApplicationStatus, JourneyStage } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const [enrolments, applications, registrations, projects, resources, directory] = await Promise.all([
    supabase.from("enrollments").select("id, program_slug, status").eq("user_id", profile.id),
    supabase
      .from("applications")
      .select("id, program_slug, status, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("event_registrations")
      .select("id, events!inner(slug, title, starts_at)")
      .eq("user_id", profile.id)
      .gte("events.starts_at", nowIso),
    supabase.from("projects").select("id, name, one_liner, stage").eq("owner_id", profile.id).order("updated_at", { ascending: false }),
    supabase
      .from("resources")
      .select("id, slug, title, kind, members_only")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(4),
    supabase.rpc("member_directory"),
  ]);

  const checklist = [
    { done: Boolean(profile.headline && profile.bio), label: "Write your headline and bio", href: "/portal/profile" },
    { done: Boolean(profile.avatar_url), label: "Add a profile photo", href: "/portal/profile" },
    { done: profile.skills.length > 0 || profile.interests.length > 0, label: "List your skills and interests", href: "/portal/profile" },
    { done: Boolean(profile.business_idea), label: "Describe your business idea", href: "/portal/profile" },
    { done: (projects.data?.length ?? 0) > 0, label: "Add your first project", href: "/portal/projects" },
    { done: profile.is_listed, label: "Join the member directory", href: "/portal/profile" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const firstName = profile.full_name.split(" ")[0] || "founder";

  type Reg = { id: string; events: { slug: string; title: string; starts_at: string } };
  const upcoming = ((registrations.data ?? []) as unknown as Reg[]).sort((a, b) =>
    a.events.starts_at.localeCompare(b.events.starts_at),
  );

  return (
    <>
      <PanelHeader eyebrow="Dashboard" title={<>Welcome, {firstName}.</>}>
        You are at the <strong className="font-medium text-ink">{stageLabel[profile.journey_stage]}</strong>{" "}
        stage of the founder journey.
      </PanelHeader>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Founder progress" className="lg:col-span-3">
          <StageTracker current={profile.journey_stage} />
        </Card>

        <Card
          title="Programmes"
          className="lg:col-span-2"
          action={
            <Link href="/portal/programs" className="label link">
              View all
            </Link>
          }
        >
          {(enrolments.data?.length ?? 0) === 0 && (applications.data?.length ?? 0) === 0 ? (
            <div>
              <p className="text-ink-soft">
                You are not enrolled in a programme yet. The founder cohort is open for applications.
              </p>
              <div className="mt-4">
                <ButtonLink href="/apply" size="sm">
                  Apply to the cohort
                </ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {enrolments.data?.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="font-medium">{programName(e.program_slug)}</span>
                  <Tag tone="solid">Enrolled</Tag>
                </li>
              ))}
              {applications.data?.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span>
                    <span className="font-medium">{programName(a.program_slug)}</span>
                    <span className="ml-2 text-sm text-muted">application</span>
                  </span>
                  <Tag tone={a.status === "accepted" ? "solid" : "default"}>
                    {labels.applicationStatus[a.status as ApplicationStatus]}
                  </Tag>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={`Profile · ${doneCount}/${checklist.length}`}>
          <ul className="space-y-2.5 text-[0.95rem]">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-1 flex size-4 shrink-0 items-center justify-center border text-[10px] ${c.done ? "border-ink bg-ink text-paper" : "border-ink/40"}`}
                >
                  {c.done ? "✓" : ""}
                </span>
                {c.done ? (
                  <span className="text-muted line-through">{c.label}</span>
                ) : (
                  <Link href={c.href} className="link">
                    {c.label}
                  </Link>
                )}
                <span className="sr-only">{c.done ? "(done)" : "(to do)"}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Your upcoming events"
          action={
            <Link href="/portal/events" className="label link">
              All events
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <p className="text-ink-soft">
              You have not registered for any upcoming events.{" "}
              <Link href="/portal/events" className="link">
                Browse events
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.slice(0, 3).map((r) => (
                <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/events/${r.events.slug}`} className="link font-medium">
                    {r.events.title}
                  </Link>
                  <p className="label mt-1 text-muted">
                    <LocalTime iso={r.events.starts_at} />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Projects and startups"
          action={
            <Link href="/portal/projects" className="label link">
              Manage
            </Link>
          }
        >
          {(projects.data?.length ?? 0) === 0 ? (
            <p className="text-ink-soft">
              Nothing here yet.{" "}
              <Link href="/portal/projects" className="link">
                Add what you are building
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {projects.data!.slice(0, 3).map((p) => (
                <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="flex items-center justify-between gap-3">
                    <span className="font-medium">{p.name}</span>
                    <span className="label text-muted">{stageLabel[p.stage as JourneyStage]}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">{p.one_liner}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Learning resources"
          action={
            <Link href="/portal/resources" className="label link">
              Library
            </Link>
          }
        >
          {(resources.data?.length ?? 0) === 0 ? (
            <p className="text-ink-soft">New resources are on the way.</p>
          ) : (
            <ul className="divide-y divide-line">
              {resources.data!.map((r) => (
                <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/portal/resources/${r.slug}`} className="link font-medium">
                    {r.title}
                  </Link>
                  <p className="label mt-1 text-muted">
                    {labels.resourceKind[r.kind as keyof typeof labels.resourceKind]}
                    {r.members_only ? " · Members" : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Community" className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-ink-soft">
              <strong className="font-medium text-ink">{directory.data?.length ?? 0}</strong>{" "}
              {directory.data?.length === 1 ? "member is" : "members are"} listed in the directory.
              {!profile.is_listed && " You are not listed yet."}
            </p>
            <ButtonLink href="/portal/community" size="sm" variant="outline">
              Open the community
            </ButtonLink>
          </div>
        </Card>
      </div>
    </>
  );
}
