/* @layer renderer-shell @kind logic */
import type { TourAdvance, TourStep, TourTarget } from '@drizztdourden08/tessera/composites';
import { prepareStep } from './prepare-step';
import { tourTargets } from './resolve-tour-target';
import type { BrockTourTarget, TourDef, TourStepDef } from './tour.type';

const lazyTarget = (target: BrockTourTarget): TourTarget => ({
  get current() {
    return tourTargets.resolve(target);
  },
});

const advanceOf = (step: TourStepDef, popped: boolean): TourAdvance => {
  const on = step.advanceOn;
  if (!on) return 'next';
  if ('click' in on) return popped ? 'next' : 'click';
  return 'wait';
};

const toGuidedStep = (tour: TourDef, step: TourStepDef, index: number): TourStep => {
  const lit = tourTargets.litOf(step);
  const click = step.target === undefined ? undefined : tourTargets.clickOf(step);
  const popped = tourTargets.poppedSpot(step) !== null;
  const advance = advanceOf(step, popped);
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
