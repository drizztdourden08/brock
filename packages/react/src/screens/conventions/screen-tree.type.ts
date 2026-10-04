/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { HubDef, HubTab } from '../../hub/hub.type';
import type { MenuEntry } from '../../menu/menu.type';
import type { RouteAlias, RouteShortcut } from '../../navigation/navigation.type';
import type { SearchEntry } from '../../search/search.type';
import type { Section, TabDef } from '../../settings/settings.type';
import type { ScreenDef } from '../screen.type';
import type { CardProps, HeroProps, PageProps } from '../kinds/screen-kinds.type';
import type { ScreenMeta, ScreensConfig } from './screens-config.type';

type SettingsSource = readonly Section[] | ((settings: never) => Section[]);

interface EntryBase {
  id: string;
  meta?: ScreenMeta;
}

interface HeroEntry extends EntryBase {
  kind: 'hero';
  bucket: string;
  component: ComponentType<HeroProps>;
}

interface PageEntry extends EntryBase {
  kind: 'page';
  bucket: string;
  group?: string;
  component: ComponentType<PageProps>;
}

interface FreePageEntry extends EntryBase {
  kind: 'custom';
  bucket: string;
  group?: string;
  component: ComponentType<PageProps>;
}

interface TabEntry extends EntryBase {
  kind: 'tab';
  bucket: string;
  group?: string;
  page: string;
  component: ComponentType<PageProps>;
}

interface PageMetaEntry extends EntryBase {
  kind: 'page-meta';
  bucket: string;
  group?: string;
}

interface SettingsEntry extends EntryBase {
  kind: 'settings';
  bucket: string;
  group?: string;
  sections: SettingsSource;
}

interface CardEntry extends EntryBase {
  kind: 'card' | 'layer';
  component: ComponentType<CardProps>;
}

type BucketEntry = HeroEntry | PageEntry | FreePageEntry | TabEntry | PageMetaEntry | SettingsEntry;

type ScreenEntry = BucketEntry | CardEntry;

interface ScreenTree {
  config: ScreensConfig;
  hubs: HubDef[];
  screens: ScreenDef[];
  tabs: TabDef<object>[];
  shortcuts: RouteShortcut[];
  search: readonly SearchEntry[];
}

interface ResolvedScreenTree {
  home: string;
  settingsBucket: string;
  hubs: HubDef[];
  screens: ScreenDef[];
  tabs: TabDef<object>[];
  menu: MenuEntry[];
  shortcuts: RouteShortcut[];
  settingsAlias: RouteAlias;
  search: readonly SearchEntry[];
}

interface OrderedTab extends HubTab {
  order: number;
}

interface PlacedPage {
  group: string | null;
  order: number;
  page: HubDef['home'];
}

export type {
  BucketEntry, CardEntry, FreePageEntry, EntryBase, HeroEntry, OrderedTab, PageEntry, PageMetaEntry, PlacedPage, ResolvedScreenTree, ScreenEntry, ScreenTree, SettingsEntry, SettingsSource,
  TabEntry,
};
