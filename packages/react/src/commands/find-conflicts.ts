/* @layer renderer-shell @kind logic */
import { chordsOf } from './chords-of';
import type { CommandConflict, CommandDef, CommandState } from './command.type';
import { listCommands } from './list-commands';

const overlaps = (a: CommandDef, b: CommandDef): boolean => a.scope === undefined || b.scope === undefined || a.scope === b.scope;

const findConflicts = (state: Omit<CommandState, 'persist'>): CommandConflict[] => {
  const byChord = new Map<string, CommandDef[]>();
  for (const def of listCommands(state)) {
    for (const chord of chordsOf(def, state)) byChord.set(chord, [...(byChord.get(chord) ?? []), def]);
  }
  return [...byChord].flatMap(([chord, defs]) => {
    const clashing = defs.filter((def) => defs.some((other) => other !== def && overlaps(def, other)));
    return clashing.length > 1 ? [{ chord, ids: clashing.map((def) => def.id) }] : [];
  });
};

export { findConflicts };
