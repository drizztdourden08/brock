/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../host/require-host-api';
import { outcome } from './checks/outcome';
import { settle } from './dom/settle';
import type { ReviewEnv, ReviewOutcome, StepTour } from './review.type';

const createStepTour = (env: ReviewEnv, step: string): StepTour => {
  const api = requireHostApi();
  const report = (outcomes: readonly ReviewOutcome[]): void => {
    for (const { id, pass, reason } of outcomes) api.reviewCheck({ id, step, pass, reason });
  };
  return {
    env,
    report,
    check: (id, pass, passReason, failReason) => report([outcome(id, pass, passReason, failReason)]),
    capture: async (name) => {
      await settle();
      await api.reviewCapture(name);
    },
  };
};

export { createStepTour };
