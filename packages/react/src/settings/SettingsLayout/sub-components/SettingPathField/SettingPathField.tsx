/* @layer renderer-shell @kind component */
import { PathField } from '@drizztdourden08/tessera/primitives';
import { usePlatform } from '../../../../platform/usePlatform';
import { dialogExtensions } from './behavior/dialog-extensions';
import type { SettingPathFieldProps } from './SettingPathField.type';

const SettingPathField = (props: SettingPathFieldProps) => {
  const { control, value, onChange, label, disabled } = props;
  const { pickPath, pathOf } = usePlatform().filePicker;
  const browse = pickPath ? () => pickPath({ folder: control.pick === 'folder', extensions: dialogExtensions(control.accept) }) : undefined;
  return (
    <PathField
      value={value === '' ? null : value}
      onChange={(next) => onChange(next ?? '')}
      onBrowse={browse}
      resolvePath={pathOf}
      kind={control.pick}
      accept={control.accept}
      placeholder={control.placeholder}
      disabled={disabled}
      aria-label={label}
    />
  );
};

export { SettingPathField };
