/* @layer core @kind logic */
import { createListenerSet } from '../../archipelago';
import type { OnlineRun } from './online-run.type';

const createOnlineRun = <A>(): OnlineRun<A> => ({
  live: false,
  generation: 0,
  armed: null,
  queue: null,
  placement: null,
  scouted: null,
  keysById: new Map(),
  entriesByKey: new Map(),
  grants: new Set(),
  collected: new Set(),
  reportedAll: new Set(),
  pollWanted: false,
  goalDone: false,
  applying: false,
  ready: createListenerSet<[]>(),
  stopCore: null,
});

export { createOnlineRun };
