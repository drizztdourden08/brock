/* @layer core @kind types */
import type { MemoryView } from '../../memory/memory-view.type';
import type { PollEntry } from '../../session/poller/poll-entry.type';
import type { CollectionState, DefPlacement, World } from '../../world';
import type { TrackerAssumption } from './tracker-assumption.type';
import type { TrackerGrouping } from './tracker-grouping.type';
import type { TrackerInput } from './tracker-input.type';

interface TrackerProvider<P = DefPlacement> {
  world(input: TrackerInput<P>): World;
  worldKey?(input: TrackerInput<P>): string;
  vanilla?(): P;
  locationOf?(key: string): string | null;
  assumedHeld?(assumed: ReadonlySet<string>): readonly string[];
  prime?(state: CollectionState, input: TrackerInput<P>): void;
  checks?: readonly PollEntry[];
  completed?(): ReadonlySet<string>;
  held?(view: MemoryView | null): readonly string[];
  subscribe?(fn: () => void): () => void;
  assumptions?: readonly TrackerAssumption[];
  groupings?: readonly TrackerGrouping[];
  groupOf?(location: string, grouping: string): string;
  sphereOf?(placement: P): ReadonlyMap<string, number>;
  labelOf?(location: string): string;
  itemLabelOf?(item: string): string;
}

export type { TrackerProvider };
