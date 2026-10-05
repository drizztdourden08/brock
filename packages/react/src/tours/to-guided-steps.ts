/* @layer renderer-shell @kind logic */
import type { TourStep, TourTarget } from '@drizztdourden08/tessera/composites';
import { prepareStep } from './prepare-step';
import { tourTargets } from './resolve-tour-target';
import type { BrockTourTarget, TourDef, TourStepDef } from './tour.type';

const lazyTarget = (target: BrockTourTarget): TourTarget => ({
  get current() {
    return tourTargets.resolve(target);
  },
});

const toGuidedStep = (tour: TourDef, step: TourStepDef, index: number): TourStep => {
  const lit = tourTargets.litOf(step);
  const clickLit = step.target === undefined && tourTargets.clickOf(step) !== undefined;
  return {
    id: step.id,
    title: step.title,
    body: step.body,
    ...(lit ? { target: lazyTarget(lit) } : {}),
    ...(step.placement ? { placement: step.placement } : {}),
    ...(step.mascot ? { mascot: step.mascot } : {}),
    advance: clickLit ? 'click' : 'next',
    onEnter: () => prepareStep(tour.id, step, index),
  };
};

const toGuidedSteps = (tour: TourDef): TourStep[] => tour.steps.map((step, index) => toGuidedStep(tour, step, index));

export { toGuidedSteps };
