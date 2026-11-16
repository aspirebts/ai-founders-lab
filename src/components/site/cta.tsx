import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/bits";

/** Closing call to action used at the foot of most public pages. */
export function ClosingCta({
  title = (
    <>
      Your company can start <em>with you.</em>
    </>
  ),
  body = "Apply to the founder cohort, or join the waitlist and we will tell you when dates are announced. Both are free.",
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="border-t border-line bg-bone">
      <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-8">
          <Eyebrow className="text-muted">Start here</Eyebrow>
          <h2 className="display display-lg mt-6">{title}</h2>
        </div>
        <div className="flex flex-col justify-end md:col-span-4">
          <p className="text-ink-soft">{body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/apply" size="lg">
              Apply now
            </ButtonLink>
            <ButtonLink href="/waitlist" size="lg" variant="outline">
              Join the waitlist
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
