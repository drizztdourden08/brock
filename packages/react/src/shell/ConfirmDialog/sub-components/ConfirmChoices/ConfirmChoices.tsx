/* @layer renderer-shell @kind component */
import { RadioGroup, Select } from '@drizztdourden08/tessera/primitives';
import type { ConfirmChoicesProps } from './ConfirmChoices.type';

const ConfirmChoices = (props: ConfirmChoicesProps) => {
  const { choices, value, label, look = 'radio', searchable, onChange } = props;
  const current = value ?? choices[0]?.value ?? '';
  if (look === 'select') {
    return <Select options={[...choices]} value={current} onChange={onChange} searchable={searchable} aria-label={label} grow />;
  }
  return <RadioGroup value={current} options={[...choices]} onChange={onChange} label={label} direction="vertical" />;
};

export { ConfirmChoices };
