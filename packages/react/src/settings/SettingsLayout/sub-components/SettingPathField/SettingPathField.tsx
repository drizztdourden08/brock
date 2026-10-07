/* @layer renderer-shell @kind component */
import { PathInput } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../../../platform/usePlatform';
import { dialogExtensions } from './behavior/dialog-extensions';
import { revealWithToast } from './behavior/reveal-with-toast';
import type { SettingPathFieldProps } from './SettingPathField.type';

const SettingPathField = (props: SettingPathFieldProps) => {
  const { control, value, onChange, label, disabled } = props;
  const { pickPath, pathOf, revealPath } = usePlatform().filePicker;
  const browse = pickPath ? () => pickPath({ folder: control.pick === 'folder', extensions: dialogExtensions(control.accept) }) : undefined;
  return (
    <PathInput
      value={value === '' ? null : value}
      onChange={(next) => onChange(next ?? '')}
      onBrowse={browse}
      onReveal={revealWithToast(revealPath)}
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
