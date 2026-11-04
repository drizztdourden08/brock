/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const when = <K extends WorldKeys>(cond: RuleNode<K>, then: RuleNode<K>, otherwise: RuleNode<K>): RuleNode<K> =>
  ({ op: 'if', cond, then, else: otherwise });

export { when };
