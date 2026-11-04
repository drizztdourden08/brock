/* @layer core @kind logic */
import type { CollectionState } from '../../world';
import { holdingCounts } from './holding-counts';

const collectHeld = (state: CollectionState, held: Iterable<string>): void => {
  for (const [item, floor] of holdingCounts(held)) {
    while (state.count(item) < floor) state.collect(item);
  }
};

export { collectHeld };
