/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { MemoryBridge } from '../../memory/memory-bridge.type';
import type { PollEntry } from './poll-entry.type';

type PollerOptions = {
  memory: MemoryBridge;
  completed?(): ReadonlySet<string>;
  beforePoll?(): void;
  intervalMs?: number;
  log: RandomizerLog;
};

type PollerHooks = { report(key: string): void; isKnownReported?(key: string): boolean };

type LocationPoller = {
  start(entries: readonly PollEntry[], hooks: PollerHooks): void;
  pause(): void;
  stop(): void;
  rebaseline(): void;
  suppress(key: string): void;
  pollOnce(): void;
  reported(): ReadonlySet<string>;
};

export type { PollerOptions, PollerHooks, LocationPoller };
