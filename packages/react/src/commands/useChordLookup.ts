/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { chordsOf } from './chords-of';
import type { ChordLookup } from './command.type';
import { listCommands } from './list-commands';
import { useCommandState } from './useCommandState';

const useChordLookup = (): ChordLookup => {
  const state = useCommandState();
  return useMemo(() => {
    const defs = new Map(listCommands(state).map((def) => [def.id, def]));
    return (id: string) => {
      const def = defs.get(id);
      return def === undefined ? undefined : chordsOf(def, state);
    };
  }, [state]);
};

export { useChordLookup };
