/* @layer core @kind logic */
import type { RuleArg } from '../types/rule-arg.type';
import type { RuleOptionValue } from '../types/rule-option-value.type';
import type { WorldKeys } from '../types/world-keys.type';

const isPlainArg = <K extends WorldKeys>(arg: RuleArg<K>): arg is RuleOptionValue => typeof arg !== 'object';

export { isPlainArg };
