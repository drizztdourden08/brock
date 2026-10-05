/* @layer renderer-shell @kind logic */
import type { TourAdvance } from '@drizztdourden08/tessera/composites';
import { tourTargets } from './resolve-tour-target';
import type { TourStepDef } from './tour.type';

const stepAdvance = (step: TourStepDef): TourAdvance => {
  const on = step.advanceOn;
  if (!on) return 'next';
  return 'click' in on && tourTargets.poppedClick(step) === null ? 'click' : 'wait';
};

export { stepAdvance };
