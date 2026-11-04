/* @layer renderer-shell @kind component */
import { Field, Select, Stack, Text, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import { FROZEN_HINT } from '../../OptionsStepBody.constants';
import type { OptionFieldProps } from './OptionField.type';

const OptionField = ({ option, value, onChange }: OptionFieldProps) => {
  const hint = option.hint ?? (option.frozen ? FROZEN_HINT : undefined);
  const numeric = typeof value === 'number';
  const choices = option.choices;
  const control =
    typeof value === 'boolean' ? (
      <Toggle label={option.label} checked={value} disabled={option.frozen} onChange={onChange} />
    ) : (
      <Field label={option.label}>
        {choices ? (
          <Select
            value={String(value ?? '')}
            disabled={option.frozen}
            options={choices.map((choice) => ({ value: String(choice), label: option.choiceLabels?.[String(choice)] ?? String(choice) }))}
            onChange={(next) => onChange(choices.find((choice) => String(choice) === next) ?? next)}
          />
        ) : (
          <TextInput
            type={numeric ? 'number' : 'text'}
            value={String(value ?? '')}
            disabled={option.frozen}
            onChange={(e) => onChange(numeric ? Number(e.target.value) : e.target.value)}
          />
        )}
      </Field>
    );
  if (!hint) return control;
  return (
    <Stack gap="xs">
      {control}
      <Text variant="caption">{hint}</Text>
    </Stack>
  );
};

export { OptionField };
