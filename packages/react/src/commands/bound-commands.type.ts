/* @layer renderer-shell @kind logic */
import type { BoundArgs, ChordInput, CommandDef } from './command.type';

interface Wanted {
  base: CommandDef;
  bound: BoundArgs;
  chord?: ChordInput;
}

export type { Wanted };
