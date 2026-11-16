import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Eyebrow } from "@/components/ui/bits";
import { WaitlistForm } from "@/components/forms/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description: "Join the waitlist for the next AI Founders Lab cohort or bootcamp. Be first to hear when dates are announced.",
};

const expect = [
  "An email as soon as the next start date is confirmed",
  "First access to places before they are announced publicly",
  "Nothing else: no sales sequence, no spam",
];

export default function WaitlistPage({ searchParams }: PageProps<"/waitlist">) {
  return (
    <section className="wrap grid gap-14 py-14 md:grid-cols-12 md:py-24">
      <div className="md:col-span-6">
        <Eyebrow className="text-muted">Waitlist</Eyebrow>
        <h1 className="display display-lg mt-6">
          Be first to know when the next cohort <em>opens.</em>
        </h1>
        <p className="lede mt-8 max-w-xl text-ink-soft">
          The next start date has not been announced yet. Leave your name and email and we will tell you
          the moment it is.
        </p>
        <ul className="mt-10 max-w-xl border-t border-ink">
          {expect.map((item, i) => (
            <li key={item} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4">
              <span className="label pt-1 text-muted">0{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          Ready to commit now?{" "}
          <Link href="/apply" className="link">
            Apply to the founder cohort
          </Link>
          . Applications are reviewed first.
        </p>
      </div>
      <div className="md:col-span-5 md:col-start-8">
        <div className="border border-ink bg-bone/60 p-6 md:p-8">
          <p className="label mb-6 text-muted">Join the waitlist · Free</p>
          <Suspense fallback={<WaitlistForm source="waitlist-page" />}>
            <Form searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function Form({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { program } = await searchParams;
  return (
    <WaitlistForm source="waitlist-page" defaultProgram={typeof program === "string" ? program : undefined} />
  );
}
