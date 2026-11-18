/* @layer renderer-shell @kind component */
import { Field, Small, TextInput } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../i18n';
import type { ContactFieldProps } from './ContactField.type';
import { CONTACT_HINT } from '../BugReportDialog.constants';

const ContactField = (props: ContactFieldProps) => {
  const { shown, identity, value, onChange } = props;
  const t = useT();
  const text = useText();
  if (identity) return <Small tone="muted" className="bug-report__identity">{t('brock-app:bugReport.contact.identity', { identity })}</Small>;
  if (!shown) return null;
  return (
    <Field label={t('brock-app:bugReport.contact.label')} hint={text(CONTACT_HINT)} width="full">
      <TextInput type="email" autoComplete="email" value={value} placeholder="you@example.com" onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
};

export { ContactField };
