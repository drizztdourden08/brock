/* @layer renderer-shell @kind logic */
import { COMMAND_RANKS } from './commands.constants';
import type { CommandDef } from './command.type';
import { defaultChords } from './default-chords';
import type { ListState } from './list-commands.type';

const appChords = (defs: readonly CommandDef[], builtIn: ReadonlySet<CommandDef>, state: ListState): Set<string> =>
  new Set(defs.filter((def) => !builtIn.has(def)).flatMap((def) => state.overrides[def.id] ?? defaultChords(def, state.mac)));

const yielding = (def: CommandDef, taken: ReadonlySet<string>, state: ListState): CommandDef => {
  if (state.overrides[def.id] !== undefined) return def;
  const chords = defaultChords(def, state.mac);
  const kept = chords.filter((chord) => !taken.has(chord));
  return kept.length === chords.length ? def : { ...def, chord: kept };
};

const listCommands = (state: ListState): CommandDef[] => {
  const seen = new Set<string>();
  const ranked = [...state.sources].sort((a, b) => a.rank - b.rank);
  const defs = ranked.flatMap((source) => source.defs).filter((def) => {
    if (seen.has(def.id)) return false;
    seen.add(def.id);
    return true;
  });
  const builtIn = new Set(state.sources.filter((source) => source.rank === COMMAND_RANKS.brock).flatMap((source) => source.defs));
  const taken = appChords(defs, builtIn, state);
  return defs.map((def) => (builtIn.has(def) ? yielding(def, taken, state) : def));
};

export { listCommands };
