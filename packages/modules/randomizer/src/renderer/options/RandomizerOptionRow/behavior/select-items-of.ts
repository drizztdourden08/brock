/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { OptionDef } from '../../../../world/options/option-def.type';

const selectItemsOf = (option: OptionDef, text: (value: Text) => string): { value: string; label: string }[] =>
  (option.choices ?? []).map((choice) => {
    const label = option.choiceLabels?.[String(choice)];
    return { value: String(choice), label: label === undefined ? String(choice) : text(label) };
  });

export { selectItemsOf };
