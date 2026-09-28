/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../palette/palette.type';
import type { ModulePorts } from '../platform/platform.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';
import type { WidgetDef } from '../widgets/widget.type';

type TitleBarSlot = ComponentType;

interface RendererModule {
  id: string;
  screens?: ScreenDef[];
  settingsTabs?: TabDef<object>[];
  menu?: MenuEntry[];
  Provider?: ComponentType<{ children: ReactNode }>;
  titleBar?: TitleBarSlot[];
  searchActions?: SearchAction[];
  widgets?: WidgetDef[];
  ports?: ModulePorts;
  logChannels?: string[];
}

interface MergedModules {
  screens: ScreenDef[];
  settingsTabs: TabDef<object>[];
  menu: MenuEntry[];
  providers: ComponentType<{ children: ReactNode }>[];
  titleBar: TitleBarSlot[];
  searchActions: SearchAction[];
  widgets: WidgetDef[];
  ports: ModulePorts;
  logChannels: string[];
}

export type { MergedModules, RendererModule, TitleBarSlot };
