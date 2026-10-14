/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsInput } from '@drizztdourden08/tessera/composites';
import type { SettingChoice } from '../../settings.type';
import { SettingChoiceField } from '../sub-components/SettingChoiceField';
import type { SettingChoiceLookOf } from '../sub-components/SettingChoiceField';
import type { SettingChange, SettingInputRow } from './setting-input.type';

const oneOf = (look: SettingChoiceLookOf, options: readonly SettingChoice[], value: string, row: SettingInputRow & { onChange: SettingChange }): SettingsInput => ({
  kind: 'custom',
  control: createElement(SettingChoiceField, { look, options, value, onChange: row.onChange, label: row.label, disabled: row.disabled }),
  text: options.find((option) => option.value === value)?.label,
});

const manyOf = (options: readonly SettingChoice[], value: readonly string[], row: SettingInputRow & { onChange: SettingChange }): SettingsInput => ({
  kind: 'custom',
  control: createElement(SettingChoiceField, { look: 'multi', options, value, onChange: row.onChange, label: row.label, disabled: row.disabled }),
  text: options.filter((option) => value.includes(option.value)).map((option) => option.label).join(', '),
});

const choiceSettingInput = { oneOf, manyOf };

export { choiceSettingInput };
