/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ProductConfig, ProfileStoreHooks } from '@drizztdourden08/brock-core';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import type { RendererModule, TitleBarSlot } from '../../modules/renderer-module.type';
import type { RendererBootTask } from '../../boot/renderer-boot.type';
import type { ScreenDef } from '../../screens/screen.type';
import type { ScreenRailGroup } from '../../shell/ScreenRail/ScreenRail.type';
import type { SettingsEffect } from '../../stores/settings-store.type';
import type { SettingsControlProps, TabDef } from '../../settings/settings.type';

type BrockAppLayout = 'menu' | 'rail';

type SettingsControls<S extends object> = Pick<SettingsControlProps<S>, 'renderControl' | 'isDisabled' | 'lockCauseOf' | 'lockOverlay'>;

interface BrockAppSettings<S extends object> extends SettingsControls<S> {
  defaults: S;
  tabs: TabDef<S>[];
  effects?: SettingsEffect<S>[];
}

interface BrockAppProps<S extends object> {
  product: ProductConfig;
  settings: BrockAppSettings<S>;
  screens: ScreenDef[];
  modules?: RendererModule[];
  bootTasks?: RendererBootTask[];
  home: string;
  menu?: MenuEntry[];
  layout?: BrockAppLayout;
  screenGroups?: ScreenRailGroup[];
  profileHooks?: ProfileStoreHooks;
  homeScreen?: string;
  credits?: ReactNode;
  legalText?: string;
}

interface MenuBuildInput {
  appMenu: readonly MenuEntry[];
  moduleMenu: readonly MenuEntry[];
  widgets: readonly MenuItem[];
  homeScreen: string;
  hasCredits: boolean;
  developerTools: boolean;
  onQuit: () => void;
  onDevConsole: () => void;
  onReportBug: () => void;
}

interface ReviewTourInput {
  ready: boolean;
  menu: readonly MenuEntry[];
  slots?: readonly TitleBarSlot[];
  moduleIds: readonly string[];
}

export type { BrockAppLayout, BrockAppProps, BrockAppSettings, MenuBuildInput, ReviewTourInput };
