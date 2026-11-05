/* @layer renderer-shell @kind logic */
import type { StepperSubStep } from '@drizztdourden08/tessera/primitives';
import type { RandomizerOptions } from '../../../randomizer-options.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';
import { changedCountOf } from './changed-count-of';
import { optionTabsOf } from './option-tabs-of';
import { optionValuesOf } from './option-values-of';

const optionSubStepsOf = (game: RegisteredGame | null, overrides: RandomizerOptions): readonly StepperSubStep[] => {
  const catalog = game?.catalog ?? [];
  const values = optionValuesOf(catalog, overrides);
  return optionTabsOf(game, values).map(({ id, label, keys }) => ({ id, label, count: changedCountOf(catalog, values, keys) }));
};

export { optionSubStepsOf };
