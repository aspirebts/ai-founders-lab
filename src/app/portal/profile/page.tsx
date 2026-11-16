import type { Metadata } from "next";
import { PanelHeader } from "@/components/portal/parts";
import { AvatarUploader, ProfileForm } from "@/components/portal/profile-form";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage({ searchParams }: PageProps<"/portal/profile">) {
  const profile = await requireProfile();
  const { welcome } = await searchParams;

  return (
    <>
      <PanelHeader eyebrow="Profile" title="Your founder profile">
        Tell the Lab and other members who you are and what you are working on.
      </PanelHeader>

      {welcome && (
        <div role="status" className="ticks mb-10 bg-bone p-5">
          <p className="label text-signal-deep">Account created</p>
          <p className="mt-2 font-medium">Welcome to AI Founders Lab. Start by completing your profile.</p>
        </div>
      )}

      <section className="mb-10">
        <h2 className="label mb-5 border-b border-line pb-2 text-muted">Profile photo</h2>
        <AvatarUploader userId={profile.id} name={profile.full_name} url={profile.avatar_url} />
      </section>

      <ProfileForm profile={profile} />
    </>
  );
}
