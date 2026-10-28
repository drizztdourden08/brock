/* @layer renderer-shell @kind logic */
import { WAIT_CEILING_MS } from '../review.constants';
import { awaitSignal } from './await-signal';
import { domWake } from './dom-wake';
import { sourceOf } from './source-of';
import { storeWake } from './store-wake';

const waitFor = <T>(probe: () => T | null | undefined | false, timeoutMs = WAIT_CEILING_MS, what = `the page to satisfy ${sourceOf(probe)}`): Promise<T | null> =>
  awaitSignal(probe, { what, ceilingMs: timeoutMs, wakeOn: [domWake, storeWake] });

export { waitFor };
