/* @layer core @kind logic */
import { HOLDING_OPS } from './rule-op-groups.constants';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { HoldingNode } from './rule-op-groups.type';

const isHoldingNode = <K extends WorldKeys>(node: RuleNode<K>): node is HoldingNode<K> => HOLDING_OPS.has(node.op);

export { isHoldingNode };
