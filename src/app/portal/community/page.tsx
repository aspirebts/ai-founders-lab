import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Tag } from "@/components/ui/bits";
import { Avatar, PanelHeader } from "@/components/portal/parts";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { stageLabel } from "@/lib/content/site";
import type { JourneyStage } from "@/lib/types";

export const metadata: Metadata = { title: "Community" };

type Member = {
  id: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  interests: string[];
  skills: string[];
  journey_stage: JourneyStage;
};

type SharedProject = {
  id: string;
  name: string;
  one_liner: string;
  description: string | null;
  url: string | null;
  stage: JourneyStage;
  owner_name: string;
};

export default async function CommunityPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [{ data: memberData }, { data: projectData }] = await Promise.all([
    supabase.rpc("member_directory"),
    supabase.rpc("community_projects"),
  ]);
  const members = (memberData ?? []) as Member[];
  const projects = (projectData ?? []) as SharedProject[];

  return (
    <>
      <PanelHeader eyebrow="Community" title="Founders in the Lab">
        Members who have chosen to be listed, and the projects they are sharing.
      </PanelHeader>

      {!profile.is_listed && (
        <div className="ticks mb-10 flex flex-wrap items-center justify-between gap-4 bg-bone p-5">
          <p>
            <span className="font-medium">You are not listed yet.</span>{" "}
            <span className="text-ink-soft">Other members cannot find you in the directory.</span>
          </p>
          <Link href="/portal/profile" className="label link">
            Update your profile →
          </Link>
        </div>
      )}

      <section>
        <h2 className="label mb-5 border-b border-line pb-2 text-muted">Member directory · {members.length}</h2>
        {members.length === 0 ? (
          <EmptyState title="The directory is empty for now.">
            Be the first: tick &ldquo;List me in the member directory&rdquo; on your profile.
          </EmptyState>
        ) : (
          <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
            {members.map((m) => (
              <li key={m.id} className="bg-paper p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={m.full_name} url={m.avatar_url} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium">
                        {m.full_name}
                        {m.id === profile.id && <span className="label ml-2 text-muted">You</span>}
                      </h3>
                      <Tag>{stageLabel[m.journey_stage]}</Tag>
                    </div>
                    {m.headline && <p className="mt-0.5 text-sm text-ink-soft">{m.headline}</p>}
                    {m.location && <p className="label mt-1.5 text-muted">{m.location}</p>}
                  </div>
                </div>
                {m.bio && <p className="mt-4 line-clamp-4 text-sm text-ink-soft">{m.bio}</p>}
                {(m.skills.length > 0 || m.interests.length > 0) && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {[...m.skills, ...m.interests].slice(0, 8).map((t, i) => (
                      <li key={`${t}-${i}`} className="bg-bone px-2 py-0.5 text-xs">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {(m.website_url || m.linkedin_url) && (
                  <p className="label mt-4 flex gap-4">
                    {m.website_url && (
                      <a href={m.website_url} target="_blank" rel="noopener noreferrer nofollow" className="link">
                        Website ↗
                      </a>
                    )}
                    {m.linkedin_url && (
                      <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer nofollow" className="link">
                        LinkedIn ↗
                      </a>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="label mb-5 border-b border-line pb-2 text-muted">Project showcase · {projects.length}</h2>
        {projects.length === 0 ? (
          <EmptyState title="No shared projects yet.">
            Share one of yours from the{" "}
            <Link href="/portal/projects" className="link">
              Projects
            </Link>{" "}
            page.
          </EmptyState>
        ) : (
          <ul className="border-t border-ink">
            {projects.map((p) => (
              <li key={p.id} className="grid gap-2 border-b border-line py-5 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-4">
                  <h3 className="display display-sm">{p.name}</h3>
                  <p className="label mt-1.5 text-muted">
                    {p.owner_name} · {stageLabel[p.stage]}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <p>{p.one_liner}</p>
                  {p.description && <p className="mt-2 text-sm whitespace-pre-line text-ink-soft">{p.description}</p>}
                  {p.url && (
                    <p className="label mt-3">
                      <a href={p.url} target="_blank" rel="noopener noreferrer nofollow" className="link">
                        Visit ↗
                      </a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
