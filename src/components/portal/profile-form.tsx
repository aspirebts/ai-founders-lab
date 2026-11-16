"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAvatar, updateProfile } from "@/lib/actions/member";
import { createClient } from "@/lib/supabase/client";
import { Checkbox, FormMessage, SubmitButton, TextArea, TextField, useForm } from "@/components/ui/form";
import { initials } from "@/lib/format";
import type { FormState, Profile } from "@/lib/types";

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function AvatarUploader({ userId, name, url }: { userId: string; name: string; url: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const ext = TYPES[file.type];
    if (!ext) return setState({ status: "error", message: "Use a JPG, PNG or WebP image." });
    if (file.size > MAX_BYTES) return setState({ status: "error", message: "The image must be under 2 MB." });

    startTransition(async () => {
      const supabase = createClient();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });
      if (error) {
        setState({ status: "error", message: "The upload failed. Please try again." });
        return;
      }
      // Tidy up earlier photos so each member keeps a single file.
      const { data: existing } = await supabase.storage.from("avatars").list(userId);
      const stale = (existing ?? [])
        .map((f) => `${userId}/${f.name}`)
        .filter((p) => p !== path);
      if (stale.length) await supabase.storage.from("avatars").remove(stale);

      setState(await setAvatar(path));
      router.refresh();
    });
  };

  const remove = () =>
    startTransition(async () => {
      const supabase = createClient();
      const { data: existing } = await supabase.storage.from("avatars").list(userId);
      if (existing?.length) {
        await supabase.storage.from("avatars").remove(existing.map((f) => `${userId}/${f.name}`));
      }
      setState(await setAvatar(null));
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-5">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Your profile photo" width={96} height={96} className="size-24 object-cover" />
      ) : (
        <span aria-hidden="true" className="flex size-24 items-center justify-center bg-signal text-3xl font-medium">
          {initials(name)}
        </span>
      )}
      <div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id="avatar-file"
          onChange={onChange}
          disabled={pending}
        />
        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor="avatar-file"
            className={`inline-flex h-9 cursor-pointer items-center border border-ink px-3.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper has-[:focus-visible]:outline-2 ${pending ? "pointer-events-none opacity-50" : ""}`}
          >
            {pending ? "Working…" : url ? "Change photo" : "Upload a photo"}
          </label>
          {url && !pending && (
            <button type="button" onClick={remove} className="label link text-signal-deep">
              Remove
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">JPG, PNG or WebP, up to 2 MB. Square images work best.</p>
        <div className="mt-2">
          <FormMessage state={state} />
        </div>
      </div>
    </div>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { state, form, pending } = useForm(updateProfile);
  const e = state.fieldErrors ?? {};

  return (
    <form {...form} className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="label mb-5 w-full border-b border-line pb-2 text-muted">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Full name" name="full_name" defaultValue={profile.full_name} autoComplete="name" errors={e.full_name} />
          <TextField label="Location" name="location" optional defaultValue={profile.location ?? ""} placeholder="City, country" errors={e.location} />
        </div>
        <TextField
          label="Headline"
          name="headline"
          optional
          defaultValue={profile.headline ?? ""}
          placeholder="For example: Former teacher building AI tools for schools"
          errors={e.headline}
        />
        <TextArea label="Bio" name="bio" optional rows={4} defaultValue={profile.bio ?? ""} errors={e.bio} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Website" name="website_url" optional inputMode="url" defaultValue={profile.website_url ?? ""} errors={e.website_url} />
          <TextField label="LinkedIn" name="linkedin_url" optional inputMode="url" defaultValue={profile.linkedin_url ?? ""} errors={e.linkedin_url} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="label mb-5 w-full border-b border-line pb-2 text-muted">Skills and interests</legend>
        <TextField
          label="Skills"
          name="skills"
          optional
          defaultValue={profile.skills.join(", ")}
          hint="Separate with commas. For example: marketing, product design, Python"
          errors={e.skills}
        />
        <TextField
          label="Interests"
          name="interests"
          optional
          defaultValue={profile.interests.join(", ")}
          hint="Industries, problems or technologies you care about."
          errors={e.interests}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="label mb-5 w-full border-b border-line pb-2 text-muted">
          Experience and idea · Private to you and the Lab team
        </legend>
        <TextArea
          label="Experience"
          name="experience"
          optional
          rows={4}
          defaultValue={profile.experience ?? ""}
          hint="Your professional background and anything you have built or run."
          errors={e.experience}
        />
        <TextArea
          label="Business idea"
          name="business_idea"
          optional
          rows={4}
          defaultValue={profile.business_idea ?? ""}
          hint="What you want to build, who it is for, and where you are with it."
          errors={e.business_idea}
        />
      </fieldset>

      <fieldset>
        <legend className="label mb-5 w-full border-b border-line pb-2 text-muted">Member directory</legend>
        <Checkbox name="is_listed" defaultChecked={profile.is_listed}>
          List me in the member directory.
          <span className="mt-1 block text-sm text-muted">
            Other signed-in members will see your name, photo, headline, bio, location, links, skills,
            interests and journey stage. Your email, experience and business idea are never shown.
          </span>
        </Checkbox>
      </fieldset>

      <div className="flex flex-wrap items-center gap-5 border-t border-ink pt-6">
        <SubmitButton pending={pending} pendingLabel="Saving…">
          Save profile
        </SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
