/* @layer renderer-shell @kind logic */
import type { CommandData, CommandDef } from './command.type';

const commandShape = (defs: readonly CommandDef[]): string =>
  JSON.stringify(defs.map(({ run: _run, when, ...data }): CommandData => ({ ...data, gated: when !== undefined })));

export { commandShape };
