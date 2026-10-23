/* @layer renderer-shell @kind logic */
import type { CommandDef, CommandState } from './command.type';
import { defaultChords } from './default-chords';

const chordsOf = (def: CommandDef, state: Pick<CommandState, 'overrides' | 'mac'>): readonly string[] =>
  state.overrides[def.id] ?? defaultChords(def, state.mac);

export { chordsOf };
