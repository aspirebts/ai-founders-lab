import type { Metadata } from "next";
import { Eyebrow, PageHeader } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { ClosingCta } from "@/components/site/cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "The mission, vision and philosophy of AI Founders Lab: helping people build profitable one-person businesses powered by AI.",
};

const beliefs = [
  {
    title: "The barrier has moved.",
    body: "Starting a company used to be limited by access to people and capital. Today the limit is knowing what to build and how to use the tools. That can be taught.",
  },
  {
    title: "Small is a strategy.",
    body: "A one-person business is not a startup that failed to grow. It is a deliberate choice: low costs, full ownership, and the freedom to serve a niche well.",
  },
  {
    title: "Practice beats theory.",
    body: "Nobody learns to build a business from slides. Everything we teach is applied immediately, to your own idea, with real customers as the judge.",
  },
  {
    title: "Profit is the point.",
    body: "We measure progress in customers and revenue, not followers or funding. A business that pays its owner is the goal.",
  },
  {
    title: "Nobody builds alone.",
    body: "Independence does not mean isolation. Founders make better decisions, and keep going longer, in the company of other founders.",
  },
  {
    title: "Open to everyone.",
    body: "Talent is evenly distributed; access is not. The Lab is online, global, and designed for people without technical or startup backgrounds.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            A place to build an <em>independent</em> economic future.
          </>
        }
        lede="AI Founders Lab is an online school and startup incubator for people who want to build new products and companies using artificial intelligence."
      />

      <section className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <Eyebrow index="01" className="text-muted">
            Mission
          </Eyebrow>
        </div>
        <div className="md:col-span-8">
          <p className="display display-md">
            Help people build profitable one-person businesses powered by AI.
          </p>
          <div className="mt-10 grid gap-8 text-ink-soft sm:grid-cols-2">
            <p>
              We provide the tools, knowledge, resources, practical training and community that people
              need to turn an idea into a real business. Not a side project that stalls, and not a pitch
              deck: a product that customers pay for.
            </p>
            <p>
              The Lab combines three things that usually live apart: a school where you learn practical
              AI entrepreneurship, an incubator where you develop and launch a business, and a community
              of founders doing the same.
            </p>
          </div>
        </div>
      </section>

      <section className="on-ink">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <Eyebrow index="02" className="text-muted-dark">
              Vision
            </Eyebrow>
          </div>
          <div className="md:col-span-8">
            <p className="display display-lg">
              A world where anyone with a good idea and the will to work can <em className="text-signal">own</em> what they
              build.
            </p>
            <p className="lede mt-10 max-w-2xl text-paper/80">
              We think the next generation of valuable companies will include many that are run by one
              person. We want those founders to come from everywhere: every country, every profession,
              every starting point.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow index="03" className="text-muted">
              Philosophy
            </Eyebrow>
          </div>
          <div className="md:col-span-8">
            <h2 className="display display-md max-w-[20ch]">Six things we believe about building with AI.</h2>
          </div>
        </div>
        <ol className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((b, i) => (
            <li key={b.title} className="border-b border-line py-8 sm:px-6 sm:odd:pl-0 lg:border-r lg:px-8 lg:odd:pl-8 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:pr-0 lg:[&:nth-child(3n+1)]:pl-0">
              <Reveal delay={(i % 3) * 70}>
                <p className="label text-signal-deep">0{i + 1}</p>
                <h3 className="display display-sm mt-4">{b.title}</h3>
                <p className="mt-3 text-ink-soft">{b.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-bone">
        <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <Eyebrow index="04" className="text-muted">
              Why now
            </Eyebrow>
          </div>
          <div className="space-y-6 text-lg text-ink-soft md:col-span-7">
            <p>
              AI has dramatically lowered the barriers to starting and running a business. People no
              longer need large teams or substantial technical resources to build valuable products.
            </p>
            <p>
              But tools alone do not make a business. Knowing which problem to solve, how to test it, how
              to reach customers and how to charge are still learned skills. Most people have never had
              anywhere to learn them.
            </p>
            <p className="text-ink">AI Founders Lab exists to be that place.</p>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
