/* @layer core @kind logic */
import { helperDefinitionOf } from '../helper-definition-of';
import { isPlainArg } from '../is-plain-arg';
import { ruleArgOf } from './rule-arg-of';
import type { HelperNode } from '../../types/helper-node.type';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { RuleCheck } from '../../types/rule-check.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const compileHelperCall = <K extends WorldKeys>(
  node: HelperNode<K>, helpers: HelperRegistry<World<K>>,
): RuleCheck<World<K>> => {
  const { body } = helperDefinitionOf(helpers, node.name);
  const args = node.args ?? [];
  const fixed = args.filter(isPlainArg);
  if (fixed.length === args.length) return (state) => body(state, ...fixed);
  return (state) => body(state, ...args.map((arg) => ruleArgOf(state, arg)));
};

export { compileHelperCall };
