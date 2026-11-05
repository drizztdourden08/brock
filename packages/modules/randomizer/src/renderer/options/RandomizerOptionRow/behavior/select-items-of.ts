/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../../world/options/option-def.type';

const selectItemsOf = (option: OptionDef): { value: string; label: string }[] =>
  (option.choices ?? []).map((choice) => ({
    value: String(choice),
    label: option.choiceLabels?.[String(choice)] ?? String(choice),
  }));

export { selectItemsOf };
