/* @layer core @kind logic */
import type { LocationPoller, PollerOptions } from './location-poller.type';
import { pollOnce } from './poll-once';
import { POLL_INTERVAL_MS } from './poller.constants';
import type { PollerState } from './poller-state.type';

const createLocationPoller = (options: PollerOptions): LocationPoller => {
  const intervalMs = options.intervalMs ?? POLL_INTERVAL_MS;
  const state: PollerState = {
    entries: [], hooks: null, reported: new Set(), suppressed: new Set(),
    timer: null, needsRebaseline: false, stopStateLoad: null,
  };

  const pause = (): void => {
    if (state.timer !== null) {
      clearInterval(state.timer);
      state.timer = null;
      options.log('[Poller] Location polling stopped');
    }
    state.stopStateLoad?.();
    state.stopStateLoad = null;
    state.reported.clear();
    state.entries = [];
    state.needsRebaseline = false;
    state.hooks = null;
  };

  const rebaseline = (): void => {
    state.needsRebaseline = true;
  };

  return {
    start: (entries, hooks) => {
      pause();
      state.needsRebaseline = true;
      state.hooks = hooks;
      state.entries = entries;
      state.stopStateLoad = options.memory.onStateLoaded?.(rebaseline) ?? null;
      options.log(`[Poller] Location polling started: ${entries.length} checks (every ${intervalMs}ms)`);
      state.timer = setInterval(() => pollOnce(state, options), intervalMs);
    },
    pause,
    stop: () => {
      pause();
      state.suppressed.clear();
    },
    rebaseline,
    suppress: (key) => {
      state.reported.add(key);
      state.suppressed.add(key);
    },
    pollOnce: () => pollOnce(state, options),
    reported: () => state.reported,
  };
};

export { createLocationPoller };
