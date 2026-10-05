/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { PALETTE_KEY } from '../../palette.constants';
import { usePaletteStore } from '../../usePaletteStore';

const isPaletteChord = (event: KeyboardEvent): boolean =>
  (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === PALETTE_KEY;

const claim = (event: KeyboardEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};

const usePaletteShortcut = (): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      const state = usePaletteStore.getState();
      if (isPaletteChord(event)) {
        claim(event);
        state.toggle();
        return;
      }
      if (event.key !== 'Escape' || !state.open) return;
      claim(event);
      if (state.asking === null) state.hide();
      else state.settle();
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, []);
};

export { usePaletteShortcut };
