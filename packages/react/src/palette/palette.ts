/* @layer renderer-shell @kind logic */
import type { PaletteOpenOptions, PalettePick } from './palette.type';
import { usePaletteStore } from './usePaletteStore';

const palette = {
  open: (options?: PaletteOpenOptions): void => usePaletteStore.getState().show(options),
  close: (): void => usePaletteStore.getState().hide(),
  toggle: (): void => usePaletteStore.getState().toggle(),
  pick: (pick: PalettePick): void => usePaletteStore.getState().pick(pick),
  isOpen: (): boolean => usePaletteStore.getState().open,
};

export { palette };
