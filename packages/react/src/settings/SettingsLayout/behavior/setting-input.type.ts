/* @layer renderer-shell @kind types */
import type { SettingsInput } from '@drizztdourden08/tessera/composites';
import type { SettingControl, SettingControlKind } from '../../settings.type';

type SettingChange = (next: unknown) => void;

interface SettingInputRow {
  label: string;
  disabled: boolean;
}

type SettingInputOf<K extends SettingControlKind> = (
  control: Extract<SettingControl, { kind: K }>,
  value: unknown,
  onChange: SettingChange,
  row: SettingInputRow,
) => SettingsInput | null;

export type { SettingChange, SettingInputOf, SettingInputRow };
