/* @layer core @kind logic */
import { applyRebaseline } from './apply-rebaseline';
import { entryComplete } from './entry-complete';
import type { PollerOptions } from './location-poller.type';
import type { PollerState } from './poller-state.type';

const NO_COMPLETED: ReadonlySet<string> = new Set();

const ignorePollFailure = (): void => undefined;

const pollOnce = (state: PollerState, options: PollerOptions): void => {
  const { hooks } = state;
  if (hooks === null) return;
  try {
    options.beforePoll?.();
    const view = options.memory.view();
    if (!view) return;
    const completed = options.completed?.() ?? NO_COMPLETED;
    if (state.needsRebaseline) {
      state.needsRebaseline = false;
      applyRebaseline(state, hooks, view, completed, options.log);
      return;
    }
    for (const entry of state.entries) {
      if (state.reported.has(entry.key) || entry.baselineOnly === true) continue;
      if (!entryComplete(entry, view, completed)) continue;
      state.reported.add(entry.key);
      options.log(`[Poller] Check completed: ${entry.key}`);
      hooks.report(entry.key);
    }
  } catch {
    ignorePollFailure();
  }
};

export { pollOnce };
