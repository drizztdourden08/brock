/* @layer core @kind logic */
import { compileRule } from '../rules';
import type { HelperRegistry, Rule, RuleNode, World, WorldKeys } from '../types';

const compileRuleMap = <Key, K extends WorldKeys>(
  nodes: ReadonlyMap<Key, RuleNode<K>> | undefined, helpers: HelperRegistry<World<K>>,
): Map<Key, Rule<K>> =>
    new Map([...(nodes ?? [])].map(([key, node]): [Key, Rule<K>] => [key, compileRule(node, helpers)]));

export { compileRuleMap };
