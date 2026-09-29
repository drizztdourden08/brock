/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../host/require-host-api';
import { createStepTour } from './create-step-tour';
import { settle } from './dom/settle';
import { REVIEW_STEPS } from './run-review.constants';
import type { ReviewEnv } from './review.type';
import { resetUi } from './steps/reset-ui';

const runReview = async (env: ReviewEnv): Promise<void> => {
  await settle();
  for (const step of REVIEW_STEPS) {
    const tour = createStepTour(env, step.name);
    try {
      await step.run(tour);
    } catch (err) {
      tour.check('step-ran', false, '', `the step threw: ${err instanceof Error ? err.message : String(err)}`);
    }
    await resetUi();
  }
  requireHostApi().reviewFinish();
};

export { runReview };
