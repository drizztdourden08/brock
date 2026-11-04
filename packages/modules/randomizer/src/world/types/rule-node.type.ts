/* @layer core @kind types */
import type { RuleArg } from './rule-arg.type';
import type { RuleCount } from './rule-count.type';
import type { RuleOptionValue } from './rule-option-value.type';
import type { SeedRef } from './seed-ref.type';
import type { WorldKeys } from './world-keys.type';

type RuleNode<K extends WorldKeys = WorldKeys> =
  | { op: 'true' }
  | { op: 'false' }
  | { op: 'has'; item: K['holding'] | SeedRef; count?: number }
  | { op: 'hasAny'; items: readonly K['holding'][] }
  | { op: 'hasDistinct'; items: readonly K['holding'][]; atLeast: RuleCount<K> }
  | { op: 'countGroup'; items: readonly K['holding'][]; atLeast: RuleCount<K> }
  | { op: 'all'; of: readonly RuleNode<K>[] }
  | { op: 'any'; of: readonly RuleNode<K>[] }
  | { op: 'if'; cond: RuleNode<K>; then: RuleNode<K>; else: RuleNode<K> }
  | { op: 'region'; region: K['region'] }
  | { op: 'location'; location: K['location'] }
  | { op: 'exit'; name: string }
  | { op: 'placedAt'; location: K['location']; item: K['item'] }
  | { op: 'option'; key: K['option']; equals: RuleOptionValue }
  | { op: 'seed'; key: string; equals: RuleOptionValue }
  | { op: 'helper'; name: K['helper']; args?: readonly RuleArg<K>[] };

export type { RuleNode };
