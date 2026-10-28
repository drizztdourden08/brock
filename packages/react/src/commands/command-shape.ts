/* @layer renderer-shell @kind logic */
import type { CommandData, CommandDef } from './command.type';

const commandShape = (defs: readonly CommandDef[]): string =>
  JSON.stringify(defs.map(({ run: _run, when, visible, reason, checked, hold, ...data }): CommandData => ({
    ...data,
    gated: when !== undefined,
    hideable: visible !== undefined,
    reasoned: reason !== undefined,
    checkable: checked !== undefined,
    holdable: hold !== undefined,
    ...(hold?.tapMs === undefined ? {} : { holdTapMs: hold.tapMs }),
  })));

export { commandShape };
