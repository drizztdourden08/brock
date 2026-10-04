/* @layer renderer-shell @kind logic */
import type { AppReview } from '../app-review.type';
import type { ReviewStep } from '../review.type';
import { SEED_STEP } from './app-steps.constants';
import { loadedStep } from './loaded-step';

const seedSteps = (review: AppReview | null): ReviewStep[] => (review?.seed ? [loadedStep(SEED_STEP, review.seed)] : []);

export { seedSteps };
