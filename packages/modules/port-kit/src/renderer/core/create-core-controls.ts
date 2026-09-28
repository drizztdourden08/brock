/* @layer renderer-shell @kind logic */
import type { CoreCalls, CoreExports } from '../../port/port-definition.type';
import type { CoreControls, StateHub } from './game-core.type';

const createCoreControls = (hub: StateHub, callsOf: () => CoreCalls | null, exports: CoreExports): CoreControls => ({
  setPaused: (paused) => {
    const calls = callsOf();
    const { status } = hub.get();
    if (!calls || (status !== 'running' && status !== 'paused')) return;
    if (exports.pause) calls.call(exports.pause, paused ? 1 : 0);
    hub.set({ status: paused ? 'paused' : 'running', error: null });
  },
  reset: () => {
    const calls = callsOf();
    if (calls && exports.reset) calls.call(exports.reset);
  },
});

export { createCoreControls };
