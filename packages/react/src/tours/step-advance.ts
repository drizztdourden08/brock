/* @layer renderer-shell @kind logic */
import type { TourAdvance } from '@drizztdourden08/tessera/composites';
import type { TourStepDef } from './tour.type';

const stepAdvance = (step: TourStepDef): TourAdvance => {
  const on = step.advanceOn;
  if (!on) return 'next';
  return 'click' in on ? 'click' : 'wait';
};

export { stepAdvance };
