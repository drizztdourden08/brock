/* @layer core @kind logic */
import { WORLD_QUERY_OPS } from './rule-op-groups.constants';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';
import type { WorldQueryNode } from './rule-op-groups.type';

const isWorldQueryNode = <K extends WorldKeys>(node: RuleNode<K>): node is WorldQueryNode<K> => WORLD_QUERY_OPS.has(node.op);

export { isWorldQueryNode };
