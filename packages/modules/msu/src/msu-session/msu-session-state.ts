/* @layer core @kind logic */
import type { MsuSessionState } from './msu-session.type';

const msuSessionState: MsuSessionState = { engine: null, owner: null, pending: null, pollId: null, teardown: null };

export { msuSessionState };
