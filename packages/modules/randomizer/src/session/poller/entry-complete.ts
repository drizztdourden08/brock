/* @layer core @kind logic */
import { probeMet } from '../../memory/probe-met';
import type { MemoryView } from '../../memory/memory-view.type';
import type { PollEntry } from './poll-entry.type';

const entryComplete = (entry: PollEntry, view: MemoryView, completed: ReadonlySet<string>): boolean => {
  const fromCompleted = entry.checkId !== undefined && completed.has(entry.checkId);
  if (entry.baselineOnly === true || entry.probe === undefined) return fromCompleted;
  return probeMet(entry.probe, view);
};

export { entryComplete };
