/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';

type SearchKind = 'screen' | 'page' | 'tab' | 'section' | 'setting' | 'entry' | 'widget' | 'action';

type SearchFileKind = 'hero' | 'page' | 'page-meta' | 'tab' | 'sub' | 'settings' | 'custom' | 'card' | 'layer' | 'base';

interface SearchTarget {
  route: string;
  anchor?: string;
  params?: ScreenParams;
}

interface SearchToggle {
  value: boolean;
  flip: () => void;
}

interface SearchEntry {
  id: string;
  kind: SearchKind;
  label: string;
  keywords: readonly string[];
  breadcrumb: readonly string[];
  target?: SearchTarget;
  icon?: ReactNode;
  description?: string;
  hint?: string;
  devOnly?: boolean;
  disabled?: boolean;
  checked?: boolean;
  toggle?: SearchToggle;
  run?: () => void;
}

interface SearchEntrySeed {
  label: string;
  id?: string;
  params?: ScreenParams;
  keywords?: readonly string[];
  anchor?: string;
  description?: string;
}

interface SearchRowSeed {
  key: string;
  label: string;
  description?: string;
  hint?: string;
  keywords?: readonly string[];
}

interface SearchSectionSeed {
  id: string;
  title: string;
  sub?: string;
  rows?: readonly SearchRowSeed[];
}

interface SearchFileSeed {
  kind: SearchFileKind;
  id: string;
  bucket?: string;
  group?: string;
  page?: string;
  title?: string;
  icon?: string;
  keywords?: readonly string[];
  devOnly?: boolean;
  path?: string;
  sections?: readonly SearchSectionSeed[];
  entries?: readonly SearchEntrySeed[];
}

interface SeedPlace {
  bucket: string;
  crumbs: string[];
}

interface SearchAction {
  id: string;
  label: string;
  run: () => void;
  icon?: ReactNode;
  group?: string;
  description?: string;
  keywords?: string | readonly string[];
  disabled?: boolean;
  checked?: boolean;
}

interface SettingsPlace {
  bucket: string | null;
  title: string;
}

interface CatalogInput {
  index: readonly SearchEntry[];
  live: readonly SearchEntry[];
  menu: readonly MenuEntry[];
  widgets: readonly MenuItem[];
  screens: readonly ScreenDef[];
  home: string;
  tabs: readonly TabDef<object>[];
  settingsPlace: SettingsPlace;
  settings: object | null;
  patch: (patch: Record<string, unknown>) => void;
  actions: readonly SearchAction[];
  isDev: boolean;
  isMobile: boolean;
  hasProfile: boolean;
}

interface FieldWeights {
  exact: number;
  prefix: number;
  wordStart: number;
  substring: number;
}

interface RankedInScope {
  inScope: SearchEntry[];
  rest: SearchEntry[];
}

interface PaletteScope {
  bucket: string;
  title: string;
}

interface SearchActionState {
  actions: SearchAction[];
  add: (actions: readonly SearchAction[]) => () => void;
}

interface LiveSearchState {
  entries: SearchEntry[];
  add: (entries: readonly SearchEntry[]) => () => void;
}

export type {
  CatalogInput, FieldWeights, LiveSearchState, PaletteScope, RankedInScope, SearchAction, SearchActionState, SearchEntry, SearchEntrySeed, SearchFileKind, SearchFileSeed,
  SearchKind, SearchRowSeed, SearchSectionSeed, SearchTarget, SearchToggle, SeedPlace, SettingsPlace,
};
