/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { World } from './world.type';
import type { WorldKeys } from './world-keys.type';

type AlwaysAllowRule<K extends WorldKeys = WorldKeys> =
  { check(state: CollectionState<World<K>>, item: K['item']): boolean }['check'];

export type { AlwaysAllowRule };
