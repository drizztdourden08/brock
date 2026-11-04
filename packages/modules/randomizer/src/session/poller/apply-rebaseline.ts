/* @layer core @kind logic */
import { entryComplete } from './entry-complete';
import type { PollPass } from './poll-pass.type';

const applyRebaseline = ({ state, hooks, view, completed, log }: PollPass): void => {
  const next = new Set<string>(state.suppressed);
  const toReport: string[] = [];
  for (const entry of state.entries) {
    if (next.has(entry.key) || !entryComplete(entry, view, completed)) continue;
    next.add(entry.key);
    if (hooks.isKnownReported !== undefined && !hooks.isKnownReported(entry.key)) toReport.push(entry.key);
  }
  state.reported.clear();
  for (const key of next) state.reported.add(key);
  log(`[Poller] Re-baselined: ${state.reported.size}/${state.entries.length} already complete, ${toReport.length} unreported`);
  for (const key of toReport) hooks.report(key);
};

export { applyRebaseline };
