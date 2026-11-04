/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface AssumedState<W extends World = World> {
  state: CollectionState<W>;
  collectedLocations: Set<KeysOf<W>['location']>;
}

export type { AssumedState };
