/* @layer core @kind logic */
import type { RuleNode } from '../../types/rule-node.type';
import type { RuleOptionValue } from '../../types/rule-option-value.type';
import type { WorldKeys } from '../../types/world-keys.type';

const option = <K extends WorldKeys>(key: K['option'], equals: RuleOptionValue): RuleNode<K> =>
  ({ op: 'option', key, equals });

export { option };
