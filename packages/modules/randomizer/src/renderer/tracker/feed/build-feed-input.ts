/* @layer renderer-shell @kind logic */
import { checkedLocations } from '../../../tracker';
import { cachedWorld } from '../../../tracker/read/world-cache';
import { completedKeys } from './completed-keys';
import { feedPlacement } from './feed-placement';
import type { FeedSources } from './feed-sources.type';
import { initialAssumed } from './initial-assumed';
import { NO_KEYS } from './tracker-feed.constants';
import type { TrackerFeedInput } from './tracker-feed-state.type';

const buildFeedInput = ({ game, view, sampled, marks }: FeedSources): TrackerFeedInput | null => {
  const provider = game.tracker;
  if (provider === undefined) return null;
  const placement = feedPlacement(provider);
  if (placement === null) return null;
  const completed = completedKeys(provider, sampled);
  const world = cachedWorld(provider, { placement, checked: NO_KEYS, completed, held: [], assumed: initialAssumed(provider) });
  const checked = checkedLocations(provider, world, completed);
  for (const mark of marks) if (world.locationsByKey.has(mark)) checked.add(mark);
  return { placement, checked, completed, held: provider.held?.(view) ?? [] };
};

export { buildFeedInput };
