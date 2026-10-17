/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SideNavConfig } from '@drizztdourden08/tessera/composites';
import type { SettingsControlProps, TabDef } from '../settings.type';

interface SettingsHubProps<S extends object> extends SettingsControlProps<S> {
  tabs: readonly TabDef<S>[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  backdrop?: ReactNode;
  searchPlaceholder?: string;
  homeTabId?: string;
  className?: string;
}

interface TabMatches<S extends object> {
  withRows: { tab: TabDef<S>; count: number }[];
  byName: TabDef<S>[];
  total: number;
}

interface HubNavGroup<S extends object> {
  id: string;
  label: string;
  items: TabDef<S>[];
}

interface HubNavModel<S extends object> {
  navConfig: SideNavConfig;
  visibleTabs: TabDef<S>[];
  home: TabDef<S> | null;
}

export type { HubNavGroup, HubNavModel, SettingsHubProps, TabMatches };
