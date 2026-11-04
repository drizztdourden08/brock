/* @layer core @kind logic */
import type { RuleCheck } from '../../types/rule-check.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { ConstantNode } from './rule-op-groups.type';

const compileConstant = <K extends WorldKeys>(node: ConstantNode<K>): RuleCheck<World<K>> => {
  switch (node.op) {
    case 'true': return () => true;
    case 'false': return () => false;
    default: throw new Error(`unknown rule op: ${JSON.stringify(node)}`);
  }
};

export { compileConstant };
