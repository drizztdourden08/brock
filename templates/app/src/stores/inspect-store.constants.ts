/* @layer renderer-app @kind constants */
import type { InspectState } from './inspect-store.type';

const INSPECT_DEFAULTS: Pick<InspectState, 'grid' | 'centre'> = { grid: 32, centre: true };

export { INSPECT_DEFAULTS };
