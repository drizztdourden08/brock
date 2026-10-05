/* @layer renderer-shell @kind types */
import type { CommandPaletteGroup, CommandPaletteItem } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../../menu/menu.type';
import type { SearchAction } from '../../search/search.type';

interface PaletteHostProps {
  menu: readonly MenuEntry[];
  actions?: readonly SearchAction[];
}

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
  runItem: (item: PaletteItem) => void;
  close: () => void;
}

export type { PaletteConfirmProps, PaletteHostProps, PaletteItem, PaletteModel };
