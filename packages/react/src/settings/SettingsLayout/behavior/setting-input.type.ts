/* @layer renderer-shell @kind types */
import type { SettingsInput } from '@drizztdourden08/tessera/composites';
import type { SettingControl, SettingControlKind } from '../../settings.type';

type SettingChange = (next: unknown) => void;

type SettingInputOf<K extends SettingControlKind> = (control: Extract<SettingControl, { kind: K }>, value: unknown, onChange: SettingChange) => SettingsInput | null;

export type { SettingChange, SettingInputOf };
