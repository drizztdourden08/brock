/* @layer renderer-shell @kind logic */
import type { TourStep, TourTarget } from '@drizztdourden08/tessera/composites';
import { prepareStep } from './prepare-step';
import { tourTargets } from './resolve-tour-target';
import { stepAdvance } from './step-advance';
import type { BrockTourTarget, TourDef, TourStepDef } from './tour.type';

const lazyTarget = (target: BrockTourTarget): TourTarget => ({
  get current() {
    return tourTargets.resolve(target);
  },
});

const toGuidedStep = (tour: TourDef, step: TourStepDef, index: number): TourStep => {
  const lit = tourTargets.litOf(step);
  const click = step.target === undefined || tourTargets.poppedClick(step) !== null ? undefined : tourTargets.clickOf(step);
  const popped = tourTargets.poppedSpot(step) !== null;
  const advance = stepAdvance(step);
  return {
    id: step.id,
    title: step.title,
    body: step.body,
    ...(lit && !popped ? { target: lazyTarget(lit) } : {}),
    ...(click && advance === 'click' ? { clickTarget: lazyTarget(click) } : {}),
    ...(step.placement ? { placement: step.placement } : {}),
    ...(step.mascot ? { mascot: step.mascot } : {}),
    ...(step.hint === undefined ? {} : { hint: step.hint }),
    advance,
    onEnter: ({ signal }) => prepareStep(tour.id, step, index, signal),
  };
};

const toGuidedSteps = (tour: TourDef): TourStep[] => tour.steps.map((step, index) => toGuidedStep(tour, step, index));

export { toGuidedSteps };
