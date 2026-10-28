/* @layer renderer-shell @kind logic */
import { chordsOf } from './chords-of';
import type { CommandConflict, CommandDef, CommandState } from './command.type';
import { listCommands } from './list-commands';

const findShared = (state: Omit<CommandState, 'persist'>): CommandConflict[] => {
  const byChord = new Map<string, CommandDef[]>();
  for (const def of listCommands(state)) {
    if (def.only === undefined) continue;
    for (const chord of chordsOf(def, state)) byChord.set(chord, [...(byChord.get(chord) ?? []), def]);
  }
  return [...byChord].flatMap(([chord, defs]) =>
    (new Set(defs.map((def) => def.only)).size > 1 ? [{ chord, ids: defs.map((def) => def.id) }] : []));
};

export { findShared };
