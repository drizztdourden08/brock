/* @layer renderer-shell @kind constants */
import type { ControllerLiveState } from './controller-state-store.type';

const RESCAN_TIMEOUT_MS = 3000;

const REPORT_ACTION_ID = 'report';

const IDLE_CONTROLLER_STATE: ControllerLiveState = { buttons: [], axes: [0, 0, 0, 0, 0, 0] };

export { IDLE_CONTROLLER_STATE, REPORT_ACTION_ID, RESCAN_TIMEOUT_MS };
