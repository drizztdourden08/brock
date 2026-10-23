/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useEscapeStack } from '@drizztdourden08/tessera/primitives';
import { capturingChord } from '../../../commands/capturing-chord';
import { commands } from '../../../commands/commands';
import { BROCK_COMMANDS } from '../../../commands/commands.constants';
import { usePaletteStore } from '../../usePaletteStore';

const claim = (event: KeyboardEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};

const hide = (): void => usePaletteStore.getState().hide();

const usePaletteShortcut = (): void => {
  const open = usePaletteStore((s) => s.open);
  useEscapeStack({ level: 'dialog', onEscape: hide, active: open });

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (capturingChord(event.target) || !commands.matches(BROCK_COMMANDS.search, event)) return;
      claim(event);
      usePaletteStore.getState().toggle();
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, []);
};

export { usePaletteShortcut };
