/* @layer renderer-shell @kind logic */
import type { ReviewStepDef, ReviewStepSize, ReviewStepWindow } from '../app-review.type';
import type { StepTour } from '../review.type';
import { withWindowSize } from '../steps/with-window-size';
import { NARROW_SIZE } from './app-steps.constants';
import { appTour } from './app-tour';
import { sizedTour } from './sized-tour';

const windowOf = (size: ReviewStepSize): ReviewStepWindow => (size === 'narrow' ? NARROW_SIZE : size);

const sizedRun = async (tour: StepTour, id: string, def: ReviewStepDef): Promise<void> => {
  const sizes = (def.sizes ?? []).map(windowOf);
  if (sizes.length === 0) {
    await def.run(appTour(tour, id));
    return;
  }
  for (const size of sizes) {
    const ran = await withWindowSize(size, () => def.run(appTour(sizedTour(tour, size.name), id)));
    if (!ran) tour.check(`window-${size.name}`, false, '', `the main window has no bounds to resize to ${size.width} x ${size.height}`);
  }
};

export { sizedRun };
