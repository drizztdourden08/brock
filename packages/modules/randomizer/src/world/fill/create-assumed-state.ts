/* @layer core @kind logic */
import { createCollectionState } from '../state';
import { sweepPlacedItems } from './sweep-placed-items';
import type { AssumedState, KeysOf, World } from '../types';

const createAssumedState = <W extends World>(
  world: W, assumedItems: Iterable<KeysOf<W>['item']>,
): AssumedState<W> => {
  const state = createCollectionState(world);
  for (const item of assumedItems) state.collect(item);
  const assumed: AssumedState<W> = { state, collectedLocations: new Set<KeysOf<W>['location']>() };
  sweepPlacedItems(assumed);
  return assumed;
};

export { createAssumedState };
