/* @layer renderer-shell @kind types */
import type { ArgOption, ArgValue } from '../commands/command.type';

interface PaletteOpenOptions {
  query?: string;
  scope?: string;
}

interface PalettePick {
  title: string;
  options: readonly ArgOption[];
  onPick: (value: ArgValue) => void;
}

interface PaletteState {
  open: boolean;
  query: string;
  scope: string | null;
  picking: PalettePick | null;
  asking: string | null;
  show: (options?: PaletteOpenOptions) => void;
  hide: () => void;
  toggle: () => void;
  pick: (pick: PalettePick) => void;
  setQuery: (query: string) => void;
  ask: (id: string) => void;
  settle: () => void;
}

export type { PaletteOpenOptions, PalettePick, PaletteState };
