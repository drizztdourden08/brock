/* @layer renderer-shell @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera/primitives';
import type { ContactFieldProps } from './ContactField.type';
import { CONTACT_HINT } from '../BugReportDialog.constants';

const ContactField = (props: ContactFieldProps) => {
  const { shown, value, onChange } = props;
  if (!shown) return null;
  return (
    <Field label="Contact email" hint={CONTACT_HINT} width="full">
      <TextInput type="email" autoComplete="email" value={value} placeholder="you@example.com" onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
};

export { ContactField };
