/* @layer core @kind logic */
import { canCollectLocation } from '../state';
import type { CollectionState, KeysOf, World } from '../types';

const canFillLocation = <W extends World>(
  state: CollectionState<W>,
  location: KeysOf<W>['location'],
  item: KeysOf<W>['item'],
  checkAccess = true,
): boolean => {
  const { world } = state;
  if (!world.getItemRule(location)(item)) return false;
  const allow = world.alwaysAllow.get(location);
  if (allow?.(state, item)) return true;
  return !checkAccess || canCollectLocation(state, location);
};

export { canFillLocation };
