/* @layer renderer-shell @kind types */
import type { FlexJustify } from '@drizztdourden08/tessera/primitives';
import type { SettingAction, SettingValues } from '../../../settings.type';

interface SettingActionsProps {
  actions: readonly SettingAction[];
  disabled?: boolean;
  settings?: SettingValues;
  align?: FlexJustify;
}

export type { SettingActionsProps };
