/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { listCommands } from '../commands/list-commands';
import { useChordLookup } from '../commands/useChordLookup';
import { useCommandState } from '../commands/useCommandState';
import type { MenuBarView } from './menu-bar.type';

const useMenuBarView = (): MenuBarView => {
  const state = useCommandState();
  const chords = useChordLookup();
  return useMemo(() => ({ defs: new Map(listCommands(state).map((def) => [def.id, def])), chords }), [state, chords]);
};

export { useMenuBarView };
