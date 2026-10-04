/* @layer renderer-shell @kind types */
import type { FlexJustify } from '@drizztdourden08/tessera/primitives';
import type { SettingAction } from '../../../settings.type';

interface SettingActionsProps {
  actions: readonly SettingAction[];
  disabled?: boolean;
  align?: FlexJustify;
}

export type { SettingActionsProps };
