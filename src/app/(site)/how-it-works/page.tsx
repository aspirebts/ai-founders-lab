import type { Metadata } from "next";
import { Eyebrow, PageHeader } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { JourneyPlot } from "@/components/site/figures";
import { ClosingCta } from "@/components/site/cta";
import { journey } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The AI Founders Lab founder journey in five stages: Discover, Validate, Build, Launch and Grow.",
};

const principles = [
  ["One stage at a time", "Each stage has a single milestone. You do not move on until it is reached, so effort is never wasted on the wrong step."],
  ["Evidence before effort", "You validate before you build, and sell before you scale. Customers decide what is worth doing next."],
  ["AI as your team", "At every stage you learn which AI tools to use and how, so the work one person can do keeps expanding."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={
          <>
            The founder journey, in <em>five stages.</em>
          </>
        }
        lede="Whatever your starting point, the path is the same. You can enter at the stage that matches where you are today."
      >
        <nav aria-label="Stages">
          <ol className="label flex flex-wrap gap-x-6 gap-y-2">
            {journey.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link">
                  <span className="text-signal-deep">{s.index}</span> {s.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>

      <div className="wrap hidden pt-12 md:block">
        <JourneyPlot />
        <div className="label grid grid-cols-5 text-center text-muted">
          {journey.map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      </div>

      <section className="wrap pb-10">
        {journey.map((s) => (
          <article key={s.id} id={s.id} className="grid scroll-mt-20 gap-8 border-b border-line py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-5">
              <p aria-hidden="true" className="display text-[clamp(5rem,12vw,10rem)] leading-[0.8] text-ink/10">
                {s.index}
              </p>
              <h2 className="display display-lg -mt-6 md:-mt-10">{s.name}</h2>
              <p className="label mt-4 text-signal-deep">{s.line}</p>
            </div>
            <Reveal className="md:col-span-6 md:col-start-7">
              <p className="lede text-ink-soft">{s.body}</p>
              <h3 className="label mt-10 text-muted">What you do</h3>
              <ul className="mt-4 border-t border-ink">
                {s.activities.map((a, i) => (
                  <li key={a} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-3.5">
                    <span className="label pt-1 text-muted">
                      {s.index}.{i + 1}
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <div className="ticks mt-8 bg-bone p-5">
                <p className="label text-muted">Milestone</p>
                <p className="mt-2 font-medium">{s.outcome}</p>
              </div>
            </Reveal>
          </article>
        ))}
      </section>

      <section className="on-ink">
        <div className="wrap py-20 md:py-28">
          <Eyebrow className="text-muted-dark">How we teach</Eyebrow>
          <h2 className="display display-md mt-6 max-w-[20ch]">Three principles behind every stage.</h2>
          <dl className="mt-12 grid gap-px bg-line-dark md:grid-cols-3">
            {principles.map(([title, body]) => (
              <div key={title} className="bg-ink py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <dt className="display display-sm">{title}</dt>
                <dd className="mt-3 text-paper/75">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Start at stage one. Or wherever <em>you are.</em>
          </>
        }
      />
    </>
  );
}
