/* @layer core @kind types */
import type { PollerHooks } from './location-poller.type';
import type { PollEntry } from './poll-entry.type';

interface PollerState {
  entries: readonly PollEntry[];
  hooks: PollerHooks | null;
  reported: Set<string>;
  suppressed: Set<string>;
  timer: ReturnType<typeof setInterval> | null;
  needsRebaseline: boolean;
  stopStateLoad: (() => void) | null;
}

export type { PollerState };
