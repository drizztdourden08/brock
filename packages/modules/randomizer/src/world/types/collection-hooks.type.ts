/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface CollectionHooks<W extends World = World> {
  expandOnCollect?: (item: KeysOf<W>['holding'], held: number) => KeysOf<W>['holding'] | null;
  isUsable?: (state: CollectionState<W>, item: KeysOf<W>['holding']) => boolean;
}

export type { CollectionHooks };
