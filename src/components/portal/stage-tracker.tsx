import { updateJourneyStage } from "@/lib/actions/member";
import { journey } from "@/lib/content/site";
import type { JourneyStage } from "@/lib/types";

/** The five stages as a row of buttons. Members set their own current stage. */
export function StageTracker({ current }: { current: JourneyStage }) {
  const currentIndex = journey.findIndex((s) => s.id === current);
  const stage = journey[currentIndex];

  return (
    <div>
      <form action={updateJourneyStage}>
        <ol className="grid grid-cols-5 gap-px bg-line">
          {journey.map((s, i) => {
            const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
            return (
              <li key={s.id}>
                <button
                  type="submit"
                  name="journey_stage"
                  value={s.id}
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`Set your stage to ${s.name}${state === "current" ? " (current)" : ""}`}
                  className={`flex h-full w-full flex-col items-start gap-1 p-3 text-left transition-colors sm:p-4 ${
                    state === "current"
                      ? "bg-ink text-paper"
                      : state === "done"
                        ? "bg-bone hover:bg-ink/10"
                        : "bg-paper hover:bg-bone"
                  }`}
                >
                  <span className={`label ${state === "current" ? "text-signal" : "text-muted"}`}>
                    {state === "done" ? "✓" : s.index}
                  </span>
                  <span className="text-sm font-medium sm:text-base">{s.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </form>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <p className="text-ink-soft">{stage.body}</p>
        <div>
          <p className="label text-muted">Milestone for this stage</p>
          <p className="mt-1.5 font-medium">{stage.outcome}</p>
          <p className="mt-3 text-sm text-muted">Select a stage above to update where you are.</p>
        </div>
      </div>
    </div>
  );
}
