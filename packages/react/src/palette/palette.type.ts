/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MenuEntry } from '../menu/menu.type';
import type { ScreenDef } from '../screens/screen.type';
import type { TabDef } from '../settings/settings.type';

type SearchKind = 'screen' | 'tab' | 'action' | 'setting';

interface SearchToggle {
  value: boolean;
  flip: () => void;
}

interface SearchEntry {
  id: string;
  kind: SearchKind;
  label: string;
  icon?: ReactNode;
  breadcrumb: string[];
  description?: string;
  keywords?: string;
  disabled?: boolean;
  checked?: boolean;
  toggle?: SearchToggle;
  run: () => void;
}

interface SearchAction {
  id: string;
  label: string;
  run: () => void;
  icon?: ReactNode;
  group?: string;
  description?: string;
  keywords?: string;
  disabled?: boolean;
  checked?: boolean;
}

interface CatalogInput {
  menu: readonly MenuEntry[];
  screens: readonly ScreenDef[];
  home: string;
  tabs: readonly TabDef<object>[];
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

interface PaletteState {
  open: boolean;
  query: string;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
}

interface SearchActionState {
  actions: SearchAction[];
  add: (actions: readonly SearchAction[]) => () => void;
}

export type {
  CatalogInput, FieldWeights, PaletteState, SearchAction, SearchActionState, SearchEntry, SearchKind, SearchToggle,
};
