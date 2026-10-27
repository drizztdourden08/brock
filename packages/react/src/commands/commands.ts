/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import { chordsOf } from './chords-of';
import { COMMAND_RANKS, UNKNOWN_REASON } from './commands.constants';
import { commandBlock } from './command-block';
import type { ChordEvent, CommandConflict, CommandContext, CommandDef, CommandDescription, CommandRunResult } from './command.type';
import { findConflicts } from './find-conflicts';
import { listCommands } from './list-commands';
import { matchesChord } from './matches-chord';
import { remapOverrides } from './remap-overrides';
import { setCommandSource } from './set-command-source';
import { useCommandStore } from './useCommandStore';

let registered = 0;

const find = (id: string): CommandDef | undefined => listCommands(useCommandStore.getState()).find((def) => def.id === id);

const write = (overrides: KeymapOverrides): void => {
  useCommandStore.setState({ overrides });
  useCommandStore.getState().persist?.(overrides);
};

const remap = (id: string, chords: readonly string[] | null): void => {
  const def = find(id);
  if (def !== undefined) write(remapOverrides(useCommandStore.getState(), def, chords));
};

const commands = {
  register: (defs: readonly CommandDef[]): (() => void) => {
    registered += 1;
    return setCommandSource(`runtime-${registered}`, COMMAND_RANKS.runtime, defs);
  },
  list: (): CommandDef[] => listCommands(useCommandStore.getState()),
  describe: (id: string): CommandDescription => {
    const def = find(id);
    if (def === undefined) return { enabled: false, reason: UNKNOWN_REASON, checked: false };
    const block = commandBlock(def);
    return { enabled: block === null, reason: block?.reason ?? null, checked: def.checked?.() === true };
  },
  run: async (id: string, context?: CommandContext): Promise<CommandRunResult> => {
    const def = find(id);
    if (def === undefined) return { ok: false, why: 'unknown', reason: UNKNOWN_REASON };
    const block = commandBlock(def);
    if (block !== null) return { ok: false, ...block };
    await def.run(context);
    return { ok: true };
  },
  chords: (id: string): readonly string[] => {
    const def = find(id);
    return def === undefined ? [] : chordsOf(def, useCommandStore.getState());
  },
  matches: (id: string, event: ChordEvent): boolean => {
    const { mac } = useCommandStore.getState();
    return commands.chords(id).some((chord) => matchesChord(event, chord, mac));
  },
  remap: (id: string, chords: readonly string[]): void => remap(id, chords),
  reset: (id?: string): void => {
    if (id === undefined) write({});
    else remap(id, null);
  },
  conflicts: (): CommandConflict[] => findConflicts(useCommandStore.getState()),
};

export { commands };
