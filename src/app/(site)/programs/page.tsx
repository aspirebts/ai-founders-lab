import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, PageHeader, Tag } from "@/components/ui/bits";
import { futurePrograms, programs } from "@/lib/content/programs";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Founder cohorts and AI startup bootcamps from AI Founders Lab. Free for the first intakes. Apply or join the waitlist.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title={
          <>
            Learn it by <em>building it.</em>
          </>
        }
        lede="Two programmes, one purpose: to get you from where you are now to a real, revenue-generating business. Both are free for the first intakes."
      />

      <section className="wrap">
        {programs.map((p) => (
          <article key={p.slug} id={p.slug} className="grid scroll-mt-24 gap-10 border-b border-ink py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-5">
              <p className="label text-muted">
                {p.index} / {p.kind}
              </p>
              <h2 className="display display-lg mt-5">{p.name}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                <Tag tone="solid">{p.price}</Tag>
                <Tag tone="signal">{p.status}</Tag>
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="lede text-ink-soft">{p.summary}</p>

              <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line">
                {p.facts.map((f) => (
                  <div key={f.label} className="bg-paper p-4">
                    <dt className="label text-muted">{f.label}</dt>
                    <dd className="mt-1.5 text-[0.95rem] font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="label mt-10 text-muted">By the end you will</h3>
              <ul className="mt-4 space-y-2.5">
                {p.youWill.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href={p.cta.href} size="lg">
                  {p.cta.label}
                </ButtonLink>
                {p.secondaryCta && (
                  <ButtonLink href={p.secondaryCta.href} size="lg" variant="outline">
                    {p.secondaryCta.label}
                  </ButtonLink>
                )}
                <Link href={`/programs/${p.slug}`} className="label link">
                  Full details →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="wrap grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Eyebrow className="text-muted">In development</Eyebrow>
          <h2 className="display display-md mt-5">Future learning programmes.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            These are planned and not yet scheduled. Join the newsletter to hear when they open.
          </p>
        </div>
        <ul className="border-t border-ink md:col-span-7">
          {futurePrograms.map((f) => (
            <li key={f.name} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <div>
                <h3 className="text-lg font-medium tracking-tight">{f.name}</h3>
                <p className="label mt-1.5 text-muted">Planned</p>
              </div>
              <p className="text-ink-soft">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-ink">
        <div className="wrap grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <Eyebrow className="text-muted-dark">One-on-one consultations</Eyebrow>
            <h2 className="display display-md mt-5">Need advice on your own situation?</h2>
            <p className="mt-5 max-w-xl text-paper/80">
              Paid individual consultations are available for founders who want personalised guidance on
              an idea, a product build, or a launch. Tell us what you need and we will reply with
              availability and the fee.
            </p>
          </div>
          <div className="flex items-end md:col-span-5 md:justify-end">
            <ButtonLink href="/contact#consultation" size="lg" variant="signal">
              Request a consultation
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
