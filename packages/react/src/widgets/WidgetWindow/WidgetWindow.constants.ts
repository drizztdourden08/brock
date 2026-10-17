/* @layer renderer-shell @kind constants */
import type { WidgetWindowState } from '@drizztdourden08/brock-core';
import type { TourTarget } from '@drizztdourden08/tessera/composites';
import type { EscapeContext } from '../../app/BrockApp/BrockApp.type';

const INITIAL_WINDOW_STATE: WidgetWindowState = { pin: 'off', onTop: false, snap: true, link: null, sync: true, square: false };

const TOUR_SPOT_KEEP: readonly TourTarget[] = [{ selector: '.widget__titlebar' }];

const POPPED_ESCAPE: EscapeContext = { home: () => null };

export { INITIAL_WINDOW_STATE, POPPED_ESCAPE, TOUR_SPOT_KEEP };
