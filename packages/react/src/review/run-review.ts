/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../host/require-host-api';
import { createStepTour } from './create-step-tour';
import { settle } from './dom/settle';
import { appSteps } from './app/app-steps';
import { seedSteps } from './app/seed-steps';
import { BUILT_IN_STEP_NAMES, STEPS_AFTER_SEED, STEPS_BEFORE_SEED } from './run-review.constants';
import type { ReviewEnv } from './review.type';
import { resetUi } from './steps/reset-ui';

const runReview = async (env: ReviewEnv): Promise<void> => {
  await settle();
  const steps = [...STEPS_BEFORE_SEED, ...seedSteps(env.review), ...STEPS_AFTER_SEED, ...appSteps(env.review, BUILT_IN_STEP_NAMES)];
  for (const step of steps) {
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
