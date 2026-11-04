/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { WorldKeys } from '../../types/world-keys.type';

const hasAny = <K extends WorldKeys>(items: readonly K['holding'][]): RuleNode<K> => ({ op: 'hasAny', items });

export { hasAny };
