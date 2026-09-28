/* @layer renderer-shell @kind logic */
import { usePaletteStore } from './usePaletteStore';

const palette = {
  open: (): void => usePaletteStore.getState().show(),
  close: (): void => usePaletteStore.getState().hide(),
  toggle: (): void => usePaletteStore.getState().toggle(),
  isOpen: (): boolean => usePaletteStore.getState().open,
};

export { palette };
