/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface SwapRun<W extends World = World> {
  world: W;
  items: KeysOf<W>['item'][];
  assumedItems: readonly KeysOf<W>['item'][];
  placedHere: KeysOf<W>['location'][];
  swapCounts: Map<KeysOf<W>['item'], number>;
  fits: (
    state: CollectionState<W>,
    item: KeysOf<W>['item'],
    location: KeysOf<W>['location'],
    checkAccess: boolean,
  ) => boolean;
}

export type { SwapRun };
