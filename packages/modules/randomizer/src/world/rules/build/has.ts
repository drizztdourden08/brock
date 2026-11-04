/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const has = <K extends WorldKeys>(item: K['holding'], count = 1): RuleNode<K> =>
  (count === 1 ? { op: 'has', item } : { op: 'has', item, count });

export { has };
