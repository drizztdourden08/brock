/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../search/search.type';
import type { ModulePorts } from '../platform/platform.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';
import type { WidgetDef } from '../widgets/widget.type';
import type { WidgetKitDef } from '../widgets/kits/widget-kit.type';
import type { RendererBootTask } from '../boot/renderer-boot.type';
import type { BeforeQuit, OnBeforeQuit } from '../quit/quit.type';
import type { TourDef } from '../tours/tour.type';
import type { VolumeSource } from '../volume/volume.type';
import type { CommandDef } from '../commands/command.type';

type TitleBarActionHook = () => WindowTitleBarAction | null;

type TitleBarActionSource = WindowTitleBarAction | TitleBarActionHook;

interface RendererModule {
  id: string;
  screens?: ScreenDef[];
  settingsTabs?: TabDef<object>[];
  menu?: MenuEntry[];
  Provider?: ComponentType<{ children: ReactNode }>;
  titleBarActions?: TitleBarActionSource[];
  searchActions?: SearchAction[];
  widgets?: WidgetDef[];
  widgetKits?: WidgetKitDef[];
  ports?: ModulePorts;
  logChannels?: string[];
  bootTasks?: RendererBootTask[];
  beforeQuit?: BeforeQuit;
  onBeforeQuit?: OnBeforeQuit;
  tours?: readonly TourDef[];
  volume?: VolumeSource;
  commands?: readonly CommandDef[];
}

interface MergedModules {
  ids: string[];
  screens: ScreenDef[];
  settingsTabs: TabDef<object>[];
  menu: MenuEntry[];
  providers: ComponentType<{ children: ReactNode }>[];
  titleBarActions: TitleBarActionSource[];
  searchActions: SearchAction[];
  widgets: WidgetDef[];
  widgetKits: WidgetKitDef[];
  ports: ModulePorts;
  logChannels: string[];
  bootTasks: RendererBootTask[];
  beforeQuit: BeforeQuit[];
  onBeforeQuit: OnBeforeQuit[];
  tours: TourDef[];
  volume?: VolumeSource;
  commands: CommandDef[];
}

export type { MergedModules, RendererModule, TitleBarActionHook, TitleBarActionSource };
