/* @layer renderer-shell @kind types */
interface PaletteState {
  open: boolean;
  query: string;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
}

export type { PaletteState };
