/* @layer renderer-shell @kind logic */
import { tourTargets } from './resolve-tour-target';
import { stepAdvance } from './step-advance';
import type { TourDef, TourShown } from './tour.type';

const stuckClickStep = (def: TourDef | null, shown: TourShown | null): number | null => {
  if (!def || shown?.id !== def.id || shown.target !== null) return null;
  const step = def.steps[shown.index];
  if (!step || stepAdvance(step) !== 'click') return null;
  return tourTargets.resolve(tourTargets.clickOf(step)) === null ? shown.index : null;
};

export { stuckClickStep };
