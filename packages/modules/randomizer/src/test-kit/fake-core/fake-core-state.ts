/* @layer core @kind logic */
import type { FakeCoreState } from './fake-core-state.type';

const fakeCoreState = (): FakeCoreState => ({
  port: null,
  report: null,
  delivered: [],
  queued: [],
  holdGrants: false,
  index: 0,
  roomHash: 0,
  inPlay: true,
  goal: false,
  kills: 0,
  down: false,
  disarms: 0,
  pauses: 0,
  cancels: 0,
  deathLinkBits: [],
  collected: new Set(),
  localComplete: new Set(),
  armedLocations: new Set(),
  notReady: new Set(),
  readyListeners: new Set(),
});

export { fakeCoreState };
