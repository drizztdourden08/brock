/* @layer renderer-shell @kind logic */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import { bindingKey } from './binding-key';
import { chordsOf } from './chords-of';
import { COMMAND_RANKS, UNKNOWN_REASON } from './commands.constants';
import { commandBlock } from './command-block';
import { commandVisible } from './command-visible';
import type { ArgValue, ChordEvent, CommandBinding, CommandConflict, CommandContext, CommandDef, CommandDescription, CommandRunResult, HeldModifier } from './command.type';
import { findConflicts } from './find-conflicts';
import { tapHold } from './tap-hold';
import { listCommands } from './list-commands';
import { matchesChord } from './matches-chord';
import { currentModifiers } from './current-modifiers';
import { normalizeChords } from './normalize-chords';
import { parseBindingKey } from './parse-binding-key';
import { remapOverrides } from './remap-overrides';
import { setCommandSource } from './set-command-source';
import { useCommandStore } from './useCommandStore';
import { validateArgs } from './validate-args';

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

const unbound = (key: string): KeymapOverrides =>
  Object.fromEntries(Object.entries(useCommandStore.getState().overrides).filter(([name]) => name !== key));

const bind = (id: string, args: Readonly<Record<string, ArgValue>>, chords: readonly string[]): string | null => {
  const def = find(id);
  if (def?.args === undefined) return 'This command takes no arguments.';
  const problem = validateArgs(def.args, args);
  if (problem !== null) return problem;
  const key = bindingKey(id, args);
  const next = normalizeChords(chords, useCommandStore.getState().mac);
  write(next.length === 0 ? unbound(key) : { ...useCommandStore.getState().overrides, [key]: next });
  return null;
};

const bindings = (id?: string): CommandBinding[] =>
  Object.entries(useCommandStore.getState().overrides).flatMap(([key, chords]) => {
    const bound = parseBindingKey(key);
    return bound === null || (id !== undefined && bound.id !== id) || find(bound.id) === undefined ? [] : [{ ...bound, chords }];
  });

const commands = {
  register: (defs: readonly CommandDef[]): (() => void) => {
    registered += 1;
    return setCommandSource(`runtime-${registered}`, COMMAND_RANKS.runtime, defs);
  },
  list: (options: { includeHidden?: boolean } = {}): CommandDef[] =>
    listCommands(useCommandStore.getState()).filter((def) => def.bound === undefined && (options.includeHidden === true || commandVisible(def))),
  describe: (id: string): CommandDescription => {
    const def = find(id);
    if (def === undefined) return { enabled: false, visible: false, reason: UNKNOWN_REASON, checked: false };
    const block = commandBlock(def);
    return { enabled: block === null, visible: commandVisible(def), reason: block?.reason ?? null, checked: def.checked?.() === true };
  },
  run: async (id: string, context?: CommandContext): Promise<CommandRunResult> => {
    const def = find(id);
    if (def === undefined) return { ok: false, why: 'unknown', reason: UNKNOWN_REASON };
    const block = commandBlock(def);
    if (block !== null) return { ok: false, ...block };
    const problem = def.args === undefined ? null : validateArgs(def.args, context?.args);
    if (problem !== null) return { ok: false, why: 'invalid', reason: problem };
    await def.run(context);
    tapHold(def, context);
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
  bind,
  unbind: (id: string, args: Readonly<Record<string, ArgValue>>): void => write(unbound(bindingKey(id, args))),
  bindings,
  heldModifiers: (event?: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>): HeldModifier[] => currentModifiers(event),
  conflicts: (): CommandConflict[] => findConflicts(useCommandStore.getState()),
};

export { commands };
