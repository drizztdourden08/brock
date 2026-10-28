/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import type { CommandDef } from '../src/commands/command.type';
import { registerFresh } from './command-fixtures';

describe('run, describe and meta', () => {
  let unregister = (): void => {};
  let ready = true;
  let on = false;
  const seen: unknown[] = [];
  const command = (def: Omit<CommandDef, 'run'> & Partial<Pick<CommandDef, 'run'>>): CommandDef => ({ run: () => { seen.push(def.id); }, ...def });

  beforeEach(() => {
    ready = true;
    on = false;
    seen.length = 0;
    unregister = registerFresh([
      command({ id: 'plain', label: 'Plain' }),
      command({ id: 'later', label: 'Later', run: async () => { await Promise.resolve(); seen.push('done'); } }),
      command({ id: 'gate', label: 'Gate', when: () => ready, reason: () => (ready ? null : 'Needs a document.') }),
      command({ id: 'bare-gate', label: 'Bare gate', when: () => false }),
      command({ id: 'busy', label: 'Busy', reason: () => (ready ? null : 'A job is running.') }),
      command({ id: 'toggle', label: 'Toggle', checked: () => on }),
      command({ id: 'meta', label: 'Meta', meta: { effect: 'write', args: { type: 'object' } }, run: (context) => { seen.push(context?.trigger); } }),
    ]);
  });

  afterEach(() => unregister());

  it('runs a command, waits for a promise from run and reports ok', async () => {
    await expect(commands.run('plain')).resolves.toEqual({ ok: true });
    await commands.run('later');
    expect(seen).toEqual(['plain', 'done']);
  });

  it('reports an unknown id', async () => {
    const result = await commands.run('nope');
    expect(result).toMatchObject({ ok: false, why: 'unknown' });
  });

  it('reports a gated command with the reason of the command', async () => {
    ready = false;
    await expect(commands.run('gate')).resolves.toEqual({ ok: false, why: 'gated', reason: 'Needs a document.' });
    expect(seen).not.toContain('gate');
  });

  it('gives a gated command without a reason a default one', async () => {
    const result = await commands.run('bare-gate');
    expect(result).toMatchObject({ ok: false, why: 'gated' });
    expect((result as { reason: string }).reason.length).toBeGreaterThan(0);
  });

  it('reports a command whose reason is set as disabled', async () => {
    ready = false;
    await expect(commands.run('busy')).resolves.toEqual({ ok: false, why: 'disabled', reason: 'A job is running.' });
    ready = true;
    await expect(commands.run('busy')).resolves.toEqual({ ok: true });
  });

  it('describes enabled, reason and checked with the gates applied', () => {
    expect(commands.describe('gate')).toEqual({ visible: true, enabled: true, reason: null, checked: false });
    ready = false;
    expect(commands.describe('gate')).toEqual({ visible: true, enabled: false, reason: 'Needs a document.', checked: false });
    expect(commands.describe('busy')).toEqual({ visible: true, enabled: false, reason: 'A job is running.', checked: false });
    on = true;
    expect(commands.describe('toggle')).toEqual({ visible: true, enabled: true, reason: null, checked: true });
  });

  it('passes meta through list and hands the assistant trigger to run', async () => {
    expect(commands.list().find((def) => def.id === 'meta')?.meta).toEqual({ effect: 'write', args: { type: 'object' } });
    await commands.run('meta', { point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: undefined });
    expect(seen).toEqual(['assistant']);
  });
});
