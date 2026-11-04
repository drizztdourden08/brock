/* @layer core @kind logic */
import { COMBINATOR_OPS } from './rule-op-groups.constants';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { CombinatorNode } from './rule-op-groups.type';

const isCombinatorNode = <K extends WorldKeys>(node: RuleNode<K>): node is CombinatorNode<K> => COMBINATOR_OPS.has(node.op);

export { isCombinatorNode };
