import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, PageHeader } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The AI Founders Lab community: founders connecting, collaborating, sharing projects and supporting each other's progress.",
};

const benefits = [
  {
    title: "Connect",
    body: "Meet founders at every stage, from every background and time zone. The member directory shows who is building what, and what they know.",
  },
  {
    title: "Collaborate",
    body: "Find the complementary skill you are missing: a domain expert, a builder, a first customer.",
  },
  {
    title: "Exchange knowledge",
    body: "AI tools change quickly. Members share what is working right now, so you spend your time building rather than evaluating.",
  },
  {
    title: "Share projects",
    body: "Publish what you are building to the member showcase. Get feedback early, when it is cheapest to act on.",
  },
  {
    title: "Stay accountable",
    body: "Progress is visible. When other people expect to see your next milestone, it is easier to keep going until you reach it.",
  },
  {
    title: "Learn together",
    body: "Community events, founder sessions and demo nights bring members together around real work in progress.",
  },
];

const inPortal = [
  ["Member directory", "Opt in to be listed, and browse other members by stage, skills and interests."],
  ["Project showcase", "Share your startup with other members and see what they are building."],
  ["Events", "Register for community sessions and keep track of what you have signed up for."],
  ["Founder progress", "Mark your stage on the journey so others know where you are and how to help."],
];

const norms = [
  "Be generous with what you know.",
  "Give specific, honest feedback.",
  "Show unfinished work.",
  "Respect confidentiality: what members share stays with members.",
];

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={
          <>
            A company of one. <em>Among many.</em>
          </>
        }
        lede="Running a one-person business does not mean working it out alone. The founder community is where members connect, collaborate, share what they are building and help each other move faster."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/register" size="lg">
            Create a free account
          </ButtonLink>
          <ButtonLink href="/login" size="lg" variant="outline">
            Member sign in
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="wrap py-20 md:py-28">
        <Eyebrow index="01" className="text-muted">
          What members get
        </Eyebrow>
        <ul className="mt-10 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <li key={b.title} className="border-b border-line py-8 sm:pr-8">
              <Reveal delay={(i % 3) * 70}>
                <p className="label text-signal-deep">0{i + 1}</p>
                <h2 className="display display-sm mt-4">{b.title}</h2>
                <p className="mt-3 text-ink-soft">{b.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="on-ink">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <Eyebrow index="02" className="text-muted-dark">
              Inside the member portal
            </Eyebrow>
            <h2 className="display display-md mt-6">Where the community lives today.</h2>
            <p className="mt-6 max-w-md text-paper/75">
              Membership is free. Create an account, set up your profile, and you are in. More community
              features will be added as the Lab grows.
            </p>
          </div>
          <dl className="border-t border-line-dark md:col-span-6 md:col-start-7">
            {inPortal.map(([title, body]) => (
              <div key={title} className="border-b border-line-dark py-5">
                <dt className="font-medium">{title}</dt>
                <dd className="mt-1 text-paper/70">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <Eyebrow index="03" className="text-muted">
            How we work together
          </Eyebrow>
          <h2 className="display display-md mt-6">Four community norms.</h2>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {norms.map((n, i) => (
            <li key={n} className="flex items-baseline gap-5 border-b border-line py-5 first:border-t first:border-t-ink">
              <span className="label text-muted">0{i + 1}</span>
              <span className="display display-sm">{n}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-bone">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <h2 className="display display-md max-w-[18ch]">Join the founders building alongside you.</h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register" size="lg">
              Create a free account
            </ButtonLink>
            <ButtonLink href="/events" size="lg" variant="outline">
              See community events
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
