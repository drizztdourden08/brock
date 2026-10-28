/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import type { CommandContext } from '../src/commands/command.type';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { validateArgs } from '../src/commands/validate-args';
import { palette } from '../src/palette/palette';
import { runWithPicker } from '../src/palette/run-with-picker';
import { usePaletteStore } from '../src/palette/usePaletteStore';
import { useCommandStore } from '../src/commands/useCommandStore';
import { registerFresh } from './command-fixtures';

const SCHEMA = {
  id: { type: 'string', label: 'Preset', options: [{ value: 'soft', label: 'Soft' }, { value: 'hard', label: 'Hard' }] },
  size: { type: 'number', min: 1, max: 9, optional: true },
} as const;

describe('argument schemas', () => {
  it('accepts valid arguments and names the first problem otherwise', () => {
    expect(validateArgs(SCHEMA, { id: 'soft', size: 3 })).toBeNull();
    expect(validateArgs(SCHEMA, { id: 'soft' })).toBeNull();
    expect(validateArgs(SCHEMA, {})).toBe('id is required.');
    expect(validateArgs(SCHEMA, { id: 'odd' })).toBe('id is not one of the allowed values.');
    expect(validateArgs(SCHEMA, { id: 'soft', size: 12 })).toBe('size must be at most 9.');
    expect(validateArgs(SCHEMA, { id: 'soft', size: 'x' })).toBe('size must be a number.');
    expect(validateArgs(SCHEMA, { id: 'soft', extra: 1 })).toBe('extra is not an argument of this command.');
    expect(validateArgs(SCHEMA, 4)).toBe('The arguments must be an object.');
  });
});

describe('commands with bound arguments', () => {
  const seen: CommandContext[] = [];
  let unregister = (): void => {};

  beforeEach(() => {
    seen.length = 0;
    unregister = registerFresh([
      { id: 'tool.apply', label: 'Apply preset', args: SCHEMA, run: (context) => { if (context !== undefined) seen.push(context); } },
      { id: 'tool.plain', label: 'Plain', run: () => undefined },
    ]);
  });

  afterEach(() => {
    unregister();
    usePaletteStore.getState().hide();
  });

  const ctx = (args: unknown): CommandContext => ({ point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: undefined, args });

  it('refuses a run with bad arguments and runs with good ones', async () => {
    await expect(commands.run('tool.apply', ctx({ id: 'odd' }))).resolves.toMatchObject({ ok: false, why: 'invalid' });
    await expect(commands.run('tool.apply')).resolves.toMatchObject({ ok: false, why: 'invalid', reason: 'id is required.' });
    await expect(commands.run('tool.apply', ctx({ id: 'hard' }))).resolves.toEqual({ ok: true });
    expect(seen).toHaveLength(1);
  });

  it('binds a chord to fixed arguments, runs it with them and lists the binding', () => {
    expect(commands.bind('tool.apply', { id: 'hard' }, ['Mod+2'])).toBeNull();
    expect(commands.bindings('tool.apply')).toEqual([{ id: 'tool.apply', args: { id: 'hard' }, chords: ['Mod+2'] }]);
    const handled = dispatchCommand(new KeyboardEvent('keydown', { key: '2', code: 'Digit2', ctrlKey: true, cancelable: true }), null);
    expect(handled).toBe(true);
    expect(seen).toMatchObject([{ args: { id: 'hard' }, trigger: 'keyboard' }]);
  });

  it('keeps the binding in the keymap overrides so it is saved and restored', () => {
    const saved: unknown[] = [];
    useCommandStore.setState({ persist: (overrides) => { saved.push(overrides); } });
    commands.bind('tool.apply', { id: 'soft' }, ['Mod+1']);
    expect(saved).toEqual([{ 'tool.apply#{"id":"soft"}': ['Mod+1'] }]);
    useCommandStore.setState({ overrides: saved[0] as Record<string, readonly string[]> });
    expect(commands.bindings()).toMatchObject([{ args: { id: 'soft' } }]);
    commands.unbind('tool.apply', { id: 'soft' });
    expect(commands.bindings()).toEqual([]);
    expect(commands.chords('tool.apply')).toEqual([]);
  });

  it('refuses a binding with bad arguments or on a command without a schema', () => {
    expect(commands.bind('tool.apply', { id: 'odd' }, ['Mod+3'])).toBe('id is not one of the allowed values.');
    expect(commands.bind('tool.plain', {}, ['Mod+3'])).toBe('This command takes no arguments.');
    expect(commands.bindings()).toEqual([]);
  });

  it('asks the palette for a missing option value and runs with the pick', async () => {
    await runWithPicker('tool.apply');
    const { picking, open } = usePaletteStore.getState();
    expect(open).toBe(true);
    expect(picking?.options.map((option) => option.label)).toEqual(['Soft', 'Hard']);
    picking?.onPick('hard');
    await Promise.resolve();
    expect(seen).toMatchObject([{ args: { id: 'hard' } }]);
  });
});

describe('opening the palette with a query and a scope', () => {
  afterEach(() => palette.close());

  it('sets the query and the scope, and clears both on close', () => {
    palette.open({ query: 'fill', scope: 'library' });
    expect(usePaletteStore.getState()).toMatchObject({ open: true, query: 'fill', scope: 'library' });
    palette.close();
    expect(usePaletteStore.getState()).toMatchObject({ open: false, query: '', scope: null });
  });

  it('keeps the query when opened again without options', () => {
    palette.open({ query: 'fill' });
    palette.open();
    expect(usePaletteStore.getState().query).toBe('fill');
  });
});
