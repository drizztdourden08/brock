/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commandZone } from '../src/commands/command-zone';
import { commands } from '../src/commands/commands';
import { runEditRole } from '../src/commands/run-edit-role';
import { useCommandStore } from '../src/commands/useCommandStore';

describe('an edit role asked by the native menu', () => {
  const ran: string[] = [];
  const run = (id: string) => () => { ran.push(id); };
  let unregister = (): void => {};

  beforeEach(() => {
    ran.length = 0;
    useCommandStore.setState({ sources: [], overrides: {}, mac: true, persist: null });
    unregister = commands.register([
      { id: 'canvas-copy', label: 'Copy pixels', chord: 'Mod+C', zone: 'canvas', run: run('canvas-copy') },
      { id: 'canvas-undo', label: 'Undo stroke', chord: 'Mod+Z', zone: 'canvas', run: run('canvas-undo') },
      { id: 'canvas-redo', label: 'Redo stroke', chord: { mac: 'Mod+Shift+Z', other: 'Mod+Y' }, zone: 'canvas', run: run('canvas-redo') },
      { id: 'locked-paste', label: 'Paste pixels', chord: 'Mod+V', zone: 'canvas', when: () => false, run: run('locked-paste') },
    ]);
  });

  afterEach(() => {
    unregister();
    document.body.replaceChildren();
  });

  const focus = (tag: string, zone?: string): void => {
    document.body.replaceChildren();
    const target = document.createElement(tag);
    const holder = document.createElement('div');
    if (zone !== undefined) holder.setAttribute('data-command-zone', commandZone(zone)['data-command-zone']);
    holder.append(target);
    document.body.append(holder);
    target.focus();
  };

  it('runs the command bound to the chord of the role and reports that it owned it', () => {
    focus('button', 'canvas');
    expect(runEditRole('copy', null)).toBe(true);
    expect(runEditRole('undo', null)).toBe(true);
    expect(runEditRole('redo', null)).toBe(true);
    expect(ran).toEqual(['canvas-copy', 'canvas-undo', 'canvas-redo']);
  });

  it('answers false when no command is bound, so the native role runs', () => {
    focus('button', 'canvas');
    expect(runEditRole('cut', null)).toBe(false);
    expect(runEditRole('selectAll', null)).toBe(false);
    expect(ran).toEqual([]);
  });

  it('answers false when the focus is outside the zone of the command', () => {
    focus('input');
    expect(runEditRole('copy', null)).toBe(false);
    expect(ran).toEqual([]);
  });

  it('answers false while the command is switched off', () => {
    focus('button', 'canvas');
    expect(runEditRole('paste', null)).toBe(false);
  });

  it('reads the Redo chords of the platform', () => {
    useCommandStore.setState({ mac: false });
    focus('button', 'canvas');
    expect(runEditRole('redo', null)).toBe(true);
    expect(ran).toEqual(['canvas-redo']);
  });
});
