/* @layer renderer-shell @kind constants */
import type { ControllerLiveState } from './controller-state-store.type';

const RESCAN_TIMEOUT_MS = 3000;

const IDLE_CONTROLLER_STATE: ControllerLiveState = { buttons: [], axes: [0, 0, 0, 0, 0, 0] };

export { RESCAN_TIMEOUT_MS, IDLE_CONTROLLER_STATE };
