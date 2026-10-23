/* @layer renderer-shell @kind logic */
import { chordsOf } from './chords-of';
import type { ChordEvent, CommandDef, CommandLookup, CommandState } from './command.type';
import { listCommands } from './list-commands';
import { matchesChord } from './matches-chord';
import { parseChord } from './parse-chord';

const inScope = (def: CommandDef, route: string | null): boolean => def.scope === undefined || def.scope === route;

const typingAllowed = (def: CommandDef, chord: string, mac: boolean): boolean => {
  if (def.whileTyping !== undefined) return def.whileTyping;
  const parsed = parseChord(chord, mac);
  return parsed !== null && (parsed.ctrl || parsed.meta);
};

const fires = (def: CommandDef, event: ChordEvent, state: CommandState, typing: boolean): boolean => {
  const chord = chordsOf(def, state).find((each) => matchesChord(event, each, state.mac));
  if (chord === undefined) return false;
  if (typing && !typingAllowed(def, chord, state.mac)) return false;
  return def.when?.() !== false;
};

const findCommand = (event: ChordEvent, state: CommandState, lookup: CommandLookup): CommandDef | undefined => {
  const hits = listCommands(state).filter((def) => inScope(def, lookup.route) && fires(def, event, state, lookup.typing));
  return hits.find((def) => def.scope !== undefined) ?? hits[0];
};

export { findCommand };
