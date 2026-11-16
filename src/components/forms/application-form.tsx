"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { submitApplication } from "@/lib/actions/public";
import { Checkbox, FormMessage, Honeypot, SelectField, SubmitButton, TextArea, TextField, useForm } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { programs } from "@/lib/content/programs";
import { labels } from "@/lib/content/site";

const programOptions = Object.fromEntries(programs.map((p) => [p.slug, p.name]));

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-ink pt-6 md:grid-cols-12">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden="true" className="md:col-span-4">
        <p className="label text-signal-deep">{index}</p>
        <p className="display display-sm mt-2">{title}</p>
      </div>
      <div className="space-y-5 md:col-span-8">{children}</div>
    </fieldset>
  );
}

export function ApplicationForm({
  defaultProgram,
  defaults,
  signedIn,
}: {
  defaultProgram?: string;
  defaults?: { full_name?: string; email?: string };
  signedIn: boolean;
}) {
  const { state, form, pending } = useForm(submitApplication);
  const topRef = useRef<HTMLDivElement>(null);
  const e = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status !== "idle") topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={topRef} role="status" className="ticks scroll-mt-28 p-8 md:p-12">
        <p className="label text-signal-deep">Application received</p>
        <h2 className="display display-md mt-4">Thank you. We have your application.</h2>
        <div className="mt-6 max-w-xl space-y-4 text-ink-soft">
          <p>
            Every application is read by a person. The cohort start date has not been announced yet; we
            will contact you by email once it is, with a decision or any follow-up questions.
          </p>
          {signedIn ? (
            <p>You can follow the status of your application in the member portal.</p>
          ) : (
            <p>
              In the meantime, you can create a free member account to set up your profile and register
              for events.
            </p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {signedIn ? (
            <ButtonLink href="/portal/programs">View in the portal</ButtonLink>
          ) : (
            <ButtonLink href="/register">Create an account</ButtonLink>
          )}
          <ButtonLink href="/events" variant="outline">
            See upcoming events
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form {...form} className="relative space-y-12">
      <div ref={topRef} className="scroll-mt-28">
        <FormMessage state={state} />
      </div>
      <Honeypot />

      <Section index="01" title="About you">
        <SelectField
          label="Which programme are you applying to?"
          name="program_slug"
          options={programOptions}
          placeholder={null}
          defaultValue={defaultProgram && defaultProgram in programOptions ? defaultProgram : "founder-cohort"}
          errors={e.program_slug}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Full name"
            name="full_name"
            autoComplete="name"
            defaultValue={defaults?.full_name}
            errors={e.full_name}
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={defaults?.email}
            errors={e.email}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Country" name="country" autoComplete="country-name" errors={e.country} />
          <TextField
            label="LinkedIn or personal website"
            name="linkedin_url"
            optional
            inputMode="url"
            placeholder="linkedin.com/in/…"
            errors={e.linkedin_url}
          />
        </div>
      </Section>

      <Section index="02" title="Your background">
        <TextField
          label="What do you do today?"
          name="occupation"
          placeholder="For example: operations manager at a logistics company"
          errors={e.occupation}
        />
        <SelectField
          label="Which best describes you?"
          name="background"
          options={labels.background}
          errors={e.background}
        />
        <SelectField
          label="How much technical experience do you have?"
          name="technical_level"
          options={labels.technicalLevel}
          hint="There is no wrong answer. Many of our founders have never written code."
          errors={e.technical_level}
        />
        <TextArea
          label="Relevant experience"
          name="experience"
          optional
          rows={4}
          hint="Work, projects, or anything you have built, sold or run before."
          errors={e.experience}
        />
      </Section>

      <Section index="03" title="Your idea">
        <SelectField
          label="Where are you with a business idea?"
          name="idea_stage"
          options={labels.ideaStage}
          errors={e.idea_stage}
        />
        <TextArea
          label="Describe your idea"
          name="idea_summary"
          optional
          hint="Who is it for, what problem does it solve, and how might AI help? Skip this if you do not have one yet."
          errors={e.idea_summary}
        />
      </Section>

      <Section index="04" title="Commitment">
        <TextArea
          label="Why do you want to join AI Founders Lab?"
          name="motivation"
          rows={5}
          minLength={20}
          hint="What do you hope to have achieved by the end of the programme?"
          errors={e.motivation}
        />
        <SelectField
          label="How much time can you commit each week?"
          name="weekly_hours"
          options={labels.weeklyHours}
          errors={e.weekly_hours}
        />
        <TextField
          label="How did you hear about us?"
          name="referral_source"
          optional
          errors={e.referral_source}
        />
        <Checkbox name="consent" required errors={e.consent}>
          I agree that AI Founders Lab may store this application and contact me about it, as described
          in the{" "}
          <Link href="/privacy" className="link" target="_blank">
            privacy notice
          </Link>
          .
        </Checkbox>
      </Section>

      <div className="flex flex-col gap-4 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm text-muted">
          Applying is free and takes about ten minutes. The programme itself is free for the first
          cohorts.
        </p>
        <SubmitButton pending={pending} pendingLabel="Submitting…" size="lg">
          Submit application
        </SubmitButton>
      </div>
    </form>
  );
}
