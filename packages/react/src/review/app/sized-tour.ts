/* @layer renderer-shell @kind logic */
import type { StepTour } from '../review.type';

const sizedTour = (tour: StepTour, suffix: string): StepTour => ({
  ...tour,
  capture: (name) => tour.capture(`${name}-${suffix}`),
  check: (id, pass, passReason, failReason) => { tour.check(`${id}-${suffix}`, pass, passReason, failReason); },
  report: (outcomes) => { tour.report(outcomes.map((outcome) => ({ ...outcome, id: `${outcome.id}-${suffix}` }))); },
});

export { sizedTour };
