/* @layer core @kind types */
import type { MemoryView } from '../memory/memory-view.type';

type RandomizerPoll = {
  intervalMs?: number;
  completed?(): ReadonlySet<string>;
  beforePoll?(): void;
  loaded?(view: MemoryView): boolean;
};

export type { RandomizerPoll };
