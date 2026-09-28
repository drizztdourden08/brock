/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { MenuEntry } from '../menu/menu.type';
import type { ModulePorts } from '../platform/platform.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';

interface RendererModule {
  id: string;
  screens?: ScreenDef[];
  settingsTabs?: TabDef<object>[];
  menu?: MenuEntry[];
  Provider?: ComponentType<{ children: ReactNode }>;
  ports?: ModulePorts;
  logChannels?: string[];
}

interface MergedModules {
  screens: ScreenDef[];
  settingsTabs: TabDef<object>[];
  menu: MenuEntry[];
  providers: ComponentType<{ children: ReactNode }>[];
  ports: ModulePorts;
  logChannels: string[];
}

export type { MergedModules, RendererModule };
