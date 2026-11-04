/* @layer core @kind types */
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface CollectionState<W extends World = World> {
  readonly world: W;
  readonly progItems: Map<KeysOf<W>['holding'], number>;
  readonly reachableRegions: Set<KeysOf<W>['region']>;
  staleReachability: boolean;
  has(item: KeysOf<W>['holding'], count?: number): boolean;
  hasAny(items: readonly KeysOf<W>['holding'][]): boolean;
  count(item: KeysOf<W>['holding']): number;
  countGroup(items: readonly KeysOf<W>['holding'][]): number;
  hasGroup(items: readonly KeysOf<W>['holding'][]): boolean;
  collect(item: KeysOf<W>['holding']): void;
  remove(item: KeysOf<W>['holding']): void;
  canReachRegion(region: KeysOf<W>['region']): boolean;
}

export type { CollectionState };
