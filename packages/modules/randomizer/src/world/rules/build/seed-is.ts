/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { RuleOptionValue } from '../../types/rule-option-value.type';
import type { WorldKeys } from '../../types/world-keys.type';

const seedIs = <K extends WorldKeys>(key: string, equals: RuleOptionValue): RuleNode<K> =>
  ({ op: 'seed', key, equals });

export { seedIs };
