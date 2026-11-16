import type { Metadata } from "next";
import { Mark, Wordmark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, PageHeader, SampleTag, Tag } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Brand",
  description: "The AI Founders Lab visual identity: logo, colour, typography and design system.",
};

const colours = [
  { name: "Ink", hex: "#11110F", role: "Text, dark sections, primary buttons", cls: "bg-ink text-paper" },
  { name: "Paper", hex: "#F3EFE6", role: "Default background", cls: "bg-paper text-ink border border-line" },
  { name: "Bone", hex: "#E9E4D8", role: "Alternate section background", cls: "bg-bone text-ink" },
  { name: "Signal", hex: "#E8421A", role: "The one accent. Used sparingly", cls: "bg-signal text-ink" },
  { name: "Signal Deep", hex: "#B3300D", role: "Accent for small text on paper", cls: "bg-signal-deep text-paper" },
  { name: "Muted", hex: "#66635A", role: "Secondary text and labels", cls: "bg-muted text-paper" },
];

const principles = [
  ["Ink on paper", "A warm, print-like base instead of the white or black of most technology sites. It reads as considered and permanent."],
  ["One signal", "A single vermilion accent marks what matters: the founder, the next action, the current stage. Never decoration."],
  ["Numbered and ruled", "Hairline rules, section indices and mono labels borrow from lab notebooks and field manuals: this is a place where work is done."],
  ["Diagrams, not illustrations", "Ideas are drawn as figures with captions. No robots, no glowing brains, no stock photography."],
  ["Sharp corners", "Square edges and visible structure. Nothing is softened to look friendly; clarity is the friendliness."],
  ["Motion with a reason", "Lines draw, content settles into place. Movement explains structure and then stops."],
];

export default function BrandPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brand"
        title={
          <>
            Visual <em>identity.</em>
          </>
        }
        lede="A proposed identity for AI Founders Lab: serious, editorial and built around one idea. One person, at the centre, with the tools to build a company."
      />

      {/* Logo */}
      <section className="wrap grid gap-10 border-b border-line py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <Eyebrow index="01" className="text-muted">
            Logo
          </Eyebrow>
          <h2 className="display display-md mt-6">Apex and Dot.</h2>
          <p className="mt-5 text-ink-soft">
            Two strokes meet to form an A: the Lab, its tools and its structure. Beneath the apex sits a
            single dot: the founder. One person, sheltered and amplified by what surrounds them.
          </p>
          <p className="mt-4 text-ink-soft">
            The wordmark pairs a confident grotesque for &ldquo;AI Founders&rdquo; with an italic serif
            &ldquo;Lab&rdquo;: the technical and the human, side by side.
          </p>
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-2 md:col-span-8">
          <div className="flex aspect-[4/3] items-center justify-center bg-paper">
            <div className="flex items-center gap-4">
              <Mark size={64} />
              <Wordmark className="!text-3xl [&>span:last-child]:!text-4xl" />
            </div>
          </div>
          <div
            className="on-ink flex aspect-[4/3] items-center justify-center"
            style={{ "--mark-bg": "#f3efe6", "--mark-fg": "#11110f" } as React.CSSProperties}
          >
            <div className="flex items-center gap-4">
              <Mark size={64} />
              <Wordmark className="!text-3xl [&>span:last-child]:!text-4xl" />
            </div>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center bg-bone">
            <Mark size={140} />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center gap-8 bg-signal">
            <Mark size={72} />
            <Mark size={40} />
            <Mark size={24} />
            <Mark size={16} />
          </div>
        </div>
      </section>

      {/* Colour */}
      <section className="wrap grid gap-10 border-b border-line py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <Eyebrow index="02" className="text-muted">
            Colour
          </Eyebrow>
          <h2 className="display display-md mt-6">Ink, paper, and one signal.</h2>
          <p className="mt-5 text-ink-soft">
            A restrained palette. Signal is the only chromatic colour; if it appears more than a few
            times on a screen, it is being overused.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:col-span-8 lg:grid-cols-3">
          {colours.map((c) => (
            <li key={c.name}>
              <div className={`flex aspect-[5/3] items-end p-4 ${c.cls}`}>
                <span className="label">{c.hex}</span>
              </div>
              <p className="mt-3 font-medium">{c.name}</p>
              <p className="text-sm text-muted">{c.role}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Typography */}
      <section className="wrap grid gap-10 border-b border-line py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <Eyebrow index="03" className="text-muted">
            Typography
          </Eyebrow>
          <h2 className="display display-md mt-6">Three voices.</h2>
          <p className="mt-5 text-ink-soft">
            A serif for ideas, a grotesque for explanation, a monospace for facts. All three are open
            source and self-hosted.
          </p>
        </div>
        <div className="md:col-span-8">
          <div className="border-t border-ink py-8">
            <p className="label text-muted">Display · Fraunces · Headlines and statements</p>
            <p className="display display-lg mt-4">
              Build a company <em>of one.</em>
            </p>
          </div>
          <div className="border-t border-line py-8">
            <p className="label text-muted">Text · Geist Sans · Body copy and interface</p>
            <p className="lede mt-4 max-w-xl">
              AI has changed what one person can build, run and sell on their own. We teach people how to
              use that.
            </p>
          </div>
          <div className="border-t border-line py-8">
            <p className="label text-muted">Label · Geist Mono · Indices, metadata and status</p>
            <p className="label mt-4 text-base">03 / Build · Applications open · Fig. 1</p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="wrap grid gap-10 border-b border-line py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <Eyebrow index="04" className="text-muted">
            Components
          </Eyebrow>
          <h2 className="display display-md mt-6">The working parts.</h2>
        </div>
        <div className="space-y-10 md:col-span-8">
          <div>
            <p className="label mb-4 text-muted">Buttons</p>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/apply">Primary</ButtonLink>
              <ButtonLink href="/apply" variant="signal">
                Signal
              </ButtonLink>
              <ButtonLink href="/apply" variant="outline">
                Outline
              </ButtonLink>
              <ButtonLink href="/apply" variant="ghost">
                Text link
              </ButtonLink>
            </div>
          </div>
          <div>
            <p className="label mb-4 text-muted">Tags</p>
            <div className="flex flex-wrap items-center gap-3">
              <Tag>Workshop</Tag>
              <Tag tone="solid">Free</Tag>
              <Tag tone="signal">Applications open</Tag>
              <SampleTag />
            </div>
          </div>
          <div>
            <p className="label mb-4 text-muted">Section label</p>
            <Eyebrow index="05">The founder journey</Eyebrow>
          </div>
          <div>
            <p className="label mb-4 text-muted">Figure frame</p>
            <div className="ticks max-w-sm bg-bone p-6">
              <p className="label text-muted">Milestone</p>
              <p className="mt-2 font-medium">One idea with evidence that people will pay for it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="wrap py-16 md:py-24">
        <Eyebrow index="05" className="text-muted">
          Visual language
        </Eyebrow>
        <dl className="mt-10 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body]) => (
            <div key={title} className="border-b border-line py-7 sm:pr-8">
              <dt className="display display-sm">{title}</dt>
              <dd className="mt-3 text-ink-soft">{body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
