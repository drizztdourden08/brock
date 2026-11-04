/* @layer core @kind logic */
import { option } from './option';
import { when } from './when';
import type { RuleNode } from '../../types/rule-node.type';
import type { RuleOptionValue } from '../../types/rule-option-value.type';
import type { WorldKeys } from '../../types/world-keys.type';

const optionSwitch = <K extends WorldKeys>(
  key: K['option'], cases: readonly (readonly [RuleOptionValue, RuleNode<K>])[], fallback: RuleNode<K>,
): RuleNode<K> => cases.reduceRight<RuleNode<K>>(
  (otherwise, [value, then]) => when(option<K>(key, value), then, otherwise),
  fallback,
);

export { optionSwitch };
