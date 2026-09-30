/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { focusHubSearch } from '../../../hub/focus-hub-search';
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
        if (state.open || !focusHubSearch()) state.toggle();
        return;
      }
      if (event.key === 'Escape' && state.open) {
        claim(event);
        state.hide();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, []);
};

export { usePaletteShortcut };
