/* @layer renderer-shell @kind constants */
import type { TourStep, TourTarget } from '@drizztdourden08/tessera/composites';
import { TITLE_BAR_SELECTOR } from '../tours.constants';

const NO_STEPS: readonly TourStep[] = [];

const KEEP_USABLE: readonly TourTarget[] = [{ selector: TITLE_BAR_SELECTOR }];

const TOUR_CLASS = 'brock-tour';

export { KEEP_USABLE, NO_STEPS, TOUR_CLASS };
