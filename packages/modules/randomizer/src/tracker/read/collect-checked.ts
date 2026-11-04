/* @layer core @kind logic */
import type { CollectionState, World } from '../../world';

const collectChecked = (state: CollectionState, world: World, checked: ReadonlySet<string>): void => {
  for (const key of checked) {
    const item = world.placedItems.get(key);
    if (item !== undefined) state.collect(item);
  }
};

export { collectChecked };
