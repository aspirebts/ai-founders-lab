import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SampleTag, Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { CompanyOfOneFigure, JourneyPlot } from "@/components/site/figures";
import { EventList } from "@/components/site/event-list";
import { ClosingCta } from "@/components/site/cta";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { audiences, journey, sampleShowcase, stageLabel } from "@/lib/content/site";
import { programs } from "@/lib/content/programs";
import { getUpcomingEvents } from "@/lib/data/public";

const shifts = [
  {
    was: "A team of specialists",
    now: "One founder, with AI",
    body: "Research, design, engineering, marketing and support used to mean hiring. AI now lets one capable person cover that ground.",
  },
  {
    was: "Outside capital",
    now: "A handful of subscriptions",
    body: "A first version no longer needs funding. The tools are priced like subscriptions, not salaries.",
  },
  {
    was: "Months before launch",
    now: "Days to a first version",
    body: "When building is fast, you can test an idea with real customers before committing your savings or your career to it.",
  },
];

const pillars = [
  {
    index: "A",
    name: "A school",
    body: "Practical AI entrepreneurship, taught by doing. You learn the tools and the business thinking together, on your own idea.",
    href: "/programs",
    link: "See the programmes",
  },
  {
    index: "B",
    name: "An incubator",
    body: "Structured cohorts that take you from idea to launched product, with milestones, feedback and accountability at every stage.",
    href: "/how-it-works",
    link: "See how it works",
  },
  {
    index: "C",
    name: "A community",
    body: "Founders at every stage, building in the open. Share progress, trade knowledge, find collaborators, and keep each other going.",
    href: "/community",
    link: "See the community",
  },
];

const communityBenefits = [
  ["Feedback that helps", "Show your work to people who are building too, and get honest, specific responses."],
  ["Shared knowledge", "What works with which AI tool changes monthly. Members compare notes so nobody learns alone."],
  ["Collaborators", "Find the designer, the domain expert or the first customer you need among fellow members."],
  ["Momentum", "Building alone is hard to sustain. A group that expects to see your progress makes it easier."],
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="on-ink relative overflow-hidden">
        <div className="wrap grid gap-12 pt-14 pb-16 md:pt-20 md:pb-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow className="text-muted-dark">Online school · Startup incubator · Founder community</Eyebrow>
            <h1 className="display display-xl mt-8">
              Build a company <em className="text-signal">of one.</em>
            </h1>
            <p className="lede mt-9 max-w-xl text-paper/85">
              AI Founders Lab is where people learn to turn an idea into a profitable one-person business,
              with AI doing the work a team used to do.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/apply" size="lg" variant="signal">
                Apply to the founder cohort
              </ButtonLink>
              <ButtonLink href="/waitlist" size="lg" variant="outline" className="hover:!border-paper hover:!bg-paper hover:!text-ink">
                Join the waitlist
              </ButtonLink>
            </div>
            <ul className="label mt-10 flex flex-wrap gap-x-6 gap-y-2 text-muted-dark">
              <li>Free to join</li>
              <li>No coding required</li>
              <li>Open worldwide</li>
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none lg:pt-4">
            <CompanyOfOneFigure />
          </div>
        </div>

        <div className="border-t border-line-dark">
          <div className="wrap label flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4 text-muted-dark">
            <span>
              <span className="mr-2 inline-block size-1.5 rounded-full bg-signal align-middle" aria-hidden="true" />
              Founder cohort: applications open
            </span>
            <span>Start date to be announced</span>
            <Link href="/programs" className="link text-paper">
              View programmes →
            </Link>
          </div>
        </div>
      </section>

      {/* The opportunity */}
      <section className="wrap py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="01" className="text-muted">
              The opportunity
            </Eyebrow>
          </div>
          <div className="md:col-span-8">
            <h2 className="display display-lg">
              The smallest viable company is now <em>one person.</em>
            </h2>
            <p className="lede mt-8 max-w-2xl text-ink-soft">
              For most of history, starting a business meant assembling people and money first. AI has
              changed what one person can build, run and sell on their own. That is a new kind of
              economic opportunity, and it is open to far more people than startups have ever been.
            </p>
          </div>
        </div>

        <div className="mt-16 grid border-t border-ink md:grid-cols-3">
          {shifts.map((s, i) => (
            <Reveal key={s.now} delay={i * 90} className="border-b border-line py-8 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="label text-muted">
                Then: <span className="line-through decoration-signal decoration-1">{s.was}</span>
              </p>
              <p className="display display-sm mt-4">{s.now}</p>
              <p className="mt-4 text-ink-soft">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What it is */}
      <section className="border-y border-line bg-bone">
        <div className="wrap py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow index="02" className="text-muted">
                What the Lab is
              </Eyebrow>
            </div>
            <div className="md:col-span-8">
              <h2 className="display display-md max-w-[22ch]">
                Three things most founders have to find separately, in one place.
              </h2>
            </div>
          </div>

          <ul className="mt-14 border-t border-ink">
            {pillars.map((p, i) => (
              <li key={p.name} className="border-b border-ink/20">
                <Reveal delay={i * 60} className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-6">
                  <p className="label text-signal-deep md:col-span-1">{p.index}</p>
                  <h3 className="display display-md md:col-span-4">{p.name}</h3>
                  <p className="text-ink-soft md:col-span-5">{p.body}</p>
                  <p className="md:col-span-2 md:text-right">
                    <Link href={p.href} className="label link">
                      {p.link} →
                    </Link>
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journey */}
      <section className="wrap py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="03" className="text-muted">
              The founder journey
            </Eyebrow>
          </div>
          <div className="md:col-span-8">
            <h2 className="display display-lg">
              Five stages, from <em>a hunch</em> to a business.
            </h2>
            <p className="lede mt-8 max-w-2xl text-ink-soft">
              Every programme follows the same path. Each stage ends with something concrete, so you
              always know where you are and what comes next.
            </p>
          </div>
        </div>

        <JourneyPlot className="mt-14 hidden md:block" />

        <ol className="mt-10 grid border-t border-ink md:mt-2 md:grid-cols-5 md:border-t-0">
          {journey.map((s, i) => (
            <li key={s.id} className="border-b border-line py-6 md:border-b-0 md:px-4 md:py-0 md:text-center">
              <Reveal delay={i * 80}>
                <p className="label text-signal-deep">{s.index}</p>
                <h3 className="display display-sm mt-2">{s.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.line}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-12 md:text-center">
          <ButtonLink href="/how-it-works" variant="outline">
            How each stage works
          </ButtonLink>
        </div>
      </section>

      {/* Programmes */}
      <section className="on-ink">
        <div className="wrap py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="04" className="text-muted-dark">
                Programmes
              </Eyebrow>
              <h2 className="display display-lg mt-6">Two ways in.</h2>
            </div>
            <p className="max-w-sm text-muted-dark">
              Both are free for the first intakes. Dates will be announced to applicants and the waitlist
              first.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-line-dark lg:grid-cols-2">
            {programs.map((p) => (
              <article key={p.slug} className="flex flex-col bg-ink py-10 lg:p-10 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center justify-between">
                  <p className="label text-muted-dark">
                    {p.index} / {p.kind}
                  </p>
                  <div className="flex gap-2">
                    <Tag tone="default">{p.price}</Tag>
                    <span className="label inline-flex items-center border border-signal px-2 py-1 leading-none text-signal">
                      {p.status}
                    </span>
                  </div>
                </div>
                <h3 className="display display-md mt-8">{p.name}</h3>
                <p className="mt-4 max-w-md text-paper/80">{p.summary}</p>
                <ul className="mt-8 space-y-2 border-t border-line-dark pt-6 text-sm text-paper/80">
                  {p.youWill.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-5 pt-2 lg:mt-auto lg:pt-10">
                  <ButtonLink href={p.cta.href} variant="signal">
                    {p.cta.label}
                  </ButtonLink>
                  <Link href={`/programs/${p.slug}`} className="link label">
                    Programme details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="wrap py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow index="05" className="text-muted">
              Who it is for
            </Eyebrow>
            <h2 className="display display-md mt-6">
              You do not need to be a programmer. Or to have done this before.
            </h2>
            <p className="mt-6 max-w-md text-ink-soft">
              The Lab is built for people starting from different places. What matters is that you want
              to build something of your own and are willing to do the work.
            </p>
          </div>
          <ul className="border-t border-ink md:col-span-6 md:col-start-7">
            {audiences.map((a, i) => (
              <li key={a.name} className="border-b border-line">
                <Reveal delay={i * 50} className="grid grid-cols-[2.5rem_1fr] gap-x-2 py-5">
                  <span className="label pt-1.5 text-muted">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">{a.name}</h3>
                    <p className="mt-1 text-ink-soft">{a.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Community */}
      <section className="border-y border-line bg-bone">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <Eyebrow index="06" className="text-muted">
              Community
            </Eyebrow>
            <h2 className="display display-md mt-6">
              A company of one. <em>Not a founder alone.</em>
            </h2>
            <p className="mt-6 max-w-md text-ink-soft">
              You run your own business. You do not have to work it all out by yourself. The community is
              where members share what they are building and help each other move faster.
            </p>
            <div className="mt-8">
              <ButtonLink href="/community" variant="outline">
                About the community
              </ButtonLink>
            </div>
          </div>
          <dl className="grid gap-px self-start bg-ink/20 sm:grid-cols-2 md:col-span-7">
            {communityBenefits.map(([title, body]) => (
              <div key={title} className="bg-bone p-6">
                <dt className="font-medium tracking-tight">{title}</dt>
                <dd className="mt-2 text-sm text-ink-soft">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Events */}
      <section className="wrap py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="07" className="text-muted">
              Upcoming events
            </Eyebrow>
            <h2 className="display display-md mt-6">Workshops, masterclasses and founder sessions.</h2>
          </div>
          <ButtonLink href="/events" variant="ghost" arrow>
            All events
          </ButtonLink>
        </div>
        <div className="mt-12">
          <UpcomingEvents />
        </div>
      </section>

      {/* Showcase (sample) */}
      <section className="border-t border-line">
        <div className="wrap py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow index="08" className="text-muted">
                Startup showcase
              </Eyebrow>
              <h2 className="display display-md mt-6">The kind of businesses the Lab is built to produce.</h2>
            </div>
            <div className="md:col-span-5 md:pt-12">
              <div className="border border-dashed border-ink/50 p-4 text-sm text-ink-soft">
                <SampleTag>Sample content</SampleTag>
                <p className="mt-3">
                  These are illustrative examples, not real companies or members. Real founder stories
                  will appear here once the first cohort has launched.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {sampleShowcase.map((s, i) => (
              <Reveal key={s.name} delay={i * 80} className="flex flex-col bg-paper py-8 md:p-8 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center justify-between">
                  <p className="label text-muted">{s.category}</p>
                  <SampleTag>Example</SampleTag>
                </div>
                <h3 className="display display-sm mt-6">{s.name}</h3>
                <p className="mt-3 flex-1 text-ink-soft">{s.summary}</p>
                <p className="label mt-8 flex justify-between border-t border-line pt-4 text-muted">
                  <span>{s.founder}</span>
                  <span>Stage: {stageLabel[s.stage]}</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="on-ink">
        <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <Eyebrow index="09" className="text-muted-dark">
              Newsletter
            </Eyebrow>
            <h2 className="display display-md mt-6">
              The Lab Notes: what is working for one-person AI businesses.
            </h2>
          </div>
          <div className="flex flex-col justify-end md:col-span-5 md:col-start-8">
            <p className="text-muted-dark">
              Practical ideas, tools and programme announcements. No noise, and you can unsubscribe at any
              time.
            </p>
            <div className="mt-6">
              <NewsletterForm source="home" inverted />
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}

async function UpcomingEvents() {
  const events = await getUpcomingEvents(3);
  if (events.length === 0) {
    return (
      <p className="border-t border-ink pt-6 text-ink-soft">
        New events are being scheduled. Subscribe to the newsletter to hear about them first.
      </p>
    );
  }
  return <EventList events={events} />;
}
