/* @layer renderer-shell @kind types */
import type { MemoryView } from '../../../memory/memory-view.type';
import type { TrackerInput } from '../../../tracker';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';

type TrackerFeedInput = Omit<TrackerInput, 'assumed'>;

interface TrackerFeedState {
  feed: TrackerFeedInput | null;
  publish(next: TrackerFeedInput | null): void;
}

interface FeedRun {
  view: MemoryView | null;
  sampled: ReadonlySet<string>;
}

interface FeedWiring {
  game: RegisteredGame | null;
  unbindGame(): void;
  stopSampler: (() => void) | null;
}

export type { TrackerFeedInput, TrackerFeedState, FeedRun, FeedWiring };
