/* @layer renderer-shell @kind hook */
import { usePaletteStore } from './usePaletteStore';

const usePaletteOpen = (): boolean => usePaletteStore((s) => s.open);

export { usePaletteOpen };
