/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { RuleNode } from './rule-node.type';
import type { World } from './world.type';
import type { WorldKeys } from './world-keys.type';

type Rule<K extends WorldKeys = WorldKeys> = ((state: CollectionState<World<K>>) => boolean)
  & { readonly node: RuleNode<K> };

export type { Rule };
