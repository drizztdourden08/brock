/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntry, MenuItem } from '../menu/menu.type';
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';
import type { ShowContext } from '../screens/show/show.type';

type SearchKind = 'screen' | 'page' | 'tab' | 'section' | 'setting' | 'entry' | 'widget' | 'action';

type SearchFileKind = 'hero' | 'page' | 'page-meta' | 'tab' | 'sub' | 'live' | 'settings' | 'custom' | 'card' | 'layer' | 'base';

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
  confirm?: string | true;
  onCancel?: () => void;
  run?: () => void;
}

type IndexEntry = Omit<SearchEntry, 'label' | 'keywords' | 'breadcrumb' | 'description' | 'hint'> & {
  label: Text;
  keywords: readonly Text[];
  breadcrumb: readonly Text[];
  description?: Text;
  hint?: Text;
};

interface SearchEntrySeed {
  label: Text;
  id?: string;
  params?: ScreenParams;
  keywords?: readonly Text[];
  anchor?: string;
  description?: Text;
}

interface SearchRowSeed {
  key: string;
  label: Text;
  description?: Text;
  hint?: Text;
  keywords?: readonly Text[];
}

interface SearchSectionSeed {
  id: string;
  title: Text;
  sub?: Text;
  rows?: readonly SearchRowSeed[];
}

interface SearchFileSeed {
  kind: SearchFileKind;
  id: string;
  bucket?: string;
  group?: string;
  page?: string;
  title?: Text;
  icon?: string;
  keywords?: readonly Text[];
  devOnly?: boolean;
  path?: string;
  sections?: readonly SearchSectionSeed[];
  entries?: readonly SearchEntrySeed[];
}

interface SeedPlace {
  bucket: string;
  crumbs: Text[];
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
  text?: (value: Text) => string;
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
  hidden?: ReadonlySet<string>;
  show?: ShowContext;
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
  entries: IndexEntry[];
  add: (entries: readonly IndexEntry[]) => () => void;
}

export type {
  CatalogInput, FieldWeights, IndexEntry, LiveSearchState, PaletteScope, RankedInScope, SearchAction, SearchActionState, SearchEntry, SearchEntrySeed, SearchFileKind, SearchFileSeed,
  SearchKind, SearchRowSeed, SearchSectionSeed, SearchTarget, SearchToggle, SeedPlace, SettingsPlace,
};
