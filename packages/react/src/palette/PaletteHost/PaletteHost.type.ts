/* @layer renderer-shell @kind types */
import type { CommandPaletteGroup, CommandPaletteItem } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../menu/menu.type';
import type { SearchAction } from '../../search/search.type';
import type { PalettePick, PickOption } from '../palette.type';

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

export type { LoadedScopes, PaletteConfirmProps, PaletteHostProps, PaletteItem, PaletteModel, PalettePreload, PickScopeModel, StartedScopes };
