/* @layer core @kind logic */
import { entryComplete } from './entry-complete';
import type { PollPass } from './poll-pass.type';

const reportCompleted = ({ state, hooks, view, completed, log }: PollPass): void => {
  for (const entry of state.entries) {
    if (state.reported.has(entry.key) || entry.baselineOnly === true) continue;
    if (!entryComplete(entry, view, completed)) continue;
    state.reported.add(entry.key);
    log(`[Poller] Check completed: ${entry.key}`);
    hooks.report(entry.key);
  }
};

export { reportCompleted };
