/* @layer renderer-shell @kind logic */
import type { TourStep } from '@drizztdourden08/tessera/composites';

const nextOnStuck = (steps: readonly TourStep[], stuck: number | null): readonly TourStep[] =>
  (stuck === null ? steps : steps.map((step, index) => (index === stuck ? { ...step, advance: 'next', clickTarget: undefined } : step)));

export { nextOnStuck };
