/* @layer renderer-shell @kind logic */
import type { AppReview } from '../app-review.type';
import type { ReviewStep } from '../review.type';
import { SEED_STEP } from './app-steps.constants';
import { appTour } from './app-tour';
import { copyFixtures } from './copy-fixtures';
import { loadedStep } from './loaded-step';

const seedSteps = (review: AppReview | null): ReviewStep[] => {
  const fixtures = review?.fixtures ?? [];
  const seed = review?.seed ? loadedStep(SEED_STEP, review.seed) : null;
  if (fixtures.length === 0) return seed ? [seed] : [];
  return [{
    name: SEED_STEP,
    run: async (tour) => {
      await copyFixtures(appTour(tour, SEED_STEP), fixtures);
      await seed?.run(tour);
    },
  }];
};

export { seedSteps };
