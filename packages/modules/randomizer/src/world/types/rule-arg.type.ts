/* @layer core @kind types */
import type { OptionRef } from './option-ref.type';
import type { RuleOptionValue } from './rule-option-value.type';
import type { SeedRef } from './seed-ref.type';
import type { WorldKeys } from './world-keys.type';

type RuleArg<K extends WorldKeys = WorldKeys> = RuleOptionValue | OptionRef<K> | SeedRef;

export type { RuleArg };
