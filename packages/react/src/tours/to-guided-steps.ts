/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
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

const hintOf = (step: TourStepDef, relayed: boolean, clickHint: ReactNode): ReactNode =>
  step.hint ?? (relayed ? clickHint : undefined);

const toGuidedStep = (tour: TourDef, step: TourStepDef, index: number, clickHint: ReactNode): TourStep => {
  const lit = tourTargets.litOf(step);
  const relayed = tourTargets.poppedClick(step) !== null;
  const click = step.target === undefined || relayed ? undefined : tourTargets.clickOf(step);
  const popped = tourTargets.poppedSpot(step) !== null;
  const advance = stepAdvance(step);
  const hint = hintOf(step, relayed, clickHint);
  return {
    id: step.id,
    title: step.title,
    body: step.body,
    ...(lit && !popped ? { target: lazyTarget(lit) } : {}),
    ...(click && advance === 'click' ? { clickTarget: lazyTarget(click) } : {}),
    ...(step.placement ? { placement: step.placement } : {}),
    ...(step.mascot ? { mascot: step.mascot } : {}),
    ...(hint === undefined ? {} : { hint }),
    advance,
    onEnter: ({ signal }) => prepareStep(tour.id, step, index, signal),
  };
};

const toGuidedSteps = (tour: TourDef, clickHint?: ReactNode): TourStep[] =>
  tour.steps.map((step, index) => toGuidedStep(tour, step, index, clickHint));

export { toGuidedSteps };
