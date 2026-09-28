/* @layer renderer-shell @kind types */
import type { ProductConfig } from '@drizztdourden08/brock-core';
import type { MenuEntry } from '../menu/menu.type';
import type { SettingsControlProps, TabDef } from '../settings/settings.type';

type SettingsControlsValue = Pick<SettingsControlProps<object>, 'renderControl' | 'isDisabled' | 'lockCauseOf' | 'lockOverlay'>;

interface BrockContextValue {
  product: ProductConfig;
  home: string;
  tabs: TabDef<object>[];
  settingsControls: SettingsControlsValue;
  menu: MenuEntry[];
  logoSrc: string;
}

export type { BrockContextValue, SettingsControlsValue };
