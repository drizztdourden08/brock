/* @layer renderer-shell @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ArgOption, ArgValue } from '../commands/command.type';

interface PaletteOpenOptions {
  query?: string;
  scope?: string;
}

interface PickOption extends ArgOption {
  description?: string;
  icon?: IconName;
  keywords?: readonly string[];
  group?: string;
}

interface PickScope {
  id: string;
  label: string;
  options: readonly PickOption[] | (() => Promise<readonly PickOption[]>);
}

interface PalettePick {
  title: string;
  options?: readonly PickOption[];
  scopes?: readonly PickScope[];
  scope?: string;
  onPick: (value: ArgValue, scope: string | null) => void;
}

interface PaletteState {
  open: boolean;
  query: string;
  scope: string | null;
  picking: PalettePick | null;
  pickScope: string | null;
  asking: string | null;
  show: (options?: PaletteOpenOptions) => void;
  hide: () => void;
  toggle: () => void;
  pick: (pick: PalettePick) => void;
  setPickScope: (id: string) => void;
  setQuery: (query: string) => void;
  ask: (id: string) => void;
  settle: () => void;
}

export type { PaletteOpenOptions, PalettePick, PaletteState, PickOption, PickScope };
