/* @layer renderer-shell @kind types */
import type { MemoryView } from '../../../memory/memory-view.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';

interface FeedSources {
  game: RegisteredGame;
  view: MemoryView | null;
  sampled: ReadonlySet<string>;
  marks: ReadonlySet<string>;
}

export type { FeedSources };
