/* @layer renderer-shell @kind component */
import { SegmentedControl, Select, ToggleGroup } from '@drizztdourden08/tessera/primitives';
import { choiceRows } from '../../behavior/choice-rows';
import type { SettingChoiceFieldProps } from './SettingChoiceField.type';

const SettingChoiceField = (props: SettingChoiceFieldProps) => {
  const { options, label, disabled } = props;
  const rows = choiceRows(options);
  const off = new Set(rows.filter((row) => row.disabled).map((row) => row.value));

  if (props.look === 'multi') {
    return <ToggleGroup value={[...props.value]} options={rows} onChange={props.onChange} disabled={disabled} label={label} />;
  }
  const { value, onChange } = props;
  const pick = (next: string): void => { if (!off.has(next)) onChange(next); };
  if (props.look === 'select') {
    const listed = rows.map((row) => ({ value: row.value, label: row.label, disabled: row.disabled, description: row.hint?.description }));
    return <Select value={value} onChange={pick} options={listed} disabled={disabled} aria-label={label} />;
  }
  return <SegmentedControl value={value} onChange={pick} options={rows.map((row) => ({ ...row, title: row.hint?.description }))} disabled={disabled} aria-label={label} />;
};

export { SettingChoiceField };
