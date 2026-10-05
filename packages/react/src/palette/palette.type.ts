/* @layer renderer-shell @kind types */
interface PaletteState {
  open: boolean;
  query: string;
  asking: string | null;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  ask: (id: string) => void;
  settle: () => void;
}

export type { PaletteState };
