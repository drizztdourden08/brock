/* @layer renderer-shell @kind constants */
import type { TourStep } from '@drizztdourden08/tessera/composites';
import type { KeptUsable } from './TourHost.type';

const NO_KEPT: KeptUsable = { made: [], lifted: [] };

const NO_STEPS: readonly TourStep[] = [];

const TOUR_CLASS = 'brock-tour';

export { NO_KEPT, NO_STEPS, TOUR_CLASS };
