/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WindowTitleBarCommandAction, WindowTitleBarDropdownAction, WindowTitleBarVolumeAction } from '@drizztdourden08/tessera/composites';
import type { TitleBarMenuGroup } from './title-bar-item.type';

type TitleBarCommandActionDef = Omit<WindowTitleBarCommandAction, 'label' | 'disabledReason' | 'status'> & {
  label: Text;
  disabledReason?: Text;
  status?: Text;
};

type TitleBarDropdownActionDef = Omit<WindowTitleBarDropdownAction, 'label' | 'groups'> & {
  label: Text;
  groups: readonly (TitleBarMenuGroup & { id: string })[];
};

type TitleBarVolumeActionDef = Omit<WindowTitleBarVolumeAction, 'label'> & { label: Text };

type TitleBarActionDef = TitleBarCommandActionDef | TitleBarDropdownActionDef | TitleBarVolumeActionDef;

export type { TitleBarActionDef, TitleBarVolumeActionDef };
