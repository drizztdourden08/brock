/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { KeysOf } from './keys-of.type';
import type { RuleNode } from './rule-node.type';
import type { RuleOptionValue } from './rule-option-value.type';
import type { World } from './world.type';

interface HelperDefinition<W extends World = World> {
  name: KeysOf<W>['helper'];
  params: readonly string[];
  body(state: CollectionState<W>, ...args: readonly RuleOptionValue[]): boolean;
  expand?(world: W, ...args: readonly RuleOptionValue[]): RuleNode<KeysOf<W>>;
}

export type { HelperDefinition };
