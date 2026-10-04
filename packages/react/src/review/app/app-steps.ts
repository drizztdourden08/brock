/* @layer renderer-shell @kind logic */
import type { AppReview, AppReviewStepEntry } from '../app-review.type';
import type { ReviewStep } from '../review.type';
import { SEED_STEP } from './app-steps.constants';
import { loadedStep } from './loaded-step';

const clashing = ({ id }: AppReviewStepEntry): ReviewStep => ({
  name: id,
  run: (tour) => {
    tour.check('step-id', false, '', `the app step src/review/${id}.step.ts has the name of a built-in step; rename the file`);
    return Promise.resolve();
  },
});

const appSteps = (review: AppReview | null, builtIn: ReadonlySet<string>): ReviewStep[] =>
  (review?.steps ?? []).map((entry) => (builtIn.has(entry.id) || entry.id === SEED_STEP ? clashing(entry) : loadedStep(entry.id, entry.load)));

export { appSteps };
