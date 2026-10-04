/* @layer renderer-shell @kind logic */
import type { SettingsInput } from '@drizztdourden08/tessera/composites';
import type { SettingControl } from '../../settings.type';

const settingInput = (control: SettingControl | undefined, value: unknown, onChange: (next: unknown) => void): SettingsInput | null => {
  if (control?.kind === 'choice' && typeof value === 'string') return { kind: 'segmented', value, options: control.options, onChange };
  if (control?.kind === 'range' && typeof value === 'number') {
    return { kind: 'slider', value, min: control.min, max: control.max, step: control.step, formatValue: control.format, onChange };
  }
  return typeof value === 'boolean' ? { kind: 'toggle', value, onChange } : null;
};

export { settingInput };
