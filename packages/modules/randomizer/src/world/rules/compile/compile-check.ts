/* @layer core @kind logic */
import { compileCombinator } from './compile-combinator';
import { compileConstant } from './compile-constant';
import { compileHelperCall } from './compile-helper-call';
import { compileHolding } from './compile-holding';
import { compileWorldQuery } from './compile-world-query';
import { isCombinatorNode } from './is-combinator-node';
import { isHoldingNode } from './is-holding-node';
import { isWorldQueryNode } from './is-world-query-node';
import type { HelperRegistry } from '../../types/helper-registry.type';
import type { RuleCheck } from '../../types/rule-check.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const compileCheck = <K extends WorldKeys>(
  node: RuleNode<K>, helpers: HelperRegistry<World<K>>,
): RuleCheck<World<K>> => {
  if (isHoldingNode(node)) return compileHolding(node);
  if (isCombinatorNode(node)) return compileCombinator(node, (child) => compileCheck(child, helpers));
  if (isWorldQueryNode(node)) return compileWorldQuery(node);
  if (node.op === 'helper') return compileHelperCall(node, helpers);
  return compileConstant(node);
};

export { compileCheck };
