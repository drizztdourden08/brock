/* @layer renderer-shell @kind types */
import type { ProductConfig } from '@drizztdourden08/brock-core';
import type { MenuEntry } from '../menu/menu.type';
import type { RouteShortcut } from '../navigation/navigation.type';
import type { ResolvedScreenTree } from '../screens/conventions/screen-tree.type';
import type { SettingsControlProps, TabDef } from '../settings/settings.type';

type SettingsControlsValue = Pick<SettingsControlProps<object>, 'renderControl' | 'isDisabled' | 'lockCauseOf' | 'lockOverlay'>;

interface BrockContextValue {
  product: ProductConfig;
  home: string;
  tabs: TabDef<object>[];
  settingsControls: SettingsControlsValue;
  menu: MenuEntry[];
  homeScreen: string;
  shortcuts: readonly RouteShortcut[];
  screenTree: ResolvedScreenTree | null;
  logoSrc: string;
  instanceLogoSrc: string;
  moduleIds: readonly string[];
}

export type { BrockContextValue, SettingsControlsValue };
