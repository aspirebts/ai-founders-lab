import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Tag } from "@/components/ui/bits";
import { getProgram, programs } from "@/lib/content/programs";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  return program ? { title: program.name, description: program.summary } : {};
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const p = getProgram(slug);
  if (!p) notFound();

  return (
    <>
      <header className="on-ink">
        <div className="wrap pt-14 pb-16 md:pt-24 md:pb-20">
          <p className="label text-muted-dark">
            <Link href="/programs" className="link">
              Programs
            </Link>{" "}
            / {p.index} / {p.kind}
          </p>
          <h1 className="display display-xl mt-8">{p.name}</h1>
          <p className="lede mt-8 max-w-2xl text-paper/85">{p.summary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href={p.cta.href} size="lg" variant="signal">
              {p.cta.label}
            </ButtonLink>
            {p.secondaryCta && (
              <ButtonLink
                href={p.secondaryCta.href}
                size="lg"
                variant="outline"
                className="hover:!border-paper hover:!bg-paper hover:!text-ink"
              >
                {p.secondaryCta.label}
              </ButtonLink>
            )}
          </div>
        </div>
        <dl className="wrap grid grid-cols-2 border-t border-line-dark md:grid-cols-4">
          {p.facts.map((f) => (
            <div key={f.label} className="border-b border-line-dark py-5 pr-4 md:border-b-0">
              <dt className="label text-muted-dark">{f.label}</dt>
              <dd className="mt-1.5 font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <Eyebrow index="01" className="text-muted">
            Overview
          </Eyebrow>
          <div className="mt-6 flex flex-wrap gap-2">
            <Tag tone="solid">{p.price}</Tag>
            <Tag tone="signal">{p.status}</Tag>
          </div>
        </div>
        <div className="space-y-6 text-lg text-ink-soft md:col-span-7">
          {p.description.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bone">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <Eyebrow index="02" className="text-muted">
              Structure
            </Eyebrow>
            <h2 className="display display-md mt-6">How the programme runs.</h2>
          </div>
          <ol className="border-t border-ink md:col-span-8">
            {p.structure.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ink/20 py-6 sm:grid-cols-[3rem_12rem_1fr]">
                <span className="label pt-2 text-signal-deep">0{i + 1}</span>
                <h3 className="display display-sm">{s.title}</h3>
                <p className="col-start-2 mt-2 text-ink-soft sm:col-start-3 sm:mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <Eyebrow index="03" className="text-muted">
            Outcomes
          </Eyebrow>
          <h2 className="display display-sm mt-6">By the end you will</h2>
          <ul className="mt-6 space-y-3 border-t border-ink pt-6">
            {p.youWill.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-signal" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Eyebrow index="04" className="text-muted">
            Who it is for
          </Eyebrow>
          <h2 className="display display-sm mt-6">This programme suits</h2>
          <ul className="mt-6 space-y-3 border-t border-ink pt-6">
            {p.forWho.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-ink" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="label text-muted-dark">
              {p.price} · {p.status}
            </p>
            <h2 className="display display-md mt-4">Ready to start?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={p.cta.href} size="lg" variant="signal">
              {p.cta.label}
            </ButtonLink>
            <ButtonLink href="/programs" size="lg" variant="outline" className="hover:!border-paper hover:!bg-paper hover:!text-ink">
              All programmes
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
