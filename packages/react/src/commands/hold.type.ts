/* @layer renderer-shell @kind types */
import type { CommandContext, CommandDef, ParsedChord } from './command.type';

interface HoldEntry {
  def: CommandDef;
  context: CommandContext;
  chord: ParsedChord;
  keys: string[];
  since: number;
}

export type { HoldEntry };
