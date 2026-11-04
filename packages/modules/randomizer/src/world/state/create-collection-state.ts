/* @layer core @kind logic */
import { updateReachableRegions } from './update-reachable-regions';
import type { CollectionState, World, WorldKeys } from '../types';

const createCollectionState = <K extends WorldKeys>(world: World<K>): CollectionState<World<K>> => {
  const progItems = new Map<K['holding'], number>();
  const hooks = world.collection;
  const add = (item: K['holding'], delta: number): void => {
    const next = (progItems.get(item) ?? 0) + delta;
    if (next <= 0) progItems.delete(item);
    else progItems.set(item, next);
  };
  const usable = (item: K['holding']): boolean => hooks?.isUsable === undefined || hooks.isUsable(state, item);
  const expansionOf = (item: K['holding']): K['holding'] | null =>
    hooks?.expandOnCollect === undefined ? null : hooks.expandOnCollect(item, progItems.get(item) ?? 0);
  const state: CollectionState<World<K>> = {
    world,
    progItems,
    reachableRegions: new Set<K['region']>(),
    staleReachability: true,
    count: (item) => progItems.get(item) ?? 0,
    has: (item, count = 1) => (progItems.get(item) ?? 0) >= count && usable(item),
    hasAny: (items) => items.some((item) => (progItems.get(item) ?? 0) > 0 && usable(item)),
    countGroup: (items) => items.reduce((sum, item) => sum + (progItems.get(item) ?? 0), 0),
    hasGroup: (items) => items.some((item) => (progItems.get(item) ?? 0) > 0),
    collect: (item) => {
      add(item, 1);
      const expanded = expansionOf(item);
      if (expanded !== null) add(expanded, 1);
      state.staleReachability = true;
    },
    remove: (item) => {
      const expanded = expansionOf(item);
      if (expanded !== null) add(expanded, -1);
      add(item, -1);
      state.staleReachability = true;
    },
    canReachRegion: (region) => {
      updateReachableRegions(state, world);
      return state.reachableRegions.has(region);
    },
  };
  return state;
};

export { createCollectionState };
