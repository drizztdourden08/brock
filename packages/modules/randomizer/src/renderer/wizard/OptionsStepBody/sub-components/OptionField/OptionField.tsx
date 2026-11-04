/* @layer renderer-shell @kind component */
import { Field, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import type { OptionFieldProps } from './OptionField.type';

const OptionField = ({ option, value, onChange }: OptionFieldProps) => {
  if (typeof value === 'boolean') return <Toggle label={option.label} checked={value} disabled={option.frozen} onChange={onChange} />;
  const numeric = typeof value === 'number';
  return (
    <Field label={option.label}>
      <TextInput
        type={numeric ? 'number' : 'text'}
        value={String(value ?? '')}
        disabled={option.frozen}
        onChange={(e) => onChange(numeric ? Number(e.target.value) : e.target.value)}
      />
    </Field>
  );
};

export { OptionField };
