/* @layer renderer-shell @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera/primitives';
import type { ContactFieldProps } from './ContactField.type';

const ContactField = (props: ContactFieldProps) => {
  const { field, value, error, onChange } = props;
  return (
    <Field label={field.label} hint={field.hint} error={value.trim() === '' && !field.required ? undefined : error ?? undefined} required={field.required} width="full">
      <TextInput type="email" autoComplete="email" value={value} placeholder="name@example.com" onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
};

export { ContactField };
