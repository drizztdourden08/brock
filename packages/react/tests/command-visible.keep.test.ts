/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commandGroups } from '../src/commands/command-groups';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { findShared } from '../src/commands/find-shared';
import { useCommandStore } from '../src/commands/useCommandStore';
import { listCommands } from '../src/commands/list-commands';
import { registerFresh } from './command-fixtures';

const groupedIds = (): string[] => commandGroups(listCommands(useCommandStore.getState())).flatMap((group) => group.commands.map((def) => def.id));

const press = (init: KeyboardEventInit): boolean => dispatchCommand(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }), null);

describe('hidden commands', () => {
  const ran: string[] = [];
  let surface = 'map';
  let unregister = (): void => {};
  const run = (id: string) => () => { ran.push(id); };

  beforeEach(() => {
    ran.length = 0;
    surface = 'map';
    unregister = registerFresh([
      { id: 'stamp.flip', label: 'Flip stamp', chord: 'Alt+X', only: 'map', visible: () => surface === 'map', run: run('stamp.flip') },
      { id: 'brush.flip', label: 'Flip brush', chord: 'Alt+X', only: 'sprite', visible: () => surface === 'sprite', run: run('brush.flip') },
      { id: 'plain', label: 'Plain', run: run('plain') },
      { id: 'why', label: 'Why', visible: () => false, reason: () => 'Only on a map.', run: run('why') },
    ]);
  });

  afterEach(() => unregister());

  it('does not fire a hidden command and fires the visible one on the same chord', () => {
    expect(press({ key: 'x', code: 'KeyX', altKey: true })).toBe(true);
    expect(ran).toEqual(['stamp.flip']);
    surface = 'sprite';
    press({ key: 'x', code: 'KeyX', altKey: true });
    expect(ran).toEqual(['stamp.flip', 'brush.flip']);
    surface = 'none';
    expect(press({ key: 'x', code: 'KeyX', altKey: true })).toBe(false);
  });

  it('refuses to run a hidden command and says hidden', async () => {
    await expect(commands.run('why')).resolves.toEqual({ ok: false, why: 'hidden', reason: 'Only on a map.' });
    expect(ran).not.toContain('why');
  });

  it('describes a hidden command as not visible and not enabled', () => {
    expect(commands.describe('why')).toMatchObject({ visible: false, enabled: false, reason: 'Only on a map.' });
    expect(commands.describe('plain')).toMatchObject({ visible: true, enabled: true });
    expect(commands.describe('nope')).toMatchObject({ visible: false, enabled: false });
  });

  it('leaves a hidden command out of the list unless asked', () => {
    expect(commands.list().map((def) => def.id)).toEqual(['stamp.flip', 'plain']);
    expect(commands.list({ includeHidden: true }).map((def) => def.id)).toEqual(['stamp.flip', 'brush.flip', 'plain', 'why']);
  });

  it('does not report two commands on one chord as a conflict when their only values differ', () => {
    expect(commands.conflicts()).toEqual([]);
    expect(findShared(useCommandStore.getState())).toEqual([{ chord: 'Alt+X', ids: ['stamp.flip', 'brush.flip'] }]);
  });

  it('still reports a conflict between a command without only and one with only', () => {
    const extra = commands.register([{ id: 'any.flip', label: 'Flip anything', chord: 'Alt+X', run: () => undefined }]);
    expect(commands.conflicts()).toHaveLength(1);
    extra();
  });

  it('keeps a hidden command with an only value in the keymap and drops one without', () => {
    surface = 'none';
    const ids = groupedIds();
    expect(ids).toContain('stamp.flip');
    expect(ids).toContain('brush.flip');
    expect(ids).not.toContain('why');
  });
});
