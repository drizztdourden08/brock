/* @layer core @kind types */
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface FillRestrictiveInput<W extends World = World> {
  world: W;
  items: KeysOf<W>['item'][];
  locations: KeysOf<W>['location'][];
  assumedItems?: readonly KeysOf<W>['item'][];
  allowedAt?(item: KeysOf<W>['item'], location: KeysOf<W>['location']): boolean;
  relaxWhenBeatable?: boolean;
}

export type { FillRestrictiveInput };
