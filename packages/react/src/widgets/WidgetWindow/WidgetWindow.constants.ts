/* @layer renderer-shell @kind constants */
import type { WidgetWindowState } from '@drizztdourden08/brock-core';
import type { TourTarget } from '@drizztdourden08/tessera/composites';

const INITIAL_WINDOW_STATE: WidgetWindowState = { pin: 'off', onTop: false, snap: true, link: null, sync: true, square: false };

const TOUR_SPOT_KEEP: readonly TourTarget[] = [{ selector: '.widget__titlebar' }];

export { INITIAL_WINDOW_STATE, TOUR_SPOT_KEEP };
