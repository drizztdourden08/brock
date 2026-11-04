/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { RuleNodeVisitor } from '../../types/rule-node-visitor.type';
import type { WorldKeys } from '../../types/world-keys.type';

const childrenOf = <K extends WorldKeys>(node: RuleNode<K>): readonly RuleNode<K>[] => {
  if (node.op === 'all' || node.op === 'any') return node.of;
  if (node.op === 'if') return [node.cond, node.then, node.else];
  return [];
};

const walkRuleNode = <K extends WorldKeys>(node: RuleNode<K>, visitor: RuleNodeVisitor<K>, depth = 0): void => {
  visitor(node, depth);
  for (const child of childrenOf(node)) walkRuleNode(child, visitor, depth + 1);
};

export { walkRuleNode };
