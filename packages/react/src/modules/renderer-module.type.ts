/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../search/search.type';
import type { ModulePorts } from '../platform/platform.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';
import type { WidgetDef } from '../widgets/widget.type';
import type { RendererBootTask } from '../boot/renderer-boot.type';
import type { BeforeQuit } from '../quit/quit.type';

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
  ports?: ModulePorts;
  logChannels?: string[];
  bootTasks?: RendererBootTask[];
  beforeQuit?: BeforeQuit;
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
  ports: ModulePorts;
  logChannels: string[];
  bootTasks: RendererBootTask[];
  beforeQuit: BeforeQuit[];
}

export type { MergedModules, RendererModule, TitleBarActionHook, TitleBarActionSource };
