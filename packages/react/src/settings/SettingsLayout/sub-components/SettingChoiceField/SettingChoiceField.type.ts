/* @layer renderer-shell @kind types */
import type { SettingChoice } from '../../../settings.type';

type SettingChoiceLookOf = 'segmented' | 'select';

interface SettingChoiceFieldOne {
  look: SettingChoiceLookOf;
  value: string;
  onChange: (value: string) => void;
}

interface SettingChoiceFieldMany {
  look: 'multi';
  value: readonly string[];
  onChange: (value: string[]) => void;
}

type SettingChoiceFieldProps = (SettingChoiceFieldOne | SettingChoiceFieldMany) & {
  options: readonly SettingChoice[];
  label: string;
  disabled: boolean;
};

export type { SettingChoiceFieldProps, SettingChoiceLookOf };
