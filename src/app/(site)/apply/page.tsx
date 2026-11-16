import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/bits";
import { ApplicationForm } from "@/components/forms/application-form";
import { getProfile, getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join an AI Founders Lab founder cohort. Free for the first cohorts.",
};

const steps = [
  ["Apply", "Tell us about yourself and what you want to build. About ten minutes."],
  ["Review", "Every application is read by a person. We may email you with questions."],
  ["Decision", "You hear from us by email once the cohort date is announced."],
];

export default function ApplyPage({ searchParams }: PageProps<"/apply">) {
  return (
    <>
      <PageHeader
        eyebrow="Application"
        title={
          <>
            Apply to the <em>founder cohort.</em>
          </>
        }
        lede="The cohort is free for the first intakes. You do not need an idea, a technical background or startup experience. You do need the time and the intent to build."
      >
        <ol className="grid max-w-3xl gap-px border border-line bg-line sm:grid-cols-3">
          {steps.map(([title, body], i) => (
            <li key={title} className="bg-paper p-4">
              <p className="label text-signal-deep">Step {i + 1}</p>
              <p className="mt-2 font-medium">{title}</p>
              <p className="mt-1 text-sm text-ink-soft">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted">
          Not ready to apply?{" "}
          <Link href="/waitlist" className="link">
            Join the waitlist instead
          </Link>{" "}
          and we will tell you when dates are announced.
        </p>
      </PageHeader>

      <section className="wrap py-14 md:py-20">
        <Suspense fallback={<p className="label text-muted">Loading the application form…</p>}>
          <Form searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Form({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { program } = await searchParams;
  const user = await getUser();
  const profile = user ? await getProfile() : null;
  return (
    <ApplicationForm
      defaultProgram={typeof program === "string" ? program : undefined}
      signedIn={Boolean(user)}
      defaults={user ? { full_name: profile?.full_name ?? "", email: user.email ?? "" } : undefined}
    />
  );
}
