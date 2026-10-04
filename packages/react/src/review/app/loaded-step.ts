/* @layer renderer-shell @kind logic */
import type { ReviewStepDef } from '../app-review.type';
import type { ReviewStep } from '../review.type';
import { SEED_STEP } from './app-steps.constants';
import { appTour } from './app-tour';

const loadedStep = (id: string, load: () => Promise<{ default: ReviewStepDef }>): ReviewStep => ({
  name: id,
  run: async (tour) => {
    const def = (await load()).default;
    await def.run(appTour(tour, id));
    tour.check('step-ran', true, `src/review/${id === SEED_STEP ? 'seed' : `${id}.step`}.ts ran to the end`, '');
  },
});

export { loadedStep };
