/* @layer renderer-shell @kind constants */
import type { CoreState } from './game-core.type';

const IDLE_STATE: CoreState = Object.freeze({ status: 'idle', error: null });

export { IDLE_STATE };
