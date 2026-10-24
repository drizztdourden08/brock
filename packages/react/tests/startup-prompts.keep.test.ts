/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineStartupPrompt } from '../src/startup/define-startup-prompt';
import { lazyStartupPrompt } from '../src/startup/lazy-startup-prompt';
import { orderStartupPrompts } from '../src/startup/order-startup-prompts';
import { runStartupPrompts } from '../src/startup/run-startup-prompts';
import { startupPromptsFromFiles } from '../src/startup/startup-prompts-from-files';
import { startupContext } from '../src/startup/startup-context';
import type { StartupPromptDef } from '../src/startup/startup.type';
import { createSettingsStore } from '../src/stores/create-settings-store';
import { mergeModules } from '../src/modules/merge-modules';
import { getAppLog } from '../src/log/get-app-log';

const CTX = startupContext({ id: 'p1', name: 'One', created: 1, lastPlayed: 1 }, createSettingsStore({ defaults: {}, load: () => Promise.resolve(null), save: () => Promise.resolve() }));

const noop = (): Promise<void> => Promise.resolve();

afterEach(() => vi.restoreAllMocks());

describe('start-up prompt order', () => {
  it('sorts by order, keeps the registered order between equal ones, and puts an unset order at zero', () => {
    const a = defineStartupPrompt({ id: 'a', run: noop });
    const b = defineStartupPrompt({ id: 'b', order: -5, run: noop });
    const c = defineStartupPrompt({ id: 'c', order: 10, run: noop });
    const d = defineStartupPrompt({ id: 'd', run: noop });
    expect(orderStartupPrompts([c, a, d, b]).map((prompt) => prompt.id)).toEqual(['b', 'a', 'd', 'c']);
  });

  it('lists the files by id, with the file name as the id, and modules ahead of the app on a tie', () => {
    const files = startupPromptsFromFiles([{ id: 'zeta', prompt: { run: noop } }, { id: 'alpha', prompt: { order: 3, run: noop } }]);
    expect(files.map((prompt) => [prompt.id, prompt.order])).toEqual([['alpha', 3], ['zeta', undefined]]);
    const merged = mergeModules([{ id: 'm', startupPrompts: [{ id: 'module', run: noop }] }]);
    expect(orderStartupPrompts([...merged.startupPrompts, ...files]).map((prompt) => prompt.id)).toEqual(['module', 'zeta', 'alpha']);
  });
});

describe('runStartupPrompts', () => {
  it('runs the prompts one at a time, each after the one before has finished', async () => {
    const events: string[] = [];
    const slow = (name: string, ms: number): StartupPromptDef => ({
      id: name,
      run: async () => {
        events.push(`${name} start`);
        await new Promise((resolve) => { setTimeout(resolve, ms); });
        events.push(`${name} end`);
      },
    });
    await runStartupPrompts([slow('first', 20), slow('second', 1)], CTX);
    expect(events).toEqual(['first start', 'first end', 'second start', 'second end']);
  });

  it('hands every prompt the same context', async () => {
    const seen: (typeof CTX)[] = [];
    const take: StartupPromptDef = { run: (ctx) => { seen.push(ctx); return Promise.resolve(); } };
    await runStartupPrompts([take, take], CTX);
    expect(seen).toEqual([CTX, CTX]);
  });

  it('logs a prompt that throws or rejects and runs the next one', async () => {
    const log = vi.fn();
    vi.spyOn(getAppLog(), 'log').mockImplementation(log);
    const ran: string[] = [];
    await runStartupPrompts([
      { id: 'throws', run: () => { throw new Error('boom'); } },
      { id: 'rejects', run: () => Promise.reject(new Error('nope')) },
      { run: () => Promise.reject(new Error('anonymous')) },
      { id: 'last', run: () => { ran.push('last'); return Promise.resolve(); } },
    ], CTX);
    expect(ran).toEqual(['last']);
    const messages = log.mock.calls.map((call) => String(call[1]));
    expect(messages).toEqual([
      'Start-up prompt "throws" failed: boom',
      'Start-up prompt "rejects" failed: nope',
      'Start-up prompt "#3" failed: anonymous',
    ]);
    expect(log.mock.calls.every((call) => call[2] === 'error')).toBe(true);
  });
});

describe('lazyStartupPrompt', () => {
  it('keeps the literal order, loads the file when it runs and passes the context on', async () => {
    const run = vi.fn(noop);
    const load = vi.fn(() => Promise.resolve({ default: defineStartupPrompt({ order: 4, run }) }));
    const lazy = lazyStartupPrompt({ order: 4 }, load);
    expect(lazy.order).toBe(4);
    expect(load).not.toHaveBeenCalled();
    await lazy.run(CTX);
    expect(load).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(CTX);
  });
});
