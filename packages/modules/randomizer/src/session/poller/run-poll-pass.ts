/* @layer core @kind logic */
import { applyRebaseline } from './apply-rebaseline';
import type { PollerHooks, PollerOptions } from './location-poller.type';
import { NO_COMPLETED } from './poll-once.constants';
import type { PollerState } from './poller-state.type';
import { reportCompleted } from './report-completed';

const runPollPass = (state: PollerState, hooks: PollerHooks, options: PollerOptions): void => {
  options.beforePoll?.();
  const view = options.memory.view();
  if (!view) return;
  const pass = { state, hooks, view, completed: options.completed?.() ?? NO_COMPLETED, log: options.log };
  if (state.needsRebaseline) {
    state.needsRebaseline = false;
    applyRebaseline(pass);
  } else {
    reportCompleted(pass);
  }
  options.afterPoll?.(view);
};

export { runPollPass };
