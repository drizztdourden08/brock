/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import type { CommandDef, CommandState } from './command.type';
import { defaultChords } from './default-chords';
import { normalizeChords } from './normalize-chords';

const without = (overrides: KeymapOverrides, id: string): KeymapOverrides =>
  Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== id));

const remapOverrides = (state: CommandState, def: CommandDef, chords: readonly string[] | null): KeymapOverrides => {
  const rest = without(state.overrides, def.id);
  if (chords === null) return rest;
  const next = normalizeChords(chords, state.mac);
  const defaults = defaultChords(def, state.mac);
  const same = next.length === defaults.length && next.every((chord, index) => chord === defaults[index]);
  return same ? rest : { ...rest, [def.id]: next };
};

export { remapOverrides };
