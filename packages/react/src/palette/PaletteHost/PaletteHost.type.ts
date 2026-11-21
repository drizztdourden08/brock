/* @layer renderer-shell @kind types */
import type { CommandPaletteGroup, CommandPaletteItem } from '@drizztdourden08/tessera/composites';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntry } from '../../menu/menu.type';
import type { PaletteScope, SearchAction } from '../../search/search.type';
import type { PalettePick, PickOption, PickScope } from '../palette.type';

interface PaletteHostProps {
  menu: readonly MenuEntry[];
  actions?: readonly SearchAction[];
}

type PalettePreload = ((route: string) => void) | undefined;

interface PaletteItem extends CommandPaletteItem {
  run: () => void;
  confirm?: string | true;
  onCancel?: () => void;
}

interface PaletteConfirmProps {
  item: PaletteItem;
  armed: boolean;
  onArm: () => void;
  onConfirm: () => void;
  onSettle: () => void;
}

interface PaletteModel {
  open: boolean;
  query: string;
  setQuery: (query: string) => void;
  groups: readonly CommandPaletteGroup<PaletteItem>[];
  activeIndex: number | undefined;
  placeholder: string | undefined;
  runItem: (item: PaletteItem) => void;
  close: () => void;
}

interface ScopeModelInput {
  picking: PalettePick | null;
  active: PickScope | undefined;
  loaded: readonly PickOption[] | null;
  current: string | null;
  text: (value: Text) => string;
}

interface PaletteGroupsOptions {
  scope?: PaletteScope | null;
  preload?: PalettePreload;
  text?: (value: Text) => string;
}

interface PickScopeModel {
  options: readonly PickOption[];
  scope: string | null;
  placeholder: string | undefined;
}

interface LoadedScopes {
  owner: PalettePick | null;
  byScope: Readonly<Record<string, readonly PickOption[]>>;
}

interface StartedScopes {
  owner: PalettePick | null;
  ids: Set<string>;
}

interface ScopeKeyEvent {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export type { LoadedScopes, PaletteConfirmProps, PaletteHostProps, PaletteItem, PaletteModel, PaletteGroupsOptions, PalettePreload, PickScopeModel, ScopeModelInput, ScopeKeyEvent, StartedScopes };
