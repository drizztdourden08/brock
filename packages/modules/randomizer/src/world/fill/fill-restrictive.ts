/* @layer core @kind logic */
import { itemAt } from '../util';
import { createAssumedState } from './create-assumed-state';
import { FillError } from './fill-error';
import { makeFits } from './make-fits';
import { trySwap } from './try-swap';
import type { FillRestrictiveInput, KeysOf, World } from '../types';

const fillRestrictive = <W extends World>(input: FillRestrictiveInput<W>): void => {
  const { world, items, locations, allowedAt } = input;
  const assumedItems = input.assumedItems ?? [];
  const relaxWhenBeatable = input.relaxWhenBeatable ?? false;
  const placedHere: KeysOf<W>['location'][] = [];
  const swapCounts = new Map<KeysOf<W>['item'], number>();
  const fits = makeFits<W>(allowedAt);
  const swapRun = { world, items, assumedItems, placedHere, swapCounts, fits };
  while (items.length > 0) {
    const item = itemAt(items, items.length - 1);
    items.pop();
    const assumed = createAssumedState(world, [...assumedItems, ...items]);
    const checkAccess = !relaxWhenBeatable || !world.isBeaten(assumed.state);
    const spotIndex = locations.findIndex((key) => fits(assumed.state, item, key, checkAccess));
    if (spotIndex >= 0) {
      const spot = itemAt(locations.splice(spotIndex, 1), 0);
      world.placedItems.set(spot, item);
      placedHere.push(spot);
      continue;
    }
    if (!trySwap(swapRun, item, checkAccess)) {
      throw new FillError(item,
        `${items.length} items left, ${locations.length} open locations, ${placedHere.length} placed`);
    }
  }
};

export { fillRestrictive };
