/* @layer core @kind logic */
import type { RuleCount } from '../../types/rule-count.type';
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const countGroup = <K extends WorldKeys>(items: readonly K['holding'][], atLeast: RuleCount<K>): RuleNode<K> =>
  ({ op: 'countGroup', items, atLeast });

export { countGroup };
