/* @layer core @kind logic */
import type { CollectionState, World, WorldKeys } from '../../types';

const canReachEvent = <K extends WorldKeys>(
  state: CollectionState<World<K>>,
  key: K['event'],
): boolean => {
  const event = state.world.eventsByKey.get(key);
  if (event === undefined) return false;
  if (!state.canReachRegion(event.region)) return false;
  const rule = state.world.getEventRule(key);
  return rule === undefined || rule(state);
};

export { canReachEvent };
