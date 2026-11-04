/* @layer renderer-shell @kind logic */
import { entryComplete } from '../../../session';
import type { TrackerProvider } from '../../../tracker';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';
import { NO_KEYS } from './tracker-feed.constants';
import type { FeedRun } from './tracker-feed-state.type';

const sampleChecks = (game: RegisteredGame, tracker: TrackerProvider<unknown>): FeedRun => {
  const view = game.memory.view();
  const sampled = new Set<string>();
  if (view === null) return { view, sampled };
  const completed = tracker.completed?.() ?? NO_KEYS;
  for (const entry of tracker.checks ?? []) if (entryComplete(entry, view, completed)) sampled.add(entry.key);
  return { view, sampled };
};

export { sampleChecks };
