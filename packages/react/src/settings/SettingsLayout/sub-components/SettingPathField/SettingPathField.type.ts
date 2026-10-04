/* @layer renderer-shell @kind types */
import type { SettingControl } from '../../../settings.type';

interface SettingPathFieldProps {
  control: Extract<SettingControl, { kind: 'path' }>;
  value: string;
  onChange: (next: string) => void;
  label: string;
  disabled: boolean;
}

export type { SettingPathFieldProps };
