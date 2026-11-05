/* @layer renderer-shell @kind logic */
import type { OptionTab } from '../../../contract/randomizer-views.type';
import type { RuleOptionValue } from '../../../world/types/rule-option-value.type';
import type { RegisteredGame } from '../../game-registry/randomizer-game-state.type';
import { defaultOptionTabs } from './default-option-tabs';

const optionTabsOf = (game: RegisteredGame | null, values: Readonly<Record<string, RuleOptionValue>>): readonly OptionTab[] =>
  game?.views?.optionTabs?.(values) ?? defaultOptionTabs(game?.catalog ?? []);

export { optionTabsOf };
