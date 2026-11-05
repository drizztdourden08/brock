/* @layer core @kind logic */
import { commonestFiller } from './commonest-filler';
import { countsOf } from './counts-of';
import { forbiddenOf } from './forbidden-of';
import type { ItemClass } from '../export';
import type { ItemHalf, ItemHalfInput } from './world-model.type';
import type { WorldKeys } from '../../world';

const itemHalfOf = <K extends WorldKeys>(input: ItemHalfInput<K>): ItemHalf => {
  const { fillWorld, fillable, fixedProgression, read, locked, hooks } = input;
  const { pool } = fillWorld;
  const poolItems = [...pool.progression, ...pool.useful, ...pool.filler];
  const dungeonItems = [...(hooks.dungeonItems?.(fillWorld) ?? [])];
  const classOf = (item: string): ItemClass => {
    const base = hooks.classify(item, fillWorld);
    if (fixedProgression.has(item) || base === 'progression') return 'progression';
    return read.has(item) ? 'progression_skip_balancing' : base;
  };
  const placeable = new Set<string>([...poolItems, ...dungeonItems.map((entry) => entry.item)]);
  const every = new Set<string>([...placeable, ...fixedProgression, ...locked]);
  return {
    pool: countsOf(poolItems),
    dungeonItems,
    classes: Object.fromEntries([...every].sort().map((item) => [item, classOf(item)])),
    forbidden: forbiddenOf(fillWorld, fillable, placeable),
    fillerItem: commonestFiller(pool.filler),
  };
};

export { itemHalfOf };
