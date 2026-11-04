/* @layer core @kind types */
import type { OptionRef } from './option-ref.type';
import type { SeedRef } from './seed-ref.type';
import type { WorldKeys } from './world-keys.type';

type RuleCount<K extends WorldKeys = WorldKeys> = number | OptionRef<K> | SeedRef;

export type { RuleCount };
