import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionButton } from "@/components/ui/form";
import { Card, PanelHeader } from "@/components/portal/parts";
import { ApplicationReview } from "@/components/admin/application-review";
import { deleteApplication } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { programName } from "@/lib/content/programs";
import { labels } from "@/lib/content/site";
import { formatDate } from "@/lib/format";
import type { ApplicationRow } from "@/lib/types";

export const metadata: Metadata = { title: "Application" };

function Answer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="label pt-0.5 text-muted">{label}</dt>
      <dd className="break-words whitespace-pre-line">{children || <span className="text-muted">Not provided</span>}</dd>
    </div>
  );
}

export default async function AdminApplicationPage({ params }: PageProps<"/admin/applications/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const a = data as ApplicationRow;

  return (
    <>
      <PanelHeader eyebrow={`Application · ${programName(a.program_slug)}`} title={a.full_name}>
        <Link href="/admin/applications" className="label link">
          ← All applications
        </Link>
      </PanelHeader>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Applicant">
            <dl>
              <Answer label="Email">
                <a href={`mailto:${a.email}`} className="link">
                  {a.email}
                </a>
              </Answer>
              <Answer label="Country">{a.country}</Answer>
              <Answer label="Link">
                {a.linkedin_url && (
                  <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer nofollow" className="link">
                    {a.linkedin_url}
                  </a>
                )}
              </Answer>
              <Answer label="Member account">{a.user_id ? "Yes: applied while signed in" : "No account linked"}</Answer>
              <Answer label="Received">{formatDate(a.created_at)}</Answer>
            </dl>
          </Card>
          <Card title="Background">
            <dl>
              <Answer label="Current occupation">{a.occupation}</Answer>
              <Answer label="Describes themselves as">{labels.background[a.background as keyof typeof labels.background]}</Answer>
              <Answer label="Technical experience">{labels.technicalLevel[a.technical_level as keyof typeof labels.technicalLevel]}</Answer>
              <Answer label="Relevant experience">{a.experience}</Answer>
            </dl>
          </Card>
          <Card title="Idea and commitment">
            <dl>
              <Answer label="Idea stage">{labels.ideaStage[a.idea_stage as keyof typeof labels.ideaStage]}</Answer>
              <Answer label="Idea">{a.idea_summary}</Answer>
              <Answer label="Motivation">{a.motivation}</Answer>
              <Answer label="Weekly time">{labels.weeklyHours[a.weekly_hours as keyof typeof labels.weeklyHours]}</Answer>
              <Answer label="Heard about us via">{a.referral_source}</Answer>
            </dl>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Review">
            <ApplicationReview id={a.id} status={a.status} notes={a.admin_notes} />
            {a.reviewed_at && <p className="label mt-4 text-muted">Last reviewed {formatDate(a.reviewed_at)}</p>}
          </Card>
          <Card title="Remove">
            <form action={deleteApplication}>
              <input type="hidden" name="id" value={a.id} />
              <ActionButton danger confirm="Permanently delete this application?">
                Delete application
              </ActionButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
