/* @layer renderer-shell @kind test */
import type { ReviewEnv, ReviewOutcome, StepTour } from '../src/review/review.type';

const failed = (outcomes: readonly ReviewOutcome[]): string[] => outcomes.filter((o) => !o.pass).map((o) => o.id);
const reasonOf = (outcomes: readonly ReviewOutcome[], id: string): string | undefined => outcomes.find((o) => o.id === id)?.reason;

const recordingTour = (env: Partial<ReviewEnv> = {}) => {
  const checks: ReviewOutcome[] = [];
  const captures: string[] = [];
  const tour: StepTour = {
    env: env as ReviewEnv,
    report: (outcomes) => { checks.push(...outcomes); },
    check: (id, pass, passReason, failReason) => { checks.push({ id, pass, reason: pass ? passReason : failReason }); },
    capture: (name) => { captures.push(name); return Promise.resolve(); },
  };
  return { tour, checks, captures };
};

export { failed, reasonOf, recordingTour };
