/* @layer renderer-shell @kind logic */
import { WAIT_CEILING_MS } from '../review.constants';
import { awaitSignal } from './await-signal';
import { domWake } from './dom-wake';
import { sourceOf } from './source-of';
import { storeWake } from './store-wake';
import { windowWake } from './window-wake';

const until = async (probe: () => Promise<boolean>, what = `the page to satisfy ${sourceOf(probe)}`, timeoutMs = WAIT_CEILING_MS): Promise<boolean> =>
  (await awaitSignal(probe, { what, ceilingMs: timeoutMs, wakeOn: [windowWake, storeWake, domWake] })) === true;

export { until };
