/* @layer core @kind logic */
import { readSeedValue } from '../read-seed-value';
import type { CollectionState } from '../../types/collection-state.type';
import type { OptionRef } from '../../types/option-ref.type';
import type { RuleArg } from '../../types/rule-arg.type';
import type { RuleOptionValue } from '../../types/rule-option-value.type';
import type { SeedRef } from '../../types/seed-ref.type';
import type { World } from '../../types/world.type';
import type { WorldKeys } from '../../types/world-keys.type';

const refOf = <K extends WorldKeys>(
  state: CollectionState<World<K>>, ref: OptionRef<K> | SeedRef,
): RuleOptionValue => ('seed' in ref ? readSeedValue(state.world, ref.seed) : state.world.readOption(ref.option));

const ruleArgOf = <K extends WorldKeys>(state: CollectionState<World<K>>, arg: RuleArg<K>): RuleOptionValue =>
  (typeof arg === 'object' ? refOf(state, arg) : arg);

export { ruleArgOf };
